import React, {useState, useEffect} from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/InfPortal.json"

export default function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  const [addArr, setAddArr] = useState([]);
  const [infArr, setInfArr] = useState([]);
  const contractAddress = "0x7C8DE3B9DdF57495285c6ceb389c1740b77920f0";
  const contractABI = abi.abi;
  let count;
  
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

        count = await InfPortalContract.getTotalInf();
        console.log("total infinities rcvd so far: ", count);

        const infTxn = await InfPortalContract.inf();
        console.log("mining", infTxn.hash);

        await infTxn.wait();
        console.log("mined -- ", infTxn.hash);

        count = await InfPortalContract.getTotalInf();
        console.log("Retrieved total inf count", count.toNumber());

        let addA, infA;
        ({addA, infA} = InfPortalContract.getData());
        setAddArr(addA);
        setInfArr(infA);


        
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

        {count &&
        <div className="bio">
          {count} infinities received so far
        </div>}
      
        <button className="waveButton" onClick={wave}>
          send infinities ∞
        </button>
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            connect wallet
          </button>
        )}
      </div>
      
      {addArr && infArr &&
      <div className="txHistory">
           {addArr.forEach(add => <div className="bio">
                {add} has sent {infArr[addArr.indexOf(add)]} infinities
             </div>)}
      </div>}
      
    </div>
  );
}
