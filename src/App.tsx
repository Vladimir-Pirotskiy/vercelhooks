import {useEffect, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {mnemonicToWalletKey} from "@ton/crypto";
import {WalletContractV4} from "@ton/ton";
import {useTonConnect} from "./hooks/custom-hooks/useTonConnect.ts";
import { transferJettons} from "./hooks/custom-hooks/useStakingContract.ts";
import {useTonClient} from "./hooks/useTonClient.ts";
import {toNano} from "@ton/core";
import {TonConnectButton} from "@tonconnect/ui-react";

function App() {
  const [count, setCount] = useState(0);
  const client = useTonClient();
  const {
    wallet,
    address,
    pureAddress,
    sender,
    network,
    connected,
    tonConnectUI} = useTonConnect();


  const syncFunc = async () => {
    if (client) {
      try{
      transferJettons(
        client,
        sender,
        'kQDQtvzM_qf9e_XNpvm195ptyOBGZj5Nql5m2WWQ_9b4bu9m',
        toNano(1),
        true,
      );

      } catch (e) {
        console.log(e);
      }
    }
  }


    const handleClick = () => {
      syncFunc().catch((e)=> console.log(e))
    }


  return (
    <>
      <div style={{
        display: "flex",
        justifyContent: 'center',

      }}>
        <TonConnectButton />

      </div>
      <h1>Vite + React</h1>
      <div className="card">
      <button
      onClick={handleClick}
      >TRANSFER_JETTONS</button>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
