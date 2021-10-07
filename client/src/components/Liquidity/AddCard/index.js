import React, { useState, useRef, useEffect, useContext } from "react";
import { Card, Form, InputGroup, Button } from "react-bootstrap";

import { AppContext } from "../../App/";

import { toWei, fromWei } from "../../../utils/utils";

const AddCard = () => {
    const [state, dispatch] = useContext(AppContext);

    const [chosenToken, setChosenToken] = useState("");
    const [poolSize, setPoolSize] = useState({ eth: 0, tokens: 0 });
    const [inProgress, setInProgress] = useState(false);

    const ethRef = useRef(0);
    const tokenRef = useRef(0);

    const tokenOptions = Object.keys(state.tokens).map((key, index) => {
        return (
            <option key={index} value={key}>
                {key}
            </option>
        );
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const eth = ethRef.current.value;
        const tokens = tokenRef.current.value;

        if (eth === 0 || tokens === 0) {
            return;
        }

        console.log("Add liquidity");

        setInProgress(true);

        try {
            await state.tokens[chosenToken].contract.methods
                .approve(state.exchanges[chosenToken]._address, toWei(tokens))
                .send({ from: state.account.address });

            await state.exchanges[chosenToken].methods
                .addLiquidity(toWei(tokens))
                .send({
                    value: toWei(eth),
                    from: state.account.address,
                });

            await updateBalances();
        } catch (error) {
            console.error(error);
        }

        ethRef.current.value = 0;
        tokenRef.current.value = 0;

        setInProgress(false);
        setChosenToken("");
    };

    const updateBalances = async () => {
        const ethBalance = await window.web3.eth.getBalance(
            state.account.address
        );
        dispatch({ type: "SET_ETH_BALANCE", payload: fromWei(ethBalance) });

        const tokenBalance = await state.tokens[chosenToken].contract.methods
            .balanceOf(state.account.address)
            .call();

        dispatch({
            type: "SET_TOKEN_BALANCE",
            payload: {
                symbol: chosenToken,
                balance: fromWei(tokenBalance),
            },
        });
    };

    const handleTokenPick = (e) => {
        setChosenToken(e.target.value);
    };

    useEffect(() => {
        const updatePoolSize = async () => {
            if (chosenToken === "" || state.account.address === "0x0") {
                setPoolSize({ eth: 0, tokens: 0 });
                return;
            }

            const ethBalance = await window.web3.eth.getBalance(
                state.exchanges[chosenToken]._address
            );

            const tokenBalance = await state.tokens[
                chosenToken
            ].contract.methods
                .balanceOf(state.exchanges[chosenToken]._address)
                .call();

            setPoolSize({
                eth: fromWei(ethBalance),
                tokens: fromWei(tokenBalance),
            });
        };

        updatePoolSize();
    }, [chosenToken]);

    return (
        <div className="AddLiquidity">
            <Card>
                <Card.Header>Add Liquidity</Card.Header>
                <Card.Body>
                    <Card.Title>Deposit:</Card.Title>
                    <Form.Group className="mb-2" disabled={inProgress}>
                        <Form.Label>Token:</Form.Label>
                        <Form.Select
                            className="mb-2"
                            value={chosenToken}
                            onChange={handleTokenPick}
                        >
                            <option value="" hidden>
                                Select a token
                            </option>
                            {tokenOptions}
                        </Form.Select>
                        <Form.Control
                            ref={tokenRef}
                            className="mb-2 number-form"
                            type="number"
                            placeholder="0"
                        />
                        <Form.Label>ETH:</Form.Label>
                        <InputGroup className="mb-2">
                            <Form.Control
                                ref={ethRef}
                                className="number-form"
                                type="number"
                                placeholder="0"
                            />
                            <InputGroup.Text>ETH{"  "}</InputGroup.Text>
                        </InputGroup>
                        <Form.Text className="text-muted">
                            Pool size: <samp>{poolSize.eth}</samp> ETH :{" "}
                            <samp>{poolSize.tokens}</samp> Tokens
                        </Form.Text>
                    </Form.Group>
                    <Button
                        onClick={handleSubmit}
                        disabled={inProgress || chosenToken === ""}
                    >
                        Supply
                    </Button>
                </Card.Body>
            </Card>
        </div>
    );
};

export default AddCard;
