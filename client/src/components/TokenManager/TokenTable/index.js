import React from "react";
import { Table } from "react-bootstrap";

const TokenTable = ({ tokens }) => {
    const tokenList = tokens.map((token, index) => {
        return (
            <tr key={index}>
                <td>{token.name}</td>
                <td>
                    <code>{token.address}</code>
                </td>
                <td>{token.symbol}</td>
                <td>
                    <img src={token.image} alt={token.symbol} />
                </td>
            </tr>
        );
    });

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Token</th>
                    <th>Address</th>
                    <th>Symbol</th>
                    <th>Image</th>
                </tr>
            </thead>
            <tbody>{tokenList}</tbody>
        </Table>
    );
};

export default TokenTable;
