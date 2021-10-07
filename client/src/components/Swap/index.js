import React, { useContext, useState, useEffect } from "react";
import { Alert, Button, Card, Form } from "react-bootstrap";

import { AppContext } from "../App";

import { toWei, fromWei } from "../../utils/utils";

const Swap = () => {
    const [state, dispatch] = useContext(AppContext);

    const [ethPriceUSD, setEthPriceUSD] = useState(0);
    const [chosenFrom, setChosenFrom] = useState("choose");
    const [amountFrom, setAmountFrom] = useState(0);
    const [chosenTo, setChosenTo] = useState("choose");
    const [amountTo, setAmountTo] = useState(0);
    const [pricesUSD, setPricesUSD] = useState({
        from: 0,
        to: 0,
    });
    const [exchangeRate, setExchangeRate] = useState(0);
    const [inProgress, setInProgress] = useState(false);

    const tokenOptions = Object.keys(state.tokens).map((symbol, index) => {
        return (
            <option key={index} value={symbol}>
                {symbol}
            </option>
        );
    });

    useEffect(() => {
        const getEthPriceUSD = async () => {
            const url = `https://cex.io/api/last_price/ETH/USD`;
            const res = await fetch(url);
            const json = await res.json();
            setEthPriceUSD(json.lprice);
        };

        getEthPriceUSD();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setInProgress(true);

        try {
            if (chosenFrom === "ETH") {
                const amountToExact = await state.exchanges[chosenTo].methods
                    .getEthToTokenExchangeRate(toWei(amountFrom))
                    .call();

                await state.exchanges[chosenTo].methods
                    .ethToTokenExchange(amountToExact)
                    .send({
                        value: toWei(amountFrom),
                        from: state.account.address,
                    });
            } else if (chosenTo === "ETH") {
                const amountToExact = await state.exchanges[chosenFrom].methods
                    .getTokenToEthExchangeRate(toWei(amountFrom))
                    .call();

                await state.tokens[chosenFrom].contract.methods
                    .approve(
                        state.exchanges[chosenFrom]._address,
                        toWei(amountFrom)
                    )
                    .send({ from: state.account.address });

                await state.exchanges[chosenFrom].methods
                    .tokenToEthExchange(toWei(amountFrom), amountToExact)
                    .send({
                        from: state.account.address,
                    });
            } else {
                const amountToExact = await state.exchanges[chosenFrom].methods
                    .getTokenToEthExchangeRate(toWei(amountFrom))
                    .call();

                await state.tokens[chosenFrom].contract.methods
                    .approve(
                        state.exchanges[chosenFrom]._address,
                        toWei(amountFrom)
                    )
                    .send({ from: state.account.address });

                await state.exchanges[chosenFrom].methods
                    .tokenToTokenExchange(
                        toWei(amountFrom),
                        amountToExact,
                        state.tokens[chosenTo].contract._address
                    )
                    .send({
                        from: state.account.address,
                    });
            }

            await updateBalances(); // fixme: need to do this?
            setExchangeRate(await getExchangeRate(chosenFrom, chosenTo));
        } catch (error) {
            console.log(error);
        }

        setAmountFrom(0);
        setAmountTo(0);
        setInProgress(false);
    };

    const updateBalances = async () => {
        const ethBalance = await window.web3.eth.getBalance(
            state.account.address
        );
        dispatch({
            type: "UPDATE_ETH_BALANCE",
            payload: fromWei(ethBalance),
        });

        if (chosenFrom !== "ETH") {
            const tokenBalance = await state.tokens[chosenFrom].contract.methods
                .balanceOf(state.account.address)
                .call();
            dispatch({
                type: "UPDATE_TOKEN_BALANCE",
                payload: {
                    symbol: chosenFrom,
                    balance: fromWei(tokenBalance),
                },
            });
        }

        if (chosenTo !== "ETH") {
            const tokenBalance = await state.tokens[chosenTo].contract.methods
                .balanceOf(state.account.address)
                .call();
            dispatch({
                type: "UPDATE_TOKEN_BALANCE",
                payload: {
                    symbol: chosenTo,
                    balance: fromWei(tokenBalance),
                },
            });
        }
    };

    const handleSelectionChange = async (e) => {
        const { name, value } = e.target;

        setInProgress(true);

        if (name === "chosenFrom") {
            await selectionChangeHelper(
                value,
                chosenFrom,
                setChosenFrom,
                "from",
                chosenTo,
                setChosenTo,
                "to"
            );
        } else {
            await selectionChangeHelper(
                value,
                chosenTo,
                setChosenTo,
                "to",
                chosenFrom,
                setChosenFrom,
                "from"
            );
        }

        setInProgress(false);
    };

    const selectionChangeHelper = async (
        newValue,
        chooseA,
        setChooseA,
        keyA,
        chooseB,
        setChooseB,
        keyB
    ) => {
        if (newValue === chooseA) {
            return;
        }

        setChooseA(newValue);
        setAmountFrom(0);
        setAmountTo(0);

        let newChooseB = chooseB;
        if (newValue === chooseB) {
            setChooseB("choose");
            newChooseB = "choose";
            setExchangeRate(0);
            setPricesUSD({ ...pricesUSD, [keyB]: 0 });
        }

        if (newValue === "ETH") {
            setPricesUSD({
                ...pricesUSD,
                [keyA]: ethPriceUSD,
            });
        } else if (newValue !== "choose") {
            const poolSize = fromWei(
                await state.exchanges[newValue].methods.totalSupply().call()
            );

            if (poolSize === "0") {
                setChooseA("choose");
                setExchangeRate(0);
                setPricesUSD({ ...pricesUSD, [keyA]: 0 });
                return;
            }

            try {
                if (keyA === "to") {
                    const ethToToken = fromWei(
                        await state.exchanges[newValue].methods
                            .getEthToTokenExchangeRate(toWei(1))
                            .call()
                    );

                    setPricesUSD({
                        ...pricesUSD,
                        [keyA]: ethPriceUSD / ethToToken,
                    });
                } else {
                    const ethToToken = fromWei(
                        await state.exchanges[newValue].methods
                            .getTokenToEthExchangeRate(toWei(1))
                            .call()
                    );

                    setPricesUSD({
                        ...pricesUSD,
                        [keyA]: ethPriceUSD * ethToToken,
                    });
                }
            } catch (error) {
                console.log(error);
            }
        }

        if (newChooseB !== "choose") {
            if (keyA === "from") {
                setExchangeRate(await getExchangeRate(newValue, newChooseB));
            } else {
                setExchangeRate(await getExchangeRate(newChooseB, newValue));
            }
        }
    };

    const getExchangeRate = async (from, to) => {
        let rate = 0;

        try {
            if (from === "ETH" && to !== "choose") {
                rate = await state.exchanges[to].methods
                    .getEthToTokenExchangeRate(toWei(1))
                    .call();
            } else if (from !== "choose" && to === "ETH") {
                rate = await state.exchanges[from].methods
                    .getTokenToEthExchangeRate(toWei(1))
                    .call();
            } else if (from !== "choose" && to !== "choose") {
                const tokenToEth = await state.exchanges[from].methods
                    .getTokenToEthExchangeRate(toWei(1))
                    .call();
                rate = await state.exchanges[to].methods
                    .getEthToTokenExchangeRate(tokenToEth)
                    .call();
            }
        } catch (error) {
            console.log(error);
        }

        return fromWei(rate);
    };

    const handleInputChange = (e) => {
        let { name, value } = e.target;

        if (value === "") {
            setAmountFrom("");
            setAmountTo("");
            return;
        }

        // Fixme: incorrect conversion still slightly
        const valFixed = parseFloat(value).toFixed(18);
        const rateFixed = parseFloat(exchangeRate).toFixed(18);

        if (name === "amountFrom") {
            setAmountFrom(value);

            if (exchangeRate !== 0) {
                setAmountTo(valFixed * rateFixed);
            }
        } else if (name === "amountTo") {
            setAmountTo(value);

            if (exchangeRate !== 0) {
                setAmountFrom(valFixed / rateFixed);
            }
        }
    };

    if (state.account.address === "0x0") {
        return (
            <Alert variant="warning">
                You must connect a wallet before using this feature.
            </Alert>
        );
    }

    return (
        <div className="Swap">
            <Card>
                <Card.Header>Swap</Card.Header>
                <Card.Body>
                    <Card.Title>
                        Exchange ETH/Tokens or Tokens/Tokens:
                    </Card.Title>
                    <Form>
                        <Form.Label>From:</Form.Label>
                        <Form.Select
                            className="mb-2"
                            name="chosenFrom"
                            value={chosenFrom}
                            onChange={handleSelectionChange}
                            disabled={inProgress}
                        >
                            <option value="choose" hidden>
                                Select swap from
                            </option>
                            <option value="ETH">ETH</option>
                            {tokenOptions}
                        </Form.Select>
                        <Form.Group className="mb-2">
                            <Form.Control
                                className="number-form"
                                name="amountFrom"
                                type="number"
                                placeholder="0"
                                value={amountFrom}
                                disabled={inProgress || chosenFrom === "choose"}
                                onChange={handleInputChange}
                            />
                            <Form.Text className="text-muted">
                                {/* ~$<samp>{pricesUSD.from * amountFrom}</samp> */}
                            </Form.Text>
                        </Form.Group>
                        <Form.Label>To:</Form.Label>
                        <Form.Select
                            className="mb-2"
                            name="chosenTo"
                            value={chosenTo}
                            onChange={handleSelectionChange}
                            disabled={inProgress}
                        >
                            <option value="choose" hidden>
                                Select swap to
                            </option>
                            <option value="ETH">ETH</option>
                            {tokenOptions}
                        </Form.Select>
                        <Form.Group className="mb-2">
                            <Form.Control
                                className="number-form"
                                name="amountTo"
                                type="number"
                                placeholder="0"
                                value={amountTo}
                                disabled={inProgress || chosenTo === "choose"}
                                onChange={handleInputChange}
                            />
                            <Form.Text className="text-muted">
                                ~$<samp>{pricesUSD.to * amountTo}</samp>
                            </Form.Text>
                        </Form.Group>
                    </Form>
                    <Button
                        className="mb-2"
                        variant="primary"
                        type="submit"
                        onClick={handleSubmit}
                        disabled={
                            inProgress ||
                            chosenFrom === "choose" ||
                            chosenTo === "choose" ||
                            amountFrom === 0 ||
                            exchangeRate === 0
                        }
                    >
                        Swap
                    </Button>
                    {exchangeRate === 0 ? (
                        <Alert variant="warning">
                            One or more of the liquidity pools is empty or
                            unselected.
                        </Alert>
                    ) : null}
                </Card.Body>
            </Card>
        </div>
    );
};

export default Swap;
