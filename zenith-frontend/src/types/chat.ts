export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: string;
}

export interface Chat {
  id: number;
  createdAt: string;
  updatedAt: string;
  user1Id: number;
  user2Id: number;
}

export interface ChatWithUser extends Chat {
  user: User;
}

export interface Message {
  id: number;
  content: string;
  senderId: number;
  chatId: number;
  createdAt: string;
}
