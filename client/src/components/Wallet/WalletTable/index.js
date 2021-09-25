import React from "react";
import { Table } from "react-bootstrap";

const WalletTable = ({ tokens }) => {
    const tokenList = tokens.map((token, index) => {
        return (
            <tr key={index}>
                <td>
                    {" "}
                    <img src={token.image} alt={token.symbol} />
                </td>
                <td>{token.symbol}</td>
                <td>
                    <code>{token.address}</code>
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
