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

export type StblEscrowConfig = NonNullable<unknown>;

export function stblEscrowConfigToCell(config: StblEscrowConfig): Cell {
	return beginCell().endCell();
}

export class StblEscrow implements Contract {
	constructor(
		readonly address: Address,
		readonly init?: { code: Cell; data: Cell },
	) {}

	static createFromAddress(address: Address) {
		return new StblEscrow(address);
	}

	static createFromConfig(config: StblEscrowConfig, code: Cell, workchain = 0) {
		const data = stblEscrowConfigToCell(config);
		const init = { code, data };
		return new StblEscrow(contractAddress(workchain, init), init);
	}

	async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
		await provider.internal(via, {
			value,
			sendMode: SendMode.PAY_GAS_SEPARATELY,
			body: beginCell().endCell(),
		});
	}

	async getStoredData(provider: ContractProvider): Promise<{
		main_address: Address;
		staker_address: Address;
		stored_data: {
			timestamp: bigint;
			staked_a: bigint;
			current_reward: bigint;
		};
	}> {
		const data = await provider.get("get_stored_data", []);
		const stack = await data.stack;
		const main_address = stack.readAddress();
		const staker_address = stack.readAddress();
		const stored_data = stack.readCell().beginParse();

		const timestamp = BigInt(stored_data.loadInt(256));
		const staked_a = BigInt(stored_data.loadCoins());
		const current_reward = BigInt(stored_data.loadCoins());

		return {
			main_address,
			staker_address,
			stored_data: {
				timestamp: timestamp,
				staked_a: staked_a,
				current_reward: current_reward,
			},
		};
	}
}
