import { createServer } from "http";
import { Server, Socket } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer);

const cacheText = new Map<string, string>();

class Client {
	public isFocused = false;
	public text = '';
	public username: string = '';

	constructor(public socket: Socket, public admin = false) {
		this.socket.on("username", (username) => {
			this.username = username;
		});

		this.socket.on("focus", () => {
			this.isFocused = true;
		});

		this.socket.on("blur", () => {
			this.isFocused = false;
		});

		this.socket.on("text", (text) => {
			this.text = text;
		});

	}

	emit(event: string, data: any) {
		this.socket.emit(event, data);
	}
}

const clients: Map<string, Client> = new Map();

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
	});
});

httpServer.listen(3000);