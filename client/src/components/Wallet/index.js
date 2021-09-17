import React, { useState, useEffect, useContext } from "react";

import { Web3Context } from "../App";
import "./styles.css";

const Wallet = () => {
    const [chainId, setChainId] = useState(false);
    const [account, setAccount] = useState({
        address: "0x0",
        balance: 0,
    });
    const [connectActive, setConnectActive] = useState(false);

    const web3 = useContext(Web3Context);

    const handleAccountsChanged = async (accounts) => {
        if (accounts.length === 0) {
            console.log("No account found");

            setAccount({
                address: "0x0",
                balance: 0,
            });

            setConnectActive(false);
        } else if (account.address !== accounts[0]) {
            console.log("Account changed");
            console.log(accounts);

            const balance = await updateBalance(accounts[0]);

            setAccount({
                address: accounts[0],
                balance: balance,
            });
        } else {
            console.log("Account not changed?");
        }
    };

    const handleChainIdChanged = (chainId) => {
        console.log("Chain changed to", chainId);
        window.location.reload();
    };

    const handleDisconnect = (error) => {
        console.error(error);
        alert("MetaMask disconnect from network.");
        window.location.reload();
    };

    const updateBalance = async (address) => {
        console.log("Getting balance");
        const balance = await web3.eth.getBalance(address);
        return web3.utils.fromWei(balance);
    };

    const initWallet = async () => {
        console.log("Initialize wallet");

        try {
            setChainId(
                await window.ethereum.request({
                    method: "eth_chainId",
                })
            );
            window.ethereum.on("chainChanged", handleChainIdChanged);

            await window.ethereum
                .request({ method: "eth_accounts" })
                .then((accounts) => {
                    setConnectActive(true); // initial connection
                    handleAccountsChanged(accounts);
                })
                .catch((err) => {
                    console.error(err);
                });

            window.ethereum.on("accountsChanged", handleAccountsChanged);

            window.ethereum.on("disconnect", handleDisconnect);
        } catch (error) {
            alert("Failed to load web3 or accounts.");
            console.error(error);
        }
    };

    useEffect(() => {
        initWallet();
    }, []);

    const connectWallet = async () => {
        console.log("Connect wallet");
        setConnectActive(true);

        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
        } catch (error) {
            console.error(error);
            setConnectActive(false);
        }
    };

    return (
        <div className="Wallet">
            <h1>MetaMask Account</h1>
            <div>Address: {account.address}</div>
            <div>Balance: {account.balance} ETH</div>
            <button onClick={connectWallet} disabled={connectActive}>
                Connect
            </button>
            <div>(Account can be switched in MetaMask)</div>
        </div>
    );
};

export default Wallet;
