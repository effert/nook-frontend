type MessageHandler = (message: string) => void;

class WebSocketService {
  private socket: WebSocket | null = null;

  public connect(url: string, onMessage: MessageHandler): void {
    this.socket = new WebSocket(url);

    this.socket.onmessage = (event: MessageEvent) => {
      onMessage(event.data);
    };

    this.socket.onerror = (event: Event) => {
      console.error(`WebSocket error: ${event}, ${JSON.stringify(event)}}`);
    };
    this.socket.onclose = function (event) {
      console.error('WebSocket connection closed:', event.code, event.reason);
    };
  }

  public sendMessage(message: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    }
  }

  public close(): void {
    if (this.socket) {
      this.socket.close();
    }
  }

  // 可以添加其他必要的方法和错误处理
}

export default new WebSocketService();
