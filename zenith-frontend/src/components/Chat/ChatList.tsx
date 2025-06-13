import { Chat, ChatWithUser } from "../../types/chat";
import { motion, AnimatePresence } from "framer-motion";

interface ChatListProps {
  chats: ChatWithUser[];
  selectedChat: Chat | null;
  onSelectChat: (chat: ChatWithUser) => void;
}

const ChatList: React.FC<ChatListProps> = ({
  chats,
  selectedChat,
  onSelectChat,
}) => {
  return (
    <div className="w-1/3 border-r border-gray-300 bg-white shadow-soft">
      <div className="p-4 bg-primary/10 border-b border-gray-300">
        <h2 className="text-xl font-semibold text-primary">Chats</h2>
      </div>
      <div className="overflow-y-auto h-full">
        <AnimatePresence>
          {chats.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 text-center text-gray-500"
            >
              No chats found
            </motion.div>
          ) : (
            chats.map((chat, index) => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center p-4 border-b border-gray-200 cursor-pointer transition-all duration-300 
                  ${
                    selectedChat?.id === chat.id
                      ? "bg-primary/10 shadow-md"
                      : "hover:bg-primary/5 hover:shadow-sm"
                  }`}
                onClick={() => onSelectChat(chat)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center mr-3 shadow-md"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {chat.user.firstName.charAt(0)}
                  {chat.user.lastName.charAt(0)}
                </motion.div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">
                    {chat.user.firstName} {chat.user.lastName}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {/* Show last message preview if available */}
                    Click to view conversation
                  </p>
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(chat.updatedAt).toLocaleDateString()}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatList;
