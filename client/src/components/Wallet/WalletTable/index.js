import React from "react";
import { Table } from "react-bootstrap";

const WalletTable = ({ tokens }) => {
    const tokenList = Object.keys(tokens).map((symbol, index) => {
        const token = tokens[symbol];

        return (
            <tr key={index}>
                <td>
                    {" "}
                    <img class="token-logo" src={token.image} alt={symbol} />
                </td>
                <td>{symbol}</td>
                <td>
                    <code>{token.contract._address}</code>
                </td>
                <td>
                    <samp>{token.balance}</samp>
                </td>
            </tr>
        );
    });

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Token</th>
                    <th>Symbol</th>
                    <th>Address</th>
                    <th>Balance</th>
                </tr>
            </thead>
            <tbody>{tokenList}</tbody>
        </Table>
    );
};

export default WalletTable;
