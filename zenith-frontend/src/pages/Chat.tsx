import { useEffect, useState, useContext, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { ChatList, ChatWindow, Spinner } from "../components";
import { Chat, ChatWithUser, Message, User } from "../types/chat";
import socketService from "../services/socketService";
import { UserContext } from "../context/UserContext";

interface ChatData {
  chat: Chat;
  user: User;
}

const ChatPage = () => {
  const [searchParams] = useSearchParams();
  const newUserId = searchParams.get("userId");

  const { userToken } = useContext(UserContext);
  const [chats, setChats] = useState<ChatData[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [selectedChatUser, setSelectedChatUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const processingNewChatRef = useRef(false);

  // Transform the current selected chat and user into a ChatWithUser object
  const getChatWithUser = (): ChatWithUser | null => {
    if (!selectedChat || !selectedChatUser) return null;
    return {
      ...selectedChat,
      user: selectedChatUser,
    };
  };

  // Initialize socket connection
  useEffect(() => {
    if (userToken) {
      console.log("Initializing socket connection in Chat.tsx");

      // Disconnect first to ensure a clean connection
      socketService.disconnect();

      // Then connect with the token
      socketService.connect(userToken);

      // Listen for new messages
      const messageListener = (message: any) => {
        console.log("Received message via WebSocket:", message);

        // Don't process the message if it doesn't have a chatId
        if (!message || !message.chatId) {
          console.error("Received invalid message:", message);
          return;
        }

        // Update messages if we're currently viewing this chat
        if (selectedChat && message.chatId === selectedChat.id) {
          console.log("Updating current chat with new message");
          setMessages((prev) => {
            // Check if we already have this message (prevent duplicates)
            if (prev.some((m) => m.id === message.id)) {
              console.log("Message already exists in state, skipping");
              return prev;
            }
            return [message, ...prev];
          });

          // Update the chat's updatedAt time
          const updatedChat = {
            ...selectedChat,
            updatedAt: new Date().toISOString(),
          };
          setSelectedChat(updatedChat);

          // Update the chat in the chats array and move it to the top
          setChats((prevChats) => {
            const updatedChats = prevChats.map((chatData) =>
              chatData.chat.id === selectedChat.id
                ? { ...chatData, chat: updatedChat }
                : chatData
            );

            // Sort chats by updatedAt (most recent first)
            return [...updatedChats].sort(
              (a, b) =>
                new Date(b.chat.updatedAt).getTime() -
                new Date(a.chat.updatedAt).getTime()
            );
          });
        }
        // Otherwise, just update the chat list to show there's new activity
        else {
          console.log("Updating chat list for non-selected chat");
          setChats((prevChats) => {
            const updatedChats = prevChats.map((chatData) =>
              chatData.chat.id === message.chatId
                ? {
                    ...chatData,
                    chat: {
                      ...chatData.chat,
                      updatedAt: new Date().toISOString(),
                    },
                  }
                : chatData
            );

            // Sort chats by updatedAt (most recent first)
            return [...updatedChats].sort(
              (a, b) =>
                new Date(b.chat.updatedAt).getTime() -
                new Date(a.chat.updatedAt).getTime()
            );
          });
        }
      };

      socketService.addMessageListener(messageListener);

      // Listen for connection status
      const connectionListener = (connected: boolean) => {
        console.log(
          "Socket connection status:",
          connected ? "connected" : "disconnected"
        );

        // If we reconnect and have a selected chat, make sure to join that chat's room
        if (connected && selectedChat) {
          console.log("Reconnected, rejoining chat room:", selectedChat.id);
          socketService.joinChat(selectedChat.id);
        }
      };

      socketService.addConnectionListener(connectionListener);

      return () => {
        console.log("Cleaning up socket listeners");
        socketService.removeMessageListener(messageListener);
        socketService.removeConnectionListener(connectionListener);
      };
    }
  }, [userToken, selectedChat]);

  // Add a separate effect to handle chat room joining when selectedChat changes
  useEffect(() => {
    if (selectedChat && userToken && socketService.isConnected()) {
      console.log("Selected chat changed, joining room:", selectedChat.id);
      socketService.joinChat(selectedChat.id);
    }
  }, [selectedChat, userToken]);

  // Fetch all chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        if (!userToken) return;

        const response = await fetch("/api/chats", {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setChats(data);
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [userToken]);

  // Handle new user chat from URL
  useEffect(() => {
    const handleNewUserChat = async () => {
      if (!newUserId || !userToken || processingNewChatRef.current) {
        return;
      }

      // Check if chat already exists with this user
      const existingChat = chats.find(
        (chatData) =>
          chatData.chat.user1Id === parseInt(newUserId) ||
          chatData.chat.user2Id === parseInt(newUserId)
      );

      if (existingChat) {
        handleSelectChat(existingChat.chat, existingChat.user);
      } else {
        // Set reference flag to prevent multiple calls
        processingNewChatRef.current = true;
        try {
          await createNewChat(parseInt(newUserId));
        } finally {
          processingNewChatRef.current = false;
        }
      }
    };

    handleNewUserChat();
  }, [newUserId, userToken]);

  const createNewChat = async (userId: number) => {
    try {
      if (!userToken) return;

      const response = await fetch("/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        const newChatData: ChatData = await response.json();
        // Add the new chat to the list
        setChats((prev) => [...prev, newChatData]);
        // Select the new chat
        handleSelectChat(newChatData.chat, newChatData.user);
      }
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  };

  const handleSelectChat = (chat: Chat, user: User) => {
    console.log(`Selecting chat with ID ${chat.id}`);
    setSelectedChat(chat);
    setSelectedChatUser(user);
    fetchMessages(chat.id);

    // Explicitly join the chat room to ensure we receive messages
    if (socketService.isConnected()) {
      console.log(`Joining chat room ${chat.id} from handleSelectChat`);
      socketService.joinChat(chat.id);
    } else {
      console.log("Socket not connected when trying to join chat room");
      socketService.connect(userToken!);
      setTimeout(() => socketService.joinChat(chat.id), 500); // Give it time to connect
    }
  };

  const fetchMessages = async (chatId: number) => {
    if (!userToken) return;

    try {
      const response = await fetch(`/api/chats/${chatId}/messages`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async (content: string) => {
    if (!selectedChat || !content.trim() || !userToken) return;

    try {
      // Send message to the server but don't update UI directly
      await fetch(`/api/chats/${selectedChat.id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ content }),
      });

      // The message will be received via WebSocket and handled by the messageListener
      // This ensures consistency between sender and receiver UI updates
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // Convert ChatData array to ChatWithUser array for the ChatList component
  const chatsWithUser: ChatWithUser[] = chats.map((chatData) => ({
    ...chatData.chat,
    user: chatData.user,
  }));

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Chat</h1>
      </div>

      <div className="flex h-[calc(100vh-200px)] bg-white rounded-lg shadow-lg overflow-hidden">
        <ChatList
          chats={chatsWithUser}
          selectedChat={selectedChat}
          onSelectChat={(chatWithUser: ChatWithUser) => {
            const chatData = chats.find((c) => c.chat.id === chatWithUser.id);
            if (chatData) {
              handleSelectChat(chatData.chat, chatData.user);
            }
          }}
        />
        <ChatWindow
          chat={getChatWithUser()}
          messages={messages}
          onSendMessage={sendMessage}
        />
      </div>
    </div>
  );
};

export default ChatPage;
