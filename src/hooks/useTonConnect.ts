// import { Sender, SenderArguments, beginCell, storeStateInit } from "@ton/core";
// import {
// 	toUserFriendlyAddress,
// 	useTonConnectUI,
// 	useTonWallet,
// } from "@tonconnect/ui-react";
// import { useEffect, useState } from "react";
// import { useTonClient } from "./useTonClient";
//
// export function useTonConnect() {
// 	const client = useTonClient();
// 	const [tonConnectUI] = useTonConnectUI();
// 	const wallet = useTonWallet();
// 	const [address, setAddress] = useState("");
//
// 	// const getAddress = () => {
// 	// 	if (wallet?.account.address) {
// 	// 		const raw = wallet.account.address;
// 	// 		const realAddress = toUserFriendlyAddress(raw, true);
// 	// 		setAddress(realAddress);
// 	// 	}
// 	// };
// 	//
// 	// useEffect(() => {
// 	// 	getAddress();
// 	// }, [client, wallet]);
//
// 	return {
// 		// tonConnectUI,
// 		// wallet,
// 		sender: {
// 			send: async (args: SenderArguments) => {
// 				tonConnectUI.sendTransaction({
// 					messages: [
// 						{
// 							address: args.to.toString(),
// 							amount: args.value.toString(),
// 							payload: args.body?.toBoc().toString("base64"),
// 							stateInit: args.init
// 								? beginCell()
// 										.storeWritable(storeStateInit(args.init))
// 										.endCell()
// 										.toBoc()
// 										.toString("base64")
// 								: undefined,
// 						},
// 					],
// 					validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
// 				});
// 			},
// 		},
// 		connected: !!wallet?.account.address,
// 		address: address,
// 		pureAddress: wallet?.account.address,
// 		network: wallet?.account.chain,
// 	};
// }

import { Sender, SenderArguments, beginCell, storeStateInit } from "@ton/core";
import { useTonConnectUI } from "@tonconnect/ui-react";

export function useTonConnect(): { sender: Sender; connected: boolean } {
	const [tonConnectUI] = useTonConnectUI();

	return {
		sender: {
			send: async (args: SenderArguments) => {
				tonConnectUI.sendTransaction({
					messages: [
						{
							address: args.to.toString(),
							amount: args.value.toString(),
							payload: args.body?.toBoc().toString("base64"),
							stateInit: args.init
								? beginCell()
										.storeWritable(storeStateInit(args.init))
										.endCell()
										.toBoc()
										.toString("base64")
								: undefined,
						},
					],
					validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
				});
			},
		},
		connected: tonConnectUI.connected,
	};
}
