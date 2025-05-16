import { Chat, ChatWithUser } from "../../types/chat";

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
    <div className="w-1/3 border-r border-gray-300">
      <div className="p-4 bg-gray-100 border-b border-gray-300">
        <h2 className="text-xl font-semibold">Chats</h2>
      </div>
      <div className="overflow-y-auto h-full">
        {chats.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No chats found</div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              className={`flex items-center p-4 border-b border-gray-200 cursor-pointer transition-colors duration-200 
                ${
                  selectedChat?.id === chat.id
                    ? "bg-gray-200"
                    : "hover:bg-gray-100"
                }`}
              onClick={() => onSelectChat(chat)}
            >
              <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center mr-3">
                {chat.user.firstName.charAt(0)}
                {chat.user.lastName.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">
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
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;
