import { Address, toNano } from "@ton/core";
import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react";
import "./App.css";
import { transferJettons } from "./hooks/useStakingContract.ts";
import { useTonClient } from "./hooks/useTonClient.ts";
import { useTonConnect } from "./hooks/useTonConnect.ts";

function App() {
	const client = useTonClient();
	const { sender } = useTonConnect();
	const userFriendlyAddress = useTonAddress();

	const handleClick = () => {
		const parsedSenderAddress = Address.parse(userFriendlyAddress);
		transferJettons(
			client,
			sender,
			"kQDQtvzM_qf9e_XNpvm195ptyOBGZj5Nql5m2WWQ_9b4bu9m",
			toNano(50),
			false,
			parsedSenderAddress,
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
