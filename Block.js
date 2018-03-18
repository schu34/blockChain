var Block = /** @class */ (function () {
    function Block(index, previousHash, timestamp, data) {
        this.index = index;
        this.hash = calculateHash(index, previousHash, timestamp, data);
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
    }
    return Block;
}());
function getLatestBlock() {
    return blockChain[blockChain.length - 1];
}
function calculateHash(index, previousHash, timestamp, data) {
    return CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
}
var genesisBlock = new Block(0, null, new Date().getTime() / 1000, "genesis");
function generateNextBlock(blockData) {
    var previousBlock = getLatestBlock();
    var nextIndex = previousBlock.index + 1;
    var nextTimestamp = new Date().getTime();
    return new Block(nextIndex, previousBlock.hash, nextTimestamp, blockData);
}
function isValidNewBlock(newBlock, previousBlock) {
    if (previousBlock.index + 1 !== newBlock.index) {
        console.log("invalid index, rejecting new block...");
        return false;
    }
    if (previousBlock.hash !== newBlock.previousHash) {
        console.log("hashes don't match");
        return false;
    }
    if (calculateHash(newBlock.index, newBlock.previousHash, newBlock.timestamp, newBlock.data) !== newBlock.hash) {
        console.log("bad block hash, rejecting...");
        return false;
    }
    return true;
}
function isValidBlockStructure(block) {
    return (typeof block.index === "number" &&
        typeof block.hash === "string" &&
        typeof block.previousHash === "string" &&
        typeof block.timestamp === "number" &&
        typeof block.data === "string");
}
function isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(genesisBlock)) {
        return false;
    }
    for (var i = 1; i < chain.length; i++) {
        if (!isValidBlockStructure(chain[i]) ||
            !isValidNewBlock(chain[i - 1], chain[i]))
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
function getBlockchain() {
    return blockChain;
}
function broadcastLatest() { }
function initHttpServer(port) {
    var app = express();
    app.user(express.json());
    app.get("/block", function (req, res) {
        res.send(getBlockchain());
    });
    app.post("/mineBlock", function (req, res) {
        var newData = req.body.data;
        generateNextBlock(newData);
    });
    app.post("/peers", function (req, res) {
        res.send(getSockets.map(function (s) { return s._socket.remoteAddress + ":" + s._socket.remotePort; }));
    });
    app.post("/addPeer", function (req, res) {
        res.sendStatus(200);
    });
    app.listen(port, function () {
        console.log("server listening on port", port);
    });
}
var blockChain = [genesisBlock];
