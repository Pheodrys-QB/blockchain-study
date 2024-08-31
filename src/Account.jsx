import React from "react";

const Account = ({ walletAddr, balance, transferCoin , provider}) => {
    const [toAddress, setToAddress] = useState("");
    const [amount, setAmount] = useState("");

    const transferCoin = async (e) => {
        e.preventDefault();
        signer.sendTransaction({
          to: toAddress,
          value: 1,
        });
      };  
  return (
    <div>
      <h3>Address: {walletAddr}</h3>
      <h3>Balance: {balance}</h3>
      <h2>Transfer</h2>
      <form onSubmit={transferCoin}>
        <label htmlFor="to">Recipient</label>
        <input
          name="to"
          type="text"
          value={toAddress}
          onChange={(e) => {
            setToAddress(e.target.value);
          }}
        />
        <label htmlFor="amount">Amount</label>
        <input
          name="amount"
          type="number"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
          }}
        />

        <button type="submit" disabled={!(toAddress && amount)}>
          Transfer
        </button>
      </form>
    </div>
  );
};

export default Account;
