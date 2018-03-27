import * as express from "express";
import { getBlockchain, generateNextBlock, getLatestBlock} from "./Blockchain";
import * as WebSocket from "ws";
import * as fs from "fs";
import Block from "./Block";

const expressPort = parseInt(process.env.EPORT);
const wsPort = parseInt(process.env.WSPORT);
console.log(process.env.EPORT);
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
    const data = req.body.data;
    console.log(req.body.data);
    res.sendStatus(200);
  });

  app.listen(port, () => {
    console.log("server listening on port", port);
  });
}

function getSockets() {
  return [];
}


function addPeer(url: string) {
  const ws = new WebSocket(url);
  ws.on("message", message => {
    console.log("message recieved", message);
  });
}

//websockets stuff
const sockets: WebSocket[] = [];

enum MessageType {
  QUERY_LATEST = 0,
  QUERY_ALL = 1,
  RESPONSE_BLOCKCHAIN = 2
}

class Message {
  public type: MessageType;
  public data: any;
}
function initWS(port: number) {
  const wss = new WebSocket.Server({ port });

  wss.on("connection", initWsConnection);

  // wss["broadcast"] = message => {};

  return wss;
}

function initWsConnection(ws: WebSocket) {
  sockets.push(ws);
  initMessageHandler(ws);
  initErrorHandler(ws);
  write(ws, queryChainLengthMessage());
}

function initMessageHandler(ws: WebSocket) {}

function initErrorHandler(ws: WebSocket) {}

function handleBlockchainResponse(recievedBlocks: Block[])

function write(ws: WebSocket, message: Message) {}

function broadcast(message: Message){
  sockets.forEach(socket=>write(socket, message));
}

function queryChainLengthMessage(): Message {
  return { type: MessageType.QUERY_LATEST, data: null };
}

function queryAllMessage(): Message {
  return { type: MessageType.QUERY_ALL, data: null };
}

function responseChainMessage(): Message{
  return {type: MessageType.RESPONSE_BLOCKCHAIN, data: JSON.stringify(getBlockchain())}
}

function responseLatestMessage(): Message{
  return {type: MessageType.RESPONSE_BLOCKCHAIN, data: JSON.stringify(getLatestBlock())}
}
initHttpServer(expressPort || 8888);
const wss = initWS(wsPort || 8080);
