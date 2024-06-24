import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

const MetaMask = () => {
  const [error, setError] = useState("");
  const [activeAccount, setActiveAccount] = useState("");
  const [accountList, setAccountList] = useState([]);
  const [bal, setBal] = useState("");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    if (activeAccount && provider) {
      getBal();
    }
  }, [activeAccount, provider]);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const prov = new ethers.BrowserProvider(window.ethereum);
        const accounts = await prov.send("eth_requestAccounts", []);

        // const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

        setProvider(prov);
        setAccountList(accounts);
        setActiveAccount(accounts[0]);
      } catch (e) {
        console.log(e);
      }
    } else {
      // provider = ethers.getDefaultProvider()

      setError("Install MetaMask please.");
    }
  };

  const getBal = async () => {
    try {
      const balance = await provider.send("eth_getBalance", [
        activeAccount,
        "latest",
      ]);
      
      setBal(ethers.formatEther(balance));
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <h1>MetaMask connection</h1>
      <button onClick={connectWallet}>Connect</button>
      <h3>Address: {activeAccount}</h3>
      <h3>Balance: {bal}</h3>
      {error}
    </div>
  );
};

export default MetaMask;
