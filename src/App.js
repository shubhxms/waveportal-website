import React, {useState, useEffect} from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/InfPortal.json"

export default function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  const [msg, setMsg] = useState('');
  const [count, setCount] = useState(0);
  const [allWaves, setAllWaves] = useState([]);
  const [isTxnGoingOn, setIsTxnGoingOn] = useState(false);
  const [txnHash, setTxnHash] = useState("");
  const contractAddress = "0x44f051989abfeCddcE6e67CC6676747d0ce1B809";
  const contractABI = abi.abi;
  

  
  const checkIfWalletConnected = async () => {
    try{
      const {ethereum} = window;
      if(!ethereum){
        console.log("ensure that you have a wallet installed");
      }else{
        console.log("ethereum object is here!");
      }
      const accounts = await ethereum.request({method:"eth_accounts"});
      if (accounts.length !== 0){
        const account = accounts[0];
        console.log("Found an authorized account");
        setCurrentAccount(account);
        getAllWaves();
      }else{
        console.log("no authorized account found");
      }
    }catch(error){
      console.log(error);
    }
    
  }

  const connectWallet = async () => {
    try{
      const {ethereum} = window;
      
      if(!ethereum){
        alert("get metamask");
        return;
      }
      const accounts = await ethereum.request({method:'eth_requestAccounts'})
      console.log("connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    }catch(error){
      console.log(error);
    }
  }


  const wave = async () => {
    try{
      const {ethereum} = window;

      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const InfPortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        
        

        const infTxn = await InfPortalContract.inf(msg, { gasLimit: 300000 });
        console.log("mining", infTxn.hash);


        if(!infTxn.confirmation){
          setIsTxnGoingOn(true);
          setTxnHash(infTxn.hash);
        }
        await infTxn.wait()
        setIsTxnGoingOn(false)
        

        console.log("mined -- ", infTxn.hash);

        // count = await InfPortalContract.getTotalInf();
        // console.log("Retrieved total inf count", count.toNumber());

        // let dataArr;
        // dataArr = await InfPortalContract.getData();
        // console.log(dataArr);
        // setAddArr(dataArr[0]);
        // setInfArr(dataArr[1]);

        // await updateData();

        
      }else{
        console.log("ethereum object DNE");
      }
    }catch(error){
      console.log(error);
    }
  }
  
  useEffect(() => {
    checkIfWalletConnected();
    getAllWaves();
  }, []);

  const getAllWaves = async () => {
    try{
      const {ethereum} = window;
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const InfPortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        const waves = await InfPortalContract.getAllWaves();
        // let tempCount = await InfPortalContract.getTotalInf();
        setCount(allWaves.length);
        console.log("total infinities rcvd so far: ", count);
        console.log(waves);
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });
        setAllWaves(wavesCleaned);
        setCount(waves.length);
      }else{
        console.log("ethereum obj DNE");
      }
    }catch(error){
      console.log(error);
    }
  }

  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        Hey there! 
        </div>

        <div className="bio">
        ∞∞∞ <br/> I am <a href="https://twitter.com/shubhxms">shubham</a> and I am pretty cool.<br/>Connect your Ethereum wallet and send infinities at me!<br/> ∞∞∞
        </div>

        
        <div className="bio">
          {count} infinities received so far
        </div>

        <input
          type='text'
          id='msg'
          value={msg}
          onChange={e => setMsg(e.target.value)}
        />

        <button className="waveButton" onClick={() =>
        msg !== '' ?
          wave(msg) : alert("please add some message") }>
          send infinities ∞
        </button>
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            connect wallet
          </button>
        )}

          {/* <div className="txHistory">
           {addArr.map(add => <div className="bio">
                {add} has sent {infArr[addArr.indexOf(add)]} infinities
          </div>)} */}

          {isTxnGoingOn &&
            <div>
              mining block {txnHash}
              deets at <a href={`https://goerli.etherscan.io/tx/${txnHash}`}>goerli ethescan</a>
            </div>
            }

          <div>
            {allWaves.map(wave => (
              <div>
                {wave.address} said {wave.message}
                {console.log(wave)}
              </div>
            ))}
          </div>

      {/* </div> */}
        
      </div>
      
      
     
      
    </div>
  );
}
