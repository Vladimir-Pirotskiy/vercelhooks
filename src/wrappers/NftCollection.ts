import {
	Address,
	Cell,
	Contract,
	ContractProvider,
	SendMode,
	Sender,
	beginCell,
	contractAddress,
} from "@ton/core";
import {
	decodeOffChainContent,
	encodeOffChainContent,
} from "./contentUtils/offChain";

export type NftConfig = {
	ownerAddress: Address;
	nextItemIndex: number;
	collectionContent: Cell;
	nftItemCode: Cell;
	royaltyParams: RoyaltyParams;
};

export type RoyaltyParams = {
	royaltyFactor: number;
	royaltyBase: number;
	royaltyAddress: Address;
};

export function NftConfigToCell(config: NftConfig): Cell {
	return beginCell()
		.storeAddress(config.ownerAddress)
		.storeUint(config.nextItemIndex, 64)
		.storeRef(config.collectionContent)
		.storeRef(config.nftItemCode)
		.storeRef(
			beginCell()
				.storeUint(config.royaltyParams.royaltyFactor, 16)
				.storeUint(config.royaltyParams.royaltyBase, 16)
				.storeAddress(config.royaltyParams.royaltyAddress),
		)
		.endCell();
}

export class NftCollection implements Contract {
	constructor(
		readonly address: Address,
		readonly init?: { code: Cell; data: Cell },
	) {}

	static createFromAddress(address: Address) {
		return new NftCollection(address);
	}

	static createFromConfig(config: NftConfig, code: Cell, workchain = 0) {
		const data = NftConfigToCell(config);
		const init = { code, data };
		return new NftCollection(contractAddress(workchain, init), init);
	}

	async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
		await provider.internal(via, {
			value,
			sendMode: SendMode.PAY_GAS_SEPARATELY,
			body: beginCell().endCell(),
		});
	}

	async sendMintNft(
		provider: ContractProvider,
		via: Sender,
		opts: {
			value: bigint;
			queryId: number;
			itemIndex: number;
			itemOwnerAddress: Address;
			itemContent: string;
			amount: bigint;
			editor: Address;
		},
	) {
		const nftContent = encodeOffChainContent(opts.itemContent);

		const nftMessage = beginCell();
		nftMessage.storeAddress(opts.itemOwnerAddress);
		nftMessage.storeRef(nftContent);
		nftMessage.storeAddress(opts.editor);
		await provider.internal(via, {
			value: opts.value,
			sendMode: SendMode.PAY_GAS_SEPARATELY,
			body: beginCell()
				.storeUint(1, 32) // operation
				.storeUint(opts.queryId, 64)
				.storeUint(opts.itemIndex, 64)
				.storeCoins(opts.amount)
				.storeRef(nftMessage)
				.endCell(),
		});
	}

	async sendChangeOwner(
		provider: ContractProvider,
		via: Sender,
		opts: {
			value: bigint;
			queryId: bigint;
			newOwnerAddress: Address;
		},
	) {
		await provider.internal(via, {
			value: opts.value,
			sendMode: SendMode.PAY_GAS_SEPARATELY,
			body: beginCell()
				.storeUint(3, 32) //operation
				.storeUint(opts.queryId, 64)
				.storeAddress(opts.newOwnerAddress)
				.endCell(),
		});
	}

	// for offcahin content!
	async getCollectionData(provider: ContractProvider): Promise<{
		nextItemId: number;
		ownerAddress: Address;
		collectionContent: string;
	}> {
		const collection_data = await provider.get("get_collection_data", []);
		const stack = await collection_data.stack;
		const nextItem: bigint = stack.readBigNumber();
		const collectionContent = await stack.readCell();
		const ownerAddress = await stack.readAddress();
		return {
			nextItemId: Number(nextItem),
			collectionContent: decodeOffChainContent(collectionContent),
			ownerAddress: ownerAddress,
		};
	}
}
