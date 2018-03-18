class Block {
	public index: number;
	public hash: string;
	public previousHash: string;
	public timestamp: number;
	public data: string;

	constructor(
		index: number,
		previousHash: string,
		timestamp: number,
		data: string
	) {
		this.index = index;
		this.hash = calculateHash(index, previousHash, timestamp, data);
		this.previousHash = previousHash;
		this.timestamp = timestamp;
		this.data = data;
	}
}


//------------------------------------------------------------------
// server stuff
//------------------------------------------------------------------
// function initHttpServer(port: number) {
// 	const app = express();
// 	app.user(express.json());

// 	app.get("/block", (req, res) => {
// 		res.send(getBlockchain());
// 	});

// 	app.post("/mineBlock", (req, res) => {
// 		const newData = req.body.data;
// 		generateNextBlock(newData);
// 	});

// 	app.post("/peers", (req, res) => {
// 		//TODO: implement
// 		res.sendStatus(200);
// 		// res.send(getSockets.map((s:any)=>s._socket.remoteAddress + ":" + s._socket.remotePort));
// 	});

// 	app.post("/addPeer", (req, res) => {
// 		res.sendStatus(200);
// 	});

// 	app.listen(port, () => {
// 		console.log("server listening on port", port);
// 	});
// }

