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




const genesisBlock: Block = new Block(
	0,
	null,
	new Date().getTime() / 1000,
	"genesis"
);

let blockChain: Block[] = [genesisBlock];

function getLatestBlock(): Block {
	return blockChain[blockChain.length - 1];
}

function calculateHash(
	index: number,
	previousHash: string,
	timestamp: number,
	data: string
): string {
	return CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
}

function generateNextBlock(blockData: string): Block {
	const previousBlock = getLatestBlock();
	const nextIndex = previousBlock.index + 1;
	const nextTimestamp = new Date().getTime();

	return new Block(nextIndex, previousBlock.hash, nextTimestamp, blockData);
}

function isValidNewBlock(newBlock: Block, previousBlock: Block): boolean {
	if (previousBlock.index + 1 !== newBlock.index) {
		console.log("invalid index, rejecting new block...");
		return false;
	}

	if (previousBlock.hash !== newBlock.previousHash) {
		console.log("hashes don't match");
		return false;
	}

	if (
		calculateHash(
			newBlock.index,
			newBlock.previousHash,
			newBlock.timestamp,
			newBlock.data
		) !== newBlock.hash
	) {
		console.log("bad block hash, rejecting...");
		return false;
	}

	return true;
}

function isValidBlockStructure(block: Block): boolean {
	return (
		typeof block.index === "number" &&
		typeof block.hash === "string" &&
		typeof block.previousHash === "string" &&
		typeof block.timestamp === "number" &&
		typeof block.data === "string"
	);
}

function isValidChain(chain: Block[]): boolean {
	if (JSON.stringify(chain[0]) !== JSON.stringify(genesisBlock)) {
		return false;
	}
	for (let i = 1; i < chain.length; i++) {
		if (
			!isValidBlockStructure(chain[i]) ||
			!isValidNewBlock(chain[i - 1], chain[i])
		)
			return false;
	}
	return true;
}

function replaceChain(newBlocks) {
	if (isValidChain(newBlocks) && newBlocks.length > getBlockchain().length) {
		console.log("betterChain detected, replaceing");
		blockChain = newBlocks;
		broadcastLatest();
	}
}

function getBlockchain() {return blockChain; }

function broadcastLatest() {}


//------------------------------------------------------------------
// server stuff
//------------------------------------------------------------------
function initHttpServer(port: number) {
	const app = express();
	app.user(express.json());

	app.get("/block", (req, res) => {
		res.send(getBlockchain());
	});

	app.post("/mineBlock", (req, res) => {
		const newData = req.body.data;
		generateNextBlock(newData);
	});

	app.post("/peers", (req, res) => {
		//TODO: implement
		res.sendStatus(200);
		// res.send(getSockets.map((s:any)=>s._socket.remoteAddress + ":" + s._socket.remotePort));
	});

	app.post("/addPeer", (req, res) => {
		res.sendStatus(200);
	});

	app.listen(port, () => {
		console.log("server listening on port", port);
	});
}
