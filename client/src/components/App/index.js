import React, { createContext, useState, useEffect } from "react";
import { Route, Redirect, Switch } from "react-router-dom";

// import SampleToken1 from "../../contracts/SampleToken1.json";
// import SampleToken2 from "../../contracts/SampleToken2.json";
// import Factory from "../../contracts/Factory.json";
// import Exchange from "../../contracts/Exchange.json";

import Navigation from "../Navigation";
import Home from "../Home";
import Swap from "../Swap";
import Liquidity from "../Liquidity";
import Wallet from "../Wallet";
import TokenManager from "../TokenManager";

import { getWeb3, getContract } from "../../utils/utils";

import "./styles.css";

// const context = {
//     // todo: this needs to be accessible multiple places!
//     web3: null,
//     contracts: {
//         tokens: [getContract(SampleToken1), getContract(SampleToken2)],
//         factory: getContract(Factory),
//         exchange: getContract(Exchange),
//     },
//     account: null,
// };

export const AppContext = createContext();

const App = () => {
    const [web3, setWeb3] = useState(null);

    useEffect(() => {
        const initWeb3 = async () => {
            const web3 = await getWeb3();
            setWeb3(web3);
            AppContext.web3 = web3; // fixme ?
        };
        initWeb3();
    }, []);

    if (web3 === null) {
        return <div>Loading web3, accounts, and contract...</div>;
    }

    return (
        <div className="App">
            <Navigation />
            <br />
            <main>
                <AppContext.Provider value={web3}>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path="/swap" component={Swap} />
                        <Route path="/pool" component={Liquidity} />
                        <Route path="/wallet" component={Wallet} />
                        <Route
                            path="/tokens"
                            render={() => <TokenManager tokens={[]} />}
                        />
                        <Redirect to="/" />
                    </Switch>
                </AppContext.Provider>
            </main>
        </div>
    );
};

export default App;
