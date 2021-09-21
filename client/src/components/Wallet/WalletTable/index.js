import React from "react";
import { Table } from "react-bootstrap";

const WalletTable = ({ tokens }) => {
    const tokenList = tokens.map((token, index) => {
        return (
            <tr key={index}>
                <td>
                    {" "}
                    <img src={tokens.image} alt={tokens.symbol} /> {tokens.name}
                </td>
                <td>{tokens.symbol}</td>
                <td>
                    <samp>{tokens.balance}</samp>
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
                    <th>Balance</th>
                </tr>
            </thead>
            <tbody>{tokenList}</tbody>
        </Table>
    );
};

export default WalletTable;
