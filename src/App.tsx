import { toNano } from "@ton/core";
import { TonClient } from "@ton/ton";
import { TonConnectButton } from "@tonconnect/ui-react";
import { useState } from "react";
import "./App.css";
import {
	getStakerInfo,
	transferJettons,
	useDepositTon,
} from "./hooks/useStakingContract.ts";
import { useTonClient } from "./hooks/useTonClient.ts";
import { useTonConnect } from "./hooks/useTonConnect.ts";

function App() {
	const client = useTonClient();
	const {
		sender,
		tonConnectUI,
		wallet,
		address,
		pureAddress,
		network,
		connected,
	} = useTonConnect();

	// const { sendMessage, sendValue } = useDepositTon();

	const handleClick = () => {
		transferJettons(
			client,
			sender,
			"kQDQtvzM_qf9e_XNpvm195ptyOBGZj5Nql5m2WWQ_9b4bu9m",
			toNano(1),
			false,
		);
	};

	return (
		<>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
				}}
			>
				<TonConnectButton />
			</div>
			<h1>Vite + React</h1>
			<div className="card">
				<button onClick={handleClick}>TRANSFER_JETTONS</button>
			</div>
			<p className="read-the-docs">
				Click on the Vite and React logos to learn more
			</p>
		</>
	);
}

export default App;
