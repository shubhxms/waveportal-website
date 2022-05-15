import React, {useState, useEffect} from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/InfPortal.json"

export default function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  const contractAddress = "0x7fC64f4f9D05231f965a59e060FD88dae5B4Db10";
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

        let count = await InfPortalContract.getTotalInf();
        console.log("total infinities rcvd so far: ", count);

        const infTxn = await InfPortalContract.inf();
        console.log("mining", infTxn.hash);

        await infTxn.wait();
        console.log("mined -- ", infTxn.hash);

        count = await InfPortalContract.getTotalInf();
        console.log("Retrieved total inf count", count.toNumber());



        
      }else{
        console.log("ethereum object DNE");
      }
    }catch(error){
      console.log(error);
    }
  }
  
  useEffect(() => {
    checkIfWalletConnected();
  }, []);

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        Hey there! 
        </div>

        <div className="bio">
        ∞∞∞ I am shubham and I am pretty cool. Connect your Ethereum wallet and send infinities at me! we are, after all, at the  beginning of infinity ∞∞∞
        </div>

        <button className="waveButton" onClick={wave}>
          send infinities ∞
        </button>
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            connect wallet
          </button>
        )}
      </div>
    </div>
  );
}
