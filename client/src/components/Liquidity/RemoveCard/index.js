import React, { useState, useRef, useEffect, useContext } from "react";
import { Card, Form, InputGroup, Button } from "react-bootstrap";
import { toWei, fromWei } from "../../../utils/utils";

import { AppContext } from "../../App/";

const RemoveCard = () => {
    const [state, dispatch] = useContext(AppContext);

    const [chosenToken, setChosenToken] = useState("");
    const [lpExchangeRate, setLpExchangeRate] = useState({ eth: 0, tokens: 0 });
    const [lpBalance, setLpBalance] = useState(0);
    const [inProgress, setInProgress] = useState(false);

    const lpRef = useRef("");

    const tokenOptions = Object.keys(state.tokens).map((key, index) => {
        return (
            <option key={index} value={key}>
                {key}
            </option>
        );
    });

    useEffect(() => {
        if (
            inProgress ||
            chosenToken === "" ||
            state.account.address === "0x0"
        ) {
            return;
        }

        const updateLpExchangeRate = async () => {
            const exchangeContract = state.exchanges[chosenToken];

            const ethBalance = await window.web3.eth.getBalance(
                exchangeContract._address
            );

            const tokenBalance = await state.tokens[
                chosenToken
            ].contract.methods
                .balanceOf(exchangeContract._address)
                .call();

            const rawLpBalance = await exchangeContract.methods
                .totalSupply()
                .call();

            const lpBalance = fromWei(rawLpBalance);
            if (lpBalance === "0") {
                setLpExchangeRate({
                    eth: 0,
                    tokens: 0,
                });
            } else {
                setLpExchangeRate({
                    eth: fromWei(ethBalance) / lpBalance,
                    tokens: fromWei(tokenBalance) / lpBalance,
                });
            }
        };

        const updateLpBalance = async () => {
            setLpBalance(
                fromWei(
                    await state.exchanges[chosenToken].methods
                        .balanceOf(state.account.address)
                        .call()
                )
            );
        };

        updateLpExchangeRate();
        updateLpBalance();
    }, [chosenToken, inProgress]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const lpAmount = lpRef.current.value;

        if (lpAmount === 0) {
            return;
        }

        console.log("Remove liquidity");

        setInProgress(true);

        try {
            const exchangeContract = state.exchanges[chosenToken];

            await exchangeContract.methods
                .approve(exchangeContract._address, toWei(lpAmount))
                .send({ from: state.account.address });

            await exchangeContract.methods
                .removeLiquidity(toWei(lpAmount))
                .send({
                    from: state.account.address,
                });

            const ethBalance = await window.web3.eth.getBalance(
                state.account.address
            );
            dispatch({ type: "SET_ETH_BALANCE", payload: fromWei(ethBalance) });

            const tokenBalance = await state.tokens[
                chosenToken
            ].contract.methods
                .balanceOf(state.account.address)
                .call();

            dispatch({
                type: "SET_TOKEN_BALANCE",
                payload: {
                    symbol: chosenToken,
                    balance: fromWei(tokenBalance),
                },
            });
        } catch (error) {
            console.error(error);
        }

        lpRef.current.value = 0;

        setInProgress(false);
    };

    const handleTokenPick = (e) => {
        setChosenToken(e.target.value);
    };

    return (
        <div className="RemoveLiquidity">
            <Card>
                <Card.Header>Remove Liquidity</Card.Header>
                <Card.Body>
                    <Card.Title>Burn LP-tokens:</Card.Title>
                    <Form.Group className="mb-2" disabled={inProgress}>
                        <Form.Label>Exchange pool:</Form.Label>
                        <Form.Select
                            className="mb-2"
                            value={chosenToken}
                            onChange={handleTokenPick}
                        >
                            <option value="none" hidden>
                                Select a token pool
                            </option>
                            {tokenOptions}
                        </Form.Select>
                        <Form.Label>LP-tokens:</Form.Label>
                        <InputGroup>
                            <Form.Control
                                ref={lpRef}
                                className="number-form"
                                type="number"
                                placeholder="0"
                            />
                            <InputGroup.Text id="basic-addon1">
                                DREAM
                            </InputGroup.Text>
                        </InputGroup>
                        <Form.Text className="text-muted">
                            Exchange rate: <samp>1</samp> DREAM ={" "}
                            <samp>{lpExchangeRate.eth}</samp> ETH :{" "}
                            <samp>{lpExchangeRate.tokens}</samp>{" "}
                            {chosenToken === "" ? "N/A" : chosenToken}
                            <br />
                            LP available: <samp>{lpBalance}</samp> DREAM
                        </Form.Text>
                    </Form.Group>
                    <Button
                        onClick={handleSubmit}
                        disabled={inProgress || chosenToken === ""}
                    >
                        Remove
                    </Button>
                </Card.Body>
            </Card>
        </div>
    );
};

export default RemoveCard;
