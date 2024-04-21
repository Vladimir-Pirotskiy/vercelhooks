import {useEffect, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0);



  useEffect(()=> {

    const syncFunc = async () => {

      // const foo = new TonClient({
      //   endpoint: await getHttpEndpoint({network: "testnet"}),
      // });
      //
      // const mnemonic = 'average quarter switch ten genius present armed siege pigeon family woman episode celery crazy toast build rabbit hold harbor estate kingdom critic prison tooth ';
      // const key = await mnemonicToWalletKey(mnemonic.split(" "));
      // const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
      //
      // // print wallet address
      // console.log(wallet.address.toString({ testOnly: true }));
      //
      // // print wallet workchain
      // console.log("workchain:", wallet.address.workChain);


      console.log();
    }

    syncFunc();
  },[])

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
