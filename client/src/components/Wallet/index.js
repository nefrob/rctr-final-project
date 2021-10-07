import React, { useState, useContext } from "react";
import { Alert, Button, Card } from "react-bootstrap";

import { AppContext } from "../App";

import WalletTable from "./WalletTable";
import AddTokenForm from "./AddTokenForm";

import { fromWei } from "../../utils/utils";

const Wallet = () => {
    const [state, dispatch] = useContext(AppContext);

    const [connectingAccount, setConnectingAccount] = useState(false);
    const [gettingBalances, setGetttingBalances] = useState(false);
    const [addingToken, setAddingToken] = useState(false);

    const connectWallet = async () => {
        console.log("Connect wallet");
        setConnectingAccount(true);

        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
        } catch (error) {
            console.error(error);
        }

        setConnectingAccount(false);
    };

    const getBalances = async () => {
        if (state.account.address === "0x0") {
            return;
        }

        console.log("Refreshing token balances");

        setGetttingBalances(true);
        const ethBalance = await window.web3.eth.getBalance(
            state.account.address
        );
        dispatch({ type: "SET_ETH_BALANCE", payload: fromWei(ethBalance) });

        for (const symbol in state.tokens) {
            const tokenBalance = await state.tokens[symbol].contract.methods
                .balanceOf(state.account.address)
                .call();

            dispatch({
                type: "SET_TOKEN_BALANCE",
                payload: { symbol: symbol, balance: fromWei(tokenBalance) },
            });
        }

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
                        disabled={
                            state.account.address !== "0x0" || connectingAccount
                        }
                    >
                        Connect
                    </Button>
                    <br />

                    <Button
                        className="mb-2"
                        variant="secondary"
                        onClick={getBalances}
                        disabled={
                            gettingBalances ||
                            state.account.address === "0x0" ||
                            connectingAccount
                        }
                    >
                        Refresh
                    </Button>
                    <Card.Title>Token Balances:</Card.Title>
                    <WalletTable
                        tokens={
                            state.account.address === "0x0" ? {} : state.tokens
                        }
                    />

                    <Card.Title>Add Asset:</Card.Title>
                    <Card.Text className="text-muted">
                        (Adds to connected MetaMask wallet, not to the
                        application)
                    </Card.Text>
                    {state.account.address === "0x0" ? (
                        <Alert variant="warning">
                            You must connect a wallet before using this feature.
                        </Alert>
                    ) : (
                        <AddTokenForm
                            handleAdd={handleTokenAdd}
                            disabled={
                                addingToken ||
                                state.account.address === "0x0" ||
                                connectingAccount
                            }
                        />
                    )}
                </Card.Body>
            </Card>
        </div>
    );
};

export default Wallet;
