import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./MetaMask.css";
const MetaMask = () => {
  const [error, setError] = useState("");
  const [activeAccount, setActiveAccount] = useState("");
  const [accountList, setAccountList] = useState([]);
  const [bal, setBal] = useState("");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [pending, setPending] = useState(false);
  const [newWallet, setNewWallet] = useState(null);
  const [transactionList, setTransactionList] = useState([]);

  const [addressClass, setAddressClass] = useState("addressDisplay");

  useEffect(() => {
    if (activeAccount && provider) {
      getBal();
      getTransactionHistory({
        address: activeAccount,
        apikey: "UC5BR5S9MUGFZGRK2IPTK9C58UU1DMAIGY",
      });
    }
  }, [activeAccount, provider]);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const prov = new ethers.BrowserProvider(window.ethereum);
        const accounts = await prov.send("eth_requestAccounts", []);

        // const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        const sign = await prov.getSigner();

        setSigner(sign);
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
      // const balance = await provider.send("eth_getBalance", [
      //   activeAccount,
      //   "latest",
      // ]);

      const balance = await provider.getBalance(activeAccount);
      setBal(ethers.formatEther(balance));
    } catch (e) {
      console.log(e);
    }
  };

  const createWallet = async () => {
    try {
      const nWallet = ethers.Wallet.createRandom();
      setNewWallet(nWallet);
      setPending(true);
      console.log(nWallet);
    } catch (e) {
      console.log(e);
    }
  };

  const transferCoin = async (e) => {
    e.preventDefault();
    console.log("transfer to: " + toAddress + "| amount: " + amount);
    try {
      signer.sendTransaction({
        to: toAddress,
        value: ethers.parseUnits(amount, "ether"),
      });
      getTransactionHistory({
        address: activeAccount,
        apikey: "UC5BR5S9MUGFZGRK2IPTK9C58UU1DMAIGY",
      });
      getBal()
      setToAddress("")
      setAmount("")
    } catch (e) {
      console.log(e);
    }
  };

  const getTransactionHistory = async ({
    address,
    start = 0,
    end = 99999999,
    page = 1,
    offset = 10,
    sort = "desc",
    apikey,
  }) => {
    try {
      const res = await fetch(
        `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=${start}&endblock=${end}&page=${page}&offset=${offset}&sort=${sort}&apikey=${apikey}`
      );
      const data = await res.json();
      setTransactionList(data.result);
      // console.log(data)
    } catch (e) {
      console.log(e);
    }
  };

  if (error) return <div>{error}</div>;

  return (
    <div>
      <div className="topBar">
        <h1 className="color-w">Wallet thingy - HQB</h1>
        {activeAccount ? (
          <div className="authInfo">
            <button onClick={() => {
				getBal();
				getTransactionHistory({
					address: activeAccount,
					apikey: "UC5BR5S9MUGFZGRK2IPTK9C58UU1DMAIGY",
				});
			}}>Refresh</button>
          </div>
        ) : (
          <div className="authTab">
            <button onClick={createWallet}>Create</button>
            <button onClick={connectWallet}>Connect</button>
          </div>
        )}
      </div>

      {pending ? (
        <div>
          <h1 className="color-w">Your Mnemonic</h1>
          <p style={{ textWrap: "wrap" }} className="color-w">
            {newWallet.mnemonic.phrase}
          </p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(newWallet.mnemonic.phrase);
            }}
          >
            Copy
          </button>

          <button
            onClick={() => {
              setAccountList([]);
              setActiveAccount(newWallet.address);
              setNewWallet(null);
              setPending(false);
              const prov = new ethers.BrowserProvider(window.ethereum);
              setProvider(prov);
              getTransactionHistory({
                address: newWallet.address,
                apikey: "UC5BR5S9MUGFZGRK2IPTK9C58UU1DMAIGY",
              });
            }}
          >
            Continue
          </button>
        </div>
      ) : (
        <>
          {activeAccount && provider && (
            <div className="body">
              <div className="ctrlPanel">
                <div className="card">
                  <b style={{ fontSize: 20 }}>{bal}&nbsp;</b> <b>ETHs</b>
                  <br />
                  <span
                    className={addressClass}
                    onMouseEnter={(e) => {
                      setAddressClass("addressPopup");
                    }}
                    onMouseLeave={(e) => {
                      setAddressClass("addressDisplay");
                    }}
                    onClick={() => {
                      navigator.clipboard.writeText(activeAccount);
                    }}
                  >
                    {activeAccount}
                  </span>
                </div>
              </div>
              <div className="main">
                <h2 className="color-w">Transfer</h2>
                <form onSubmit={transferCoin}>
                  <table style={{paddingRight: 50}}>
                    <tbody>
                      <tr>
                        <td>
                          <label htmlFor="to" className="color-w">
                            Recipient
                          </label>
                        </td>
                        <td>
                          <input
                            name="to"
                            type="text"
                            value={toAddress}
                            onChange={(e) => {
                              setToAddress(e.target.value);
                            }}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <label htmlFor="amount" className="color-w">
                            Amount
                          </label>
                        </td>
                        <td>
                          <input
                            name="amount"
                            type="number"
                            value={amount}
                            onChange={(e) => {
                              setAmount(e.target.value);
                            }}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <br />
                  <button type="submit" disabled={!(toAddress && amount)}>
                    Transfer
                  </button>
                </form>

                <div>
                  <h2 className="color-w">Transaction History</h2>
                  <table className="history" >
                    <thead>
                      <tr>
                        <th style={{ width: 350 }}>From</th>
                        <th style={{ width: 350 }}>To</th>
                        <th>Amount (etheriums)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactionList.map((tx, index) => {
                        return (
                          <tr key={index}>
                            <td>
                              <span>{tx.from}</span>
                            </td>
                            <td>
                              <span>{tx.to}</span>
                            </td>
                            <td>
                              <span>{ethers.formatEther(tx.value)}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MetaMask;
