export interface MessageViewModel {
  id: number;
  chatId: number;
  senderId: number;
  content: string;
  timestamp: Date;
  sender: {
    id: number;
    name: string;
    username: string;
    avatarUrl?: string;
  };
}
