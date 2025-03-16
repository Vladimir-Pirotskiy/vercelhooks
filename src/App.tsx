import {Address, fromNano, toNano} from "@ton/core";
import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react";
import "./App.css";
import {getStakerInfo, transferJettons, unstake} from "./hooks/useStakingContract.ts";
import { useTonClient } from "./hooks/useTonClient.ts";
import { useTonConnect } from "./hooks/useTonConnect.ts";
import {useState} from "react";


const ORIGINAL = "kQDQtvzM_qf9e_XNpvm195ptyOBGZj5Nql5m2WWQ_9b4bu9m";
const STAKING_CONTRACT_ADDRESS_VVV = 'EQA59hMJF48xI7EKDtSTqzS8kYXjxVWsECt5Lh9LZi7XoDcL'

const STAKING_CONTRACT_ADDRESS = ORIGINAL;


// const STAKING_CONTRACT_ADDRESS = original;
const unstaleValue = 10;
const stakeValue = 10;

function App() {
	const client = useTonClient();
	const { sender } = useTonConnect();
	const userFriendlyAddress = useTonAddress();

	const [info, setInfo] = useState({});

	// const senderAddres = Address.parse(userFriendlyAddress);

	const handleClick = () => {
		const parsedSenderAddress = Address.parse(userFriendlyAddress);
		transferJettons(
			client,
			sender,
			STAKING_CONTRACT_ADDRESS,
			toNano(stakeValue),
			false,
			parsedSenderAddress,
		);
	};
	const handleUnstakeClick = () => {
		unstake(
			client,
			sender,
			STAKING_CONTRACT_ADDRESS,
			toNano(unstaleValue),
		);
	};
	const handleGetStakerInfoClick = async () => {
		const resp = await getStakerInfo(
			client,
			userFriendlyAddress,
			STAKING_CONTRACT_ADDRESS,
		);
		const processedInfo = {
			timestamp: resp.timestamp.toString(),
			staked_a: resp.staked_a.toString(),
			current_reward: fromNano(resp.current_reward.toString()),

		};

		console.log('hello');
		console.log("info", resp);
		setInfo(processedInfo);

	};

	return (
		<>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
				}}
			>
				<TonConnectButton />
			</div>
			<h1>Stake - {stakeValue} Unstake - {unstaleValue}</h1>
			<h3>STAKING_CONTRACT_ADDRESS - {STAKING_CONTRACT_ADDRESS}</h3>
			<div className="card">
				<button onClick={handleClick}>TRANSFER-stake</button>
			</div>
			<div className="card">
				<button onClick={handleUnstakeClick}>unstake</button>
			</div>
			<div className="card">
				<h3>getStakerInfo</h3>
				<button onClick={handleGetStakerInfoClick}>unstake</button>
			</div>
			<pre>infp - {JSON.stringify(info)}</pre>
			<p className="read-the-docs">Click on the Button to check your luck</p>
		</>
	);
}

export default App;
