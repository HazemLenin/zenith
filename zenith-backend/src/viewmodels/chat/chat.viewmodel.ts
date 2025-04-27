export interface ChatViewModel {
  id: number;
  participants: {
    id: number;
    name: string;
    username: string;
    avatarUrl?: string;
  }[];
  lastMessage?: {
    content: string;
    timestamp: Date;
    senderId: number;
  };
  unreadCount: number;
  createdAt: Date;
}
