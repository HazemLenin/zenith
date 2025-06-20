import { useState, useRef, useEffect, useContext } from "react";
import { ChatWithUser, Message } from "../../types/chat";
import { UserContext } from "../../context/UserContext";
import socketService from "../../services/socketService";
import { motion, AnimatePresence } from "framer-motion";

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
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useContext(UserContext);
  const currentUserId = currentUser?.id;

  // Initialize socket connection
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      socketService.connect(token);
    }

    return () => {
      socketService.disconnect(); // Disconnect when component unmounts
    };
  }, []);

  // Log when chat changes but don't join rooms - handled by parent
  useEffect(() => {
    if (chat) {
      console.log(`Chat changed in ChatWindow component: ${chat.id}`);
    }
  }, [chat]);

  // Listen for new messages via socket
  useEffect(() => {
    const messageListener = (message: any) => {
      // Only add messages for the current chat
      if (chat && message.chatId === chat.id) {
        console.log("Received message via socket:", message);
        // messages are handled by the parent component (Chat.tsx)
      }
    };

    socketService.addMessageListener(messageListener);

    return () => {
      socketService.removeMessageListener(messageListener);
    };
  }, [chat]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && chat) {
      // Use the onSendMessage prop from the parent component
      // This will handle the HTTP request and state updates
      onSendMessage(newMessage);
      setNewMessage("");
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
      <div className="p-4 bg-gray-100 border-b border-gray-300">
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
      </div>

      {/* Messages area */}
      <div
        className="flex-1 overflow-y-auto p-4 bg-gray-50"
        ref={messageContainerRef}
      >
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-4">
            No messages yet. Start the conversation!
          </div>
        ) : (
          // Sort messages by createdAt timestamp (oldest first)
          <AnimatePresence>
            {[...messages]
              .sort(
                (a, b) =>
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime()
              )
              .map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
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
                </motion.div>
              ))}
          </AnimatePresence>
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
