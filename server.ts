import { createServer } from "http";
import { Server, Socket } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer);

const cacheText = new Map<string, string>();

const gameState = {
	started: false,
	timer: 0,
	audioUrl: '',
	audioPaused: false,
	audioTime: 0,
};

class Client {
	public isFocused = false;
	public text = '';
	public username: string = '';

	constructor(public socket: Socket, public admin = false) {
		this.emit("audioUrl", gameState.audioUrl);
		audioSync();

		this.socket.on("start", () => {
			if (this.admin) {
				if (!gameState.started) {
					gameState.audioUrl = '/la-clairiere-des-souris-et-des-hommes-john-steinbeck.mp3';
					io.emit("audioUrl", gameState.audioUrl);
				}
				gameState.started = true;
				gameState.audioPaused = false;
				audioSync();
			}
		});

		this.socket.on("verify", () => {
			if (this.admin) {
				gameState.started = false;
				gameState.audioPaused = true;
				audioSync();
			}
		});

		this.socket.on("pause", () => {
			if (this.admin) {
				gameState.audioPaused = true;
				audioSync();
			}
		});

		this.socket.on("joinAdmin", (_, cb) => {
			this.admin = true;
			this.socket.join("admin");
			this.emit("clients", getClients());
			cb(gameState);
		});

		this.socket.on("joinUser", (username, cb) => {
			this.username = username;
			io.to("admin").emit("clients", getClients());
			cb(gameState);
		});

		this.socket.on("focus", () => {
			this.isFocused = true;
			io.to("admin").emit("clients", getClients());
		});

		this.socket.on("blur", () => {
			this.isFocused = false;
			io.to("admin").emit("clients", getClients());
		});

		this.socket.on("text", (text) => {
			this.text = text;
			io.to("admin").emit("clients", getClients());
		});

	}

	emit(event: string, data: any) {
		this.socket.emit(event, data);
	}
}

const clients: Map<string, Client> = new Map();

const getClients = () => Array.from(clients.values()).filter(c => !c.admin).map((client) => {
	return {
		id: client.socket.id,
		name: client.username,
		text: client.text,
		isFocused: client.isFocused,
	};
})

const audioSync = () => {
	io.emit("audioSync", { currentTime: gameState.audioTime, isPlaying: !gameState.audioPaused });
}

io.on("connection", (socket) => {
	console.log("a user connected", socket.id);

	const client = new Client(socket);
	clients.set(socket.id, client);

	if (cacheText.has(client.username)) {
		client.text = cacheText.get(client.username) || '';
		cacheText.delete(client.username);
		client.emit("text", client.text);
	}

	socket.on("disconnect", (disconnectReason) => {
		console.log("a user disconnected", disconnectReason);
		clients.delete(socket.id);
		cacheText.set(client.username, client.text);
		io.to("admin").emit("clients", getClients());
	});
});

httpServer.listen(3000);