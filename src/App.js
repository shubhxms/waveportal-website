import React, {useState, useEffect} from "react";
import { ethers } from "ethers";
import './App.css';

export default function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  
  const checkIfWalletConnected = () => {
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


  const wave = () => {
    
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
