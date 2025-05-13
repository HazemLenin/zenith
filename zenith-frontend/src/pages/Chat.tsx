import { useEffect, useState, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { ChatList, ChatWindow, NewChatForm } from "../components";
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
  const [showNewChatForm, setShowNewChatForm] = useState(false);

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
      socketService.connect(userToken);

      // Listen for new messages
      const messageListener = (message: any) => {
        // Update messages if we're currently viewing this chat
        if (selectedChat && message.chatId === selectedChat.id) {
          setMessages((prev) => [message, ...prev]);

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
            return updatedChats.sort(
              (a, b) =>
                new Date(b.chat.updatedAt).getTime() -
                new Date(a.chat.updatedAt).getTime()
            );
          });
        }
        // Otherwise, just update the chat list to show there's new activity
        else {
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
            return updatedChats.sort(
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
      };

      socketService.addConnectionListener(connectionListener);

      return () => {
        socketService.removeMessageListener(messageListener);
        socketService.removeConnectionListener(connectionListener);
      };
    }
  }, [userToken, selectedChat]);

  // Fetch all chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        if (!userToken) return;

        const response = await fetch("http://localhost:3000/api/chats", {
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
    if (newUserId && userToken) {
      // Check if chat already exists
      const existingChat = chats.find(
        (chatData) =>
          chatData.chat.user1Id === parseInt(newUserId) ||
          chatData.chat.user2Id === parseInt(newUserId)
      );

      if (existingChat) {
        handleSelectChat(existingChat.chat, existingChat.user);
      } else {
        // Create a new chat with this user
        createNewChat(parseInt(newUserId));
      }
    }
  }, [newUserId, chats, userToken]);

  const createNewChat = async (userId: number) => {
    try {
      if (!userToken) return;

      const response = await fetch("http://localhost:3000/api/chats", {
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
    setSelectedChat(chat);
    setSelectedChatUser(user);
    fetchMessages(chat.id);
  };

  const fetchMessages = async (chatId: number) => {
    if (!userToken) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/chats/${chatId}/messages`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

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
      const response = await fetch(
        `http://localhost:3000/api/chats/${selectedChat.id}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({ content }),
        }
      );

      if (response.ok) {
        const newMessage = await response.json();
        setMessages((prev) => [newMessage, ...prev]);

        // Update the chat's updatedAt time indirectly by updating the chat list
        // This is a simplified approach - in a real app you might want to sort the chats again
        const updatedChat = {
          ...selectedChat,
          updatedAt: new Date().toISOString(),
        };
        setSelectedChat(updatedChat);

        // Update the chat in the chats array
        setChats((prevChats) =>
          prevChats.map((chatData) =>
            chatData.chat.id === selectedChat.id
              ? { ...chatData, chat: updatedChat }
              : chatData
          )
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
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
        <button
          onClick={() => setShowNewChatForm(!showNewChatForm)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
        >
          {showNewChatForm ? "Hide New Chat Form" : "New Chat"}
        </button>
      </div>

      {showNewChatForm && <NewChatForm />}

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
