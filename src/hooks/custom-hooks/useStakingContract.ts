import { Address, beginCell, toNano } from "@ton/core";
import type { TonClient } from "@ton/ton";
import { JettonMinter } from "../../wrappers/JettonMinter.ts";
import { StblEscrow } from "../../wrappers/StblEscrow.ts";
import { StblStaking } from "../../wrappers/StblStaking.ts";
import { JettonWallet } from "../../wrappers/jetton/JettonWallet.ts";
// kQDQtvzM_qf9e_XNpvm195ptyOBGZj5Nql5m2WWQ_9b4bu9m

const StableMetal_Master_Address_Testnet = Address.parse(
	"kQARKVp3AZGrdaEqIQh-LSBleBT5TzhqijPpULLXO0HriC2_",
); // testnet
const StableMetal_Master_Address = Address.parse(
	"EQD5ty5IxV3HECEY1bbbdd7rNNY-ZcA-pAIGQXyyRZRED9v3",
); // mainnet

export async function transferJettons(
	// deposit
	client: TonClient,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	sender: any,
	stakingContract: string,
	jettonAmmount: bigint,
	mainnet: boolean,
	// StableMetal_Master
) {
	let master;
	if (mainnet) {
		master = await client.open(
			JettonMinter.createFromAddress(StableMetal_Master_Address),
		);
	} else {
		master = client.open(
			JettonMinter.createFromAddress(StableMetal_Master_Address_Testnet!),
		);
	}

	const userJettonWalletAddress = await master.getWalletAddress(sender.address);
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
		sender.address,
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
	client: TonClient,
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
