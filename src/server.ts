import * as express from "express";
import { getBlockchain, generateNextBlock } from "./Blockchain";
import * as WebSocket from "ws";

const expressPort = parseInt(process.env.EPORT);
const wsPort = parseInt(process.env.WSPORT);
console.log(process.env.EPORT)
function broadcastLatest() {}

function initHttpServer(port: number) {
	const app = express();
	app.use(express.json());

	app.get("/block", (req, res) => {
		res.send(getBlockchain());
	});

	app.post("/mineBlock", (req, res) => {
		const newData = req.body.data;
		generateNextBlock(newData);
	});

	app.post("/peers", (req, res) => {
		res.send(
			getSockets().map(
				(s: any) => s._socket.remoteAddress + ":" + s._socket.remotePort
			)
		);
	});

	app.post("/addPeer", (req, res) => {
		addPeer(req.body.url);
		res.sendStatus(200);
	});

	app.post("/broadcast", (req, res) => {
		const  data = req.body.data ;
		console.log(req.body.data)
		broadcast("broadcasting from " + (wsPort|| 8888) + "\n" + data);
		res.sendStatus(200);
	});

	app.listen(port, () => {
		console.log("server listening on port", port);
	});
}

function getSockets() {
	return [];
}

function broadcast(data: string) {
	console.log("going to broadcast", data);
	(wss.clients as any).forEach(client => {
	console.log("found client...");
	if (client.readyState === WebSocket.OPEN) {
	console.log("client is ready sending data", data);
			client.send(data);
		}
	});
}

function addPeer(url: string) {
	const ws = new WebSocket(url);
	ws.on("message", message => {
		console.log("message recieved", message);
	});
}

//websockets stuff
function initWS(port: number) {
	const wss = new WebSocket.Server({ port });

	wss.on("connection", ws => {
		console.log("connection recieved");
		ws.on("message", message => {
			console.log("recieved message", message);
		});
	});

	// wss["broadcast"] = message => {};

	return wss;
}

initHttpServer(expressPort || 8888);
const wss = initWS( wsPort || 8080);
