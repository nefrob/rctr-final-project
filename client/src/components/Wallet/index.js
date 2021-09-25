import React, { useState, useEffect, useContext } from "react";
import { Button, Card } from "react-bootstrap";

import { AppContext } from "../App";

import WalletTable from "./WalletTable";
import AddTokenForm from "./AddTokenForm";

const Wallet = () => {
    const [state, dispatch] = useContext(AppContext);
    const [accountConnected, setAccountConnected] = useState(
        state.account.address !== "0x0"
    );
    const [gettingBalances, setGetttingBalances] = useState(false);
    const [tokenBalances, setTokenBalances] = useState([]);
    const [addingToken, setAddingToken] = useState(false);

    useEffect(() => {
        setAccountConnected(state.account.address !== "0x0");
        getBalances();
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

    const getBalances = async () => {
        if (state.account.address === "0x0") {
            setTokenBalances([]);
            return;
        }

        console.log("Getting token balances");

        setGetttingBalances(true);

        const ethBalance = await state.web3.eth.getBalance(
            state.account.address
        );
        dispatch({
            type: "SET_ETH_BALANCE",
            payload: state.web3.utils.fromWei(ethBalance),
        });

        const tokenBalances = [];

        for (const symbol in state.tokens) {
            const token = state.tokens[symbol];
            let balance = await token.contract.methods
                .balanceOf(state.account.address)
                .call();
            balance = state.web3.utils.fromWei(balance);

            dispatch({
                type: "SET_TOKEN_BALANCE",
                payload: { symbol, balance },
            });

            tokenBalances.push({
                symbol: symbol,
                image: token.image,
                address: token.contract._address,
                balance: balance,
            });
        }

        setTokenBalances(tokenBalances);
        setGetttingBalances(false);
    };

    const handleTokenAdd = async (newToken) => {
        try {
            setAddingToken(true);

            if (newToken.address[0] !== "0" && newToken.address[1] !== "x") {
                newToken.address = "0x" + newToken.address;
            }

            const wasAdded = await window.ethereum.request({
                method: "wallet_watchAsset",
                params: {
                    type: "ERC20",
                    options: {
                        address: newToken.address,
                        symbol: newToken.symbol,
                        decimals: 18,
                        image: newToken.image,
                    },
                },
            });

            if (!wasAdded) {
                console.log("Token not added to MetaMask wallet.");
            }
        } catch (error) {
            console.error(error);
        }

        setAddingToken(false);
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
                        onClick={getBalances}
                        disabled={gettingBalances || !accountConnected}
                    >
                        Refresh
                    </Button>
                    <Card.Title>Token Balances:</Card.Title>
                    <WalletTable tokens={tokenBalances} />
                    <Card.Title>Add Asset:</Card.Title>
                    <Card.Text className="text-muted">
                        (Adds to conected MetaMask wallet, not to the
                        application)
                    </Card.Text>
                    <AddTokenForm
                        handleAdd={handleTokenAdd}
                        disabled={addingToken || !accountConnected}
                    />
                </Card.Body>
            </Card>
        </div>
    );
};

export default Wallet;
