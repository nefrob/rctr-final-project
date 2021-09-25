import React, { createContext, useState, useReducer, useEffect } from "react";
import { Route, Redirect, Switch } from "react-router-dom";

import SampleToken1 from "../../contracts/SampleToken1.json";
import SampleToken2 from "../../contracts/SampleToken2.json";
import Factory from "../../contracts/Factory.json";
// import Exchange from "../../contracts/Exchange.json";

import Navigation from "../Navigation";
import Home from "../Home";
import Swap from "../Swap";
import Liquidity from "../Liquidity";
import Wallet from "../Wallet";
import TokenManager from "../TokenManager";

import { getWeb3, getContract } from "../../utils/utils";

import "./styles.css";

export const AppContext = createContext();

const App = () => {
    const appReducer = (state, action) => {
        switch (action.type) {
            case "SET_WEB3":
                return { ...state, web3: action.payload };
            case "SET_EXCHANGE":
                return { ...state, exchange: action.payload };
            case "SET_FACTORY":
                return { ...state, factory: action.payload };
            case "ADD_TOKEN":
                return {
                    ...state,
                    tokens: {
                        ...state.tokens,
                        ...action.payload,
                    },
                };
            case "SET_ACCOUNT":
                return { ...state, account: action.payload };
            case "SET_TOKEN_BALANCE":
                return {
                    ...state,
                    tokens: {
                        ...state.tokens,
                        [action.payload.symbol]: {
                            ...state.tokens[action.payload.symbol],
                            balance: action.payload.balance,
                        },
                    },
                };
            default:
                return state;
        }
    };

    const [loading, setLoading] = useState(true);

    const [state, dispatch] = useReducer(appReducer, {
        web3: null,
        exchange: null,
        factory: null,
        tokens: {},
        account: { address: "0x0", balance: 0 },
    });

    const handleAccountsChanged = async (accounts) => {
        if (accounts.length === 0) {
            console.log("No account found");

            dispatch({
                type: "SET_ACCOUNT",
                payload: { address: "0x0", balance: 0 },
            });
        } else if (state.account.address !== accounts[0]) {
            console.log("Account changed");
            console.log(accounts);

            console.log("Getting balance");
            const balance = window.web3.utils.fromWei(
                await window.web3.eth.getBalance(accounts[0])
            );

            dispatch({
                type: "SET_ACCOUNT",
                payload: { address: accounts[0], balance },
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

    useEffect(() => {
        const initState = async () => {
            const web3 = await getWeb3();
            dispatch({ type: "SET_WEB3", payload: web3 });

            // const exchange = await getContract(Exchange, web3);
            // dispatch({ type: "SET_EXCHANGE", payload: exchange });
            const factory = await getContract(Factory, web3);
            dispatch({ type: "SET_FACTORY", payload: factory });

            const tokens = [SampleToken1, SampleToken2];
            for (const token of tokens) {
                const contract = await getContract(token, web3);
                const symbol = await contract.methods.symbol().call();
                dispatch({
                    type: "ADD_TOKEN",
                    payload: {
                        [symbol]: {
                            contract: contract,
                            symbol: symbol,
                            image: null, // todo: image url!
                            balance: 0,
                        },
                    },
                });
            }

            console.log("Initialize wallet triggers");

            try {
                window.ethereum.on("chainChanged", handleChainIdChanged);

                await window.ethereum
                    .request({ method: "eth_accounts" })
                    .then((accounts) => {
                        handleAccountsChanged(accounts);
                    })
                    .catch((err) => {
                        console.error(err);
                    });

                window.ethereum.on("accountsChanged", handleAccountsChanged);
                window.ethereum.on("disconnect", handleDisconnect);
            } catch (error) {
                alert("Failed to load account.");
                console.error(error);
            }

            setLoading(false);
        };

        initState();
    }, []);

    if (loading) {
        return <div>Loading web3, accounts, and contract...</div>;
    }

    return (
        <div className="App">
            <Navigation />
            <br />
            <main>
                <AppContext.Provider value={[state, dispatch]}>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path="/swap" component={Swap} />
                        <Route path="/pool" component={Liquidity} />
                        <Route path="/wallet" component={Wallet} />
                        <Route path="/tokens" component={TokenManager} />
                        <Redirect to="/" />
                    </Switch>
                </AppContext.Provider>
            </main>
        </div>
    );
};

export default App;
