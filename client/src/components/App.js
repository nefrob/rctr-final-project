import React, { createContext, useState, useEffect } from "react";

import getWeb3 from "../utils/getWeb3";
import Wallet from "./Wallet";
import CustomTokenManager from "./CustomTokenManager";
import "./App.css";

export const Web3Context = createContext({ web3: null });

const App = () => {
    const [web3, setWeb3] = useState(null);

    useEffect(() => {
        const initWeb3 = async () => {
            const web3 = await getWeb3();
            setWeb3(web3);
        };
        initWeb3();
    }, []);

    if (web3 === null) {
        return <div>Loading Web3, accounts, and contract...</div>;
    }

    return (
        <div className="App">
            <h1>React DApp</h1>
            <Web3Context.Provider value={web3}>
                <Wallet />
                <CustomTokenManager tokens={[]} />
            </Web3Context.Provider>
        </div>
    );
};

export default App;
