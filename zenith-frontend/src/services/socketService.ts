// This service uses socket.io-client for WebSocket communication
import { io, Socket } from "socket.io-client";

interface Message {
  type: string;
  chatId: number;
  content: string;
}

interface ChatJoinData {
  chatId: number;
  status: string;
}

class SocketService {
  private socket: Socket | null = null;
  private messageListeners: ((message: Message) => void)[] = [];
  private connectionListeners: ((isConnected: boolean) => void)[] = [];
  private url: string;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(url: string) {
    this.url = url;
  }

  connect(token: string) {
    if (this.socket) {
      console.log("Disconnecting existing socket before reconnecting");
      this.socket.disconnect();
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    console.log("Connecting to socket server with token");

    // Connect with authentication token
    this.socket = io(this.url, {
      query: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 5000,
    });

    this.socket.on("connect", () => {
      console.log("Socket.io connection established with ID:", this.socket?.id);
      this.notifyConnectionListeners(true);
    });

    this.socket.on("disconnect", (reason: string) => {
      console.log("Socket.io connection closed:", reason);
      this.notifyConnectionListeners(false);
    });

    this.socket.on("connect_error", (error: Error) => {
      console.error("Socket.io connection error:", error.message);
      // If we get an authentication error, we should not try to reconnect automatically
      // as the token might be invalid
      if (error.message.includes("Authentication error")) {
        this.socket?.disconnect();
      }
    });

    this.socket.on("newMessage", (message: Message) => {
      console.log("Received newMessage event with data:", message);
      this.notifyMessageListeners(message);
    });

    // Listen for join confirmations
    this.socket.on("joinedChat", (data: ChatJoinData) => {
      console.log(
        `Received confirmation of joining chat ${data.chatId} with status ${data.status}`
      );
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  joinChat(chatId: number) {
    if (!this.socket?.connected) {
      console.error("Socket is not connected, cannot join chat:", chatId);
      return;
    }

    console.log(`Joining chat room: chat_${chatId}`);
    this.socket.emit("joinChat", chatId);
  }

  sendMessage(chatId: number, content: string) {
    if (!this.socket?.connected) {
      console.error("Socket is not connected");
      return;
    }

    const message: Message = {
      type: "message",
      chatId,
      content,
    };

    this.socket.emit("message", message);
  }

  addMessageListener(listener: (message: Message) => void) {
    this.messageListeners.push(listener);
  }

  removeMessageListener(listener: (message: Message) => void) {
    this.messageListeners = this.messageListeners.filter((l) => l !== listener);
  }

  addConnectionListener(listener: (isConnected: boolean) => void) {
    this.connectionListeners.push(listener);
  }

  removeConnectionListener(listener: (isConnected: boolean) => void) {
    this.connectionListeners = this.connectionListeners.filter(
      (l) => l !== listener
    );
  }

  private notifyMessageListeners(message: Message) {
    this.messageListeners.forEach((listener) => listener(message));
  }

  private notifyConnectionListeners(isConnected: boolean) {
    this.connectionListeners.forEach((listener) => listener(isConnected));
  }

  isConnected() {
    return this.socket?.connected || false;
  }
}

// Create a singleton instance
const socketService = new SocketService(window.location.origin);

export default socketService;
