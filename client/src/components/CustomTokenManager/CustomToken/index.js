import React, { useState } from "react";

import "./styles.css";

const CustomToken = (props) => {
    const [inProgress, setInProgress] = useState(false);

    const addToken = async () => {
        console.log("Add token");

        try {
            setInProgress(true);

            const wasAdded = await window.ethereum.request({
                method: "wallet_watchAsset",
                params: {
                    type: "ERC20",
                    options: {
                        address: props.address,
                        symbol: props.symbol,
                        decimals: props.decimals,
                        image: props.img,
                    },
                },
            });

            if (!wasAdded) {
                setInProgress(false);
            }
        } catch (error) {
            console.log(error);
            setInProgress(false);
            alert("Error adding token");
        }
    };

    const removeToken = () => {
        console.log("Remove token");
        props.handleRemove(props.id);
    };

    return (
        <div className="CustomToken">
            <img src={props.img} alt="Token Icon" />
            <p>Address: {props.address}</p>
            <p>Symbol: {props.symbol}</p>
            <p>Decimals: {props.decimals}</p>
            <button onClick={addToken} disabled={inProgress}>
                Add token
            </button>
            <button onClick={removeToken} disabled={inProgress}>
                Remove token
            </button>
        </div>
    );
};

export default CustomToken;
