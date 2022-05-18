import React, {useState, useEffect} from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/InfPortal.json"

export default function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  const [msg, setMsg] = useState('');
  // const [addArr, setAddArr] = useState([]);
  // const [infArr, setInfArr] = useState([]);
  const [count, setCount] = useState(0);
  const [allWaves, setAllWaves] = useState([]);
  const contractAddress = "0x982C33e4670773E8beE6855f393e070a0Ad08B95";
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

        let tempCount = await InfPortalContract.getTotalInf();
        setCount(parseInt(tempCount["_hex"]));
        console.log("total infinities rcvd so far: ", count);

        const infTxn = await InfPortalContract.inf("this is a message");
        console.log("mining", infTxn.hash);

        await infTxn.wait();
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
  }, []);

  const getAllWaves = async () => {
    try{
      const {ethereum} = window;
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const InfPortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        const waves = await InfPortalContract.getAllWaves();
        console.log(waves);
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.water,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });
        setAllWaves(wavesCleaned);
      }else{
        console.log("ethereum obj DNE");
      }
    }catch(error){
      console.log(error);
    }
  }

  // const updateData = async () => {
  //   try{
  //     const {ethereum} = window;

  //     if(ethereum){
  //       const provider = new ethers.providers.Web3Provider(ethereum);
  //       const signer = provider.getSigner();
  //       const InfPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

  //       let tempCount;
  //       tempCount = await InfPortalContract.getTotalInf();
  //       setCount(parseInt(tempCount["_hex"]));
  //       console.log("Retrieved total inf count", count);

  //       console.log("count: ",count);
  //       let dataArr;
  //       dataArr = await InfPortalContract.getData();
  //       console.log(dataArr);
  //       setAddArr(dataArr[0]);
  //       let tempInfArr = [];
  //       for(let i = 0; i< dataArr[1].length; i++){
  //         console.log(dataArr[1]);
  //         console.log(dataArr[1][i]);
  //         console.log(parseInt(dataArr[1][i]["_hex"]));
  //         tempInfArr.push(parseInt(dataArr[1][i]["_hex"]));
  //         console.log(tempInfArr);
  //       }
  //       console.log(tempInfArr)
  //       setInfArr(tempInfArr);

  //     }else{
  //       console.log("ethereum obj DNE");
  //     }
      
  //   }catch(error){
  //     console.log(error);
  //   }
  // }
  
  // if(count === 0 && addArr.length === 0){
  //   updateData();
  // }

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
          alert("please add some message") : wave(msg)}>
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


      {/* </div> */}
        
      </div>
      
      
     
      
    </div>
  );
}
