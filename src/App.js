import React, {useEffect} from "react";
import { ethers } from "ethers";
import './App.css';

export default function App() {

  const checkIfWalletConnected = () => {
    const {ethereum} = window;
    if(!ethereum){
      console.log("ensure that you have a wallet installed");
    }else{
      console.log("ethereum object is here!");
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
      </div>
    </div>
  );
}
