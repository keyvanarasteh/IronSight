type WebSocketCallback = (msg: unknown) => void;

class QrsWebSocket {
	#listeners = new Set<WebSocketCallback>();

	onMessage(callback: WebSocketCallback) {
		this.#listeners.add(callback);
		return () => {
			this.#listeners.delete(callback);
		};
	}

	send(data: unknown) {
		console.log('[qrsWebSocket Mock] Sending data:', data);
		
		// Simulate a mock response for AI Chat to prevent hanging
		setTimeout(() => {
			for (const listener of this.#listeners) {
				listener({
					channel: 'ai.chat',
					event: 'chat_token',
					data: { delta: 'This is a mocked AI response based on the missing websocket store.', done: true }
				});
			}
		}, 1000);
	}
}

export const qrsWebSocket = new QrsWebSocket();
