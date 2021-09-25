import React, { useState, useEffect, useContext } from "react";
import { Button, Card } from "react-bootstrap";

import { AppContext } from "../App";

import WalletTable from "./WalletTable";

const Wallet = () => {
    const [state, dispatch] = useContext(AppContext);
    const [accountConnected, setAccountConnected] = useState(
        state.account.address !== "0x0"
    );
    const [gettingBalances, setGetttingBalances] = useState(false);
    const [tokenBalances, setTokenBalances] = useState([]);

    useEffect(() => {
        setAccountConnected(state.account.address !== "0x0");
        getTokenBalances();
    }, [state.account.address]);

    const connectWallet = async () => {
        console.log("Connect wallet");
        setAccountConnected(true);

        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
        } catch (error) {
            console.error(error);
            setAccountConnected(false);
        }
    };

    const getTokenBalances = async () => {
        if (state.account.address === "0x0") {
            setTokenBalances([]);
            return;
        }

        console.log("Getting token balances");

        setGetttingBalances(true);

        const tokenBalances = [];

        for (const symbol in state.tokens) {
            const token = state.tokens[symbol];
            const balance = await token.contract.methods
                .balanceOf(state.account.address)
                .call();

            tokenBalances.push({
                symbol: symbol,
                image: token.image,
                balance: state.web3.utils.fromWei(balance),
            });
        }

        setTokenBalances(tokenBalances);
        setGetttingBalances(false);
    };

    return (
        <div className="Wallet">
            <Card>
                <Card.Header>Wallet</Card.Header>
                <Card.Body>
                    <Card.Title>Account information:</Card.Title>
                    <Card.Text>
                        Address: <code>{state.account.address}</code>
                        <br />
                        ETH: <samp>{state.account.balance}</samp>
                    </Card.Text>
                    <Button
                        className="mb-2"
                        variant="primary"
                        onClick={connectWallet}
                        disabled={accountConnected}
                    >
                        Connect
                    </Button>
                    <br />
                    <Button
                        className="mb-2"
                        variant="secondary"
                        onClick={getTokenBalances}
                        disabled={gettingBalances || !accountConnected}
                    >
                        Refresh
                    </Button>
                    <Card.Title>Token Balances:</Card.Title>
                    <WalletTable tokens={tokenBalances} />
                </Card.Body>
            </Card>
        </div>
    );
};

export default Wallet;
