import {SHA256} from "crypto-js";

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
		this.hash = Block.calculateHash(index, previousHash, timestamp, data);
		this.previousHash = previousHash;
		this.timestamp = timestamp;
		this.data = data;
	}

	static calculateHash(
		index: number,
		previousHash: string,
		timestamp: number,
		data: string
	): string {
		return SHA256(
			index + previousHash + timestamp + data
		).toString();
	}
}

export default Block;
