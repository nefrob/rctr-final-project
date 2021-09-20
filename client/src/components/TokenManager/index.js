import React, { useState, useRef, useContext, useEffect } from "react";

import { AppContext } from "../App";
import TokenEntry from "./TokenEntry";
import SampleToken1 from "../../contracts/SampleToken1.json";

const CustomTokenManager = ({ tokens }) => {
    const [tokensList, setTokensList] = useState(tokens);

    const web3 = useContext(AppContext);

    useEffect(() => {
        const getContract = async () => {
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = SampleToken1.networks[networkId];
            const instance = new web3.eth.Contract(
                SampleToken1.abi,
                deployedNetwork && deployedNetwork.address
            );

            console.log(
                "contract: ",
                networkId,
                deployedNetwork,
                deployedNetwork.address
            );
        };

        getContract();
    }, []);

    const defaultToken = {
        address: "",
        symbol: "",
        decimals: "",
        img: "",
    };

    const addressRef = useRef("");
    const symbolRef = useRef("");
    const decimalsRef = useRef("");
    const imgRef = useRef("");

    const handleSubmit = (e) => {
        e.preventDefault();

        setTokensList([
            ...tokensList,
            {
                address: addressRef.current.value,
                symbol: symbolRef.current.value,
                decimals: decimalsRef.current.value,
                img: imgRef.current.value,
            },
        ]);
    };

    const handleRemove = (index) => {
        setTokensList(tokensList.filter((token, i) => i !== index));
    };

    let tokenItems = tokensList.map((token, i) => {
        return (
            <li key={i}>
                <TokenEntry {...token} handleRemove={handleRemove} id={i} />
            </li>
        );
    });

    return (
        <div className="CustomTokenManager">
            <h1>Tokens List</h1>

            <div>Add token:</div>
            <form>
                <input
                    ref={addressRef}
                    type="text"
                    name="addr"
                    placeholder="Token address"
                />
                <input
                    ref={symbolRef}
                    type="text"
                    name="sym"
                    placeholder="Token symbol"
                />
                <input
                    ref={decimalsRef}
                    type="number"
                    name="dec"
                    placeholder="Token decimals"
                />
                <input
                    ref={imgRef}
                    type="text"
                    name="img"
                    placeholder="Token image url"
                />
                <button type="reset" onClick={handleSubmit}>
                    Submit
                </button>
            </form>

            <div>Custom Tokens:</div>
            {tokenItems}
        </div>
    );
};

export default CustomTokenManager;
