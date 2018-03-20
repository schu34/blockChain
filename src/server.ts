import * as express from "express";
import { getBlockchain, generateNextBlock } from "./Blockchain";
import * as WebSocket from "ws";

const expressPort = parseInt(process.env.EPORT);
const wsPort = parseInt(process.env.WSPORT);

function broadcastLatest() {}

function initHttpServer(port: number) {
	const app = express();
	app.use(express.json());

	app.get("/bjjlock", (req, res) => {
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
		res.sendStatus(200);
	});

	app.listen(port, () => {
		console.log("server listening on port", port);
	});
}



//websockets stuff
function initWS(port: number){
	const wss = new WebSocket.Server({port})

	wss.on("connection", (ws)=>{
		console.log('connection recieved', ws);
		ws.on("message", (message)=>{
			console.log("recieved message", message);
		})
	})

	return wss;
}


function getSockets() {
	return [];
}


initHttpServer(expressPort || 8888);
const wss = initWS(wsPort || 8080);
