import { Address, beginCell, toNano } from "@ton/core";
import { TonClient } from "@ton/ton";
import { JettonMinter } from "../wrappers/JettonMinter.ts";
import { StblEscrow } from "../wrappers/StblEscrow";
import { StblStaking } from "../wrappers/StblStaking";
import { JettonWallet } from "../wrappers/jetton/JettonWallet";


const TEST_MASTER = Address.parse('kQCAYccnmMhCv9i5PP2MrYEXJFz5u6Ni1RZhNQJrY4aN_CfX');

const StableMetal_Master_Address_Testnet = Address.parse(
	"kQARKVp3AZGrdaEqIQh-LSBleBT5TzhqijPpULLXO0HriC2_",
); // testnet
const StableMetal_Master_Address = Address.parse(
	"EQD5ty5IxV3HECEY1bbbdd7rNNY-ZcA-pAIGQXyyRZRED9v3",
); // mainnet
const MY_ADDRESS = Address.parse(
	"0QDor1P72rZAGX2BAFQCujsZaczsxQ_kImy94thMHYzCrVPQ",
); // testnet

export async function transferJettons(
	// deposit
	client: TonClient,
	sender: any,
	stakingContract: string,
	jettonAmmount: bigint,
	mainnet: boolean,
	senderAddress: Address,
) {
	let master;

	if (mainnet) {
		master = client.open(
			JettonMinter.createFromAddress(StableMetal_Master_Address),
		);
	} else {
		master = client.open(
			JettonMinter.createFromAddress(StableMetal_Master_Address_Testnet),
		);
	}

	const userJettonWalletAddress = await master.getWalletAddress(senderAddress);
	const jettonWallet = client.open(
		JettonWallet.createFromAddress(
			Address.parse(userJettonWalletAddress.toString()),
		),
	);

	await jettonWallet.sendTransfer(
		sender,
		toNano("0.6"),
		jettonAmmount,
		Address.parse(stakingContract),
		senderAddress,
		beginCell().endCell(),
		toNano("0.4"),
		beginCell().endCell(),
	);
}

export async function unstake(
	// unstake
	client: TonClient,
	sender: any,
	stakingContractAddress: string,
	jettonAmount: bigint, // should be precise
) {
	const stakingContract = client.open(
		StblStaking.createFromAddress(Address.parse(stakingContractAddress)),
	);

	await stakingContract.sendUnstake(sender, {
		query_id: BigInt(Math.floor(Math.random() * 1000)),
		value: toNano("0.6"),
		jettonsAmount: jettonAmount,
	});
}

export async function getStakerInfo(
	// get staker info
	client: TonClient | any,
	stakerAddress: string | Address,
	stakingContractAddress: string,
) {
	const stakingContract = client.open(
		StblStaking.createFromAddress(Address.parse(stakingContractAddress)),
	);

	const escrowAddress = await stakingContract.getEscrowByStaker(
		typeof stakerAddress === "string"
			? Address.parse(stakerAddress)
			: stakerAddress,
	);

	const userEscrow = client.open(StblEscrow.createFromAddress(escrowAddress));

	const userData = await userEscrow.getStoredData();

	return userData.stored_data;
}


