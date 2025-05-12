import { useState, useRef, useEffect, useContext } from "react";
import { ChatWithUser, Message } from "../../types/chat";
import { UserContext } from "../../context/UserContext";
import socketService from "../../services/socketService";

interface ChatWindowProps {
  chat: ChatWithUser | null;
  messages: Message[];
  onSendMessage: (content: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  chat,
  messages,
  onSendMessage,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useContext(UserContext);
  const currentUserId = currentUser?.id;
  const [isConnected, setIsConnected] = useState(false);

  // Initialize socket connection
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      socketService.connect(token);
    }

    const connectionListener = (connected: boolean) => {
      setIsConnected(connected);
    };

    socketService.addConnectionListener(connectionListener);

    return () => {
      socketService.removeConnectionListener(connectionListener);
      socketService.disconnect(); // Disconnect when component unmounts
    };
  }, []);

  // Join chat room when chat changes
  useEffect(() => {
    if (chat && isConnected) {
      console.log(`Joining chat room for chat ID ${chat.id}`);
      socketService.joinChat(chat.id);
    }
  }, [chat, isConnected]);

  // Listen for new messages via socket
  useEffect(() => {
    const messageListener = (message: any) => {
      // Only add messages for the current chat
      if (chat && message.chatId === chat.id) {
        // This would be handled by the parent component in a real app
        // For now, we'll just rely on the messages prop
      }
    };

    socketService.addMessageListener(messageListener);

    return () => {
      socketService.removeMessageListener(messageListener);
    };
  }, [chat]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && chat) {
      console.log("Sending message:", newMessage);
      // Always send via socket if connected
      if (isConnected) {
        console.log("Sending message:", newMessage);
        console.log(`Sending message via socket to chat ${chat.id}`);
        socketService.sendMessage(chat.id, newMessage);
        setNewMessage("");
      } else {
        console.log("Sending message:", newMessage);
        // Fall back to HTTP if socket is not connected
        console.log(`Sending message via HTTP to chat ${chat.id}`);
        onSendMessage(newMessage);
        setNewMessage("");
      }
    }
  };

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat header */}
      <div className="p-4 bg-gray-100 border-b border-gray-300 flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center mr-3">
            {chat.user.firstName.charAt(0)}
            {chat.user.lastName.charAt(0)}
          </div>
          <div>
            <h3 className="font-medium">
              {chat.user.firstName} {chat.user.lastName}
            </h3>
          </div>
        </div>
        <div className="text-xs">
          {isConnected ? (
            <span className="text-green-500 flex items-center">
              <span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span>
              Online
            </span>
          ) : (
            <span className="text-gray-500 flex items-center">
              <span className="h-2 w-2 bg-gray-500 rounded-full mr-1"></span>
              Offline
            </span>
          )}
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-4">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-[70%] mb-2 p-3 rounded-lg ${
                message.senderId === currentUserId
                  ? "ml-auto bg-primary text-white rounded-br-none"
                  : "bg-white border border-gray-200 rounded-bl-none"
              }`}
            >
              <p>{message.content}</p>
              <div
                className={`text-xs mt-1 ${
                  message.senderId === currentUserId
                    ? "text-gray-200"
                    : "text-gray-500"
                }`}
              >
                {new Date(message.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-gray-300 flex"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-r-lg hover:bg-primary-dark"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
