import React from "react";
import { Card } from "react-bootstrap";

const Home = () => {
    return (
        <div className="Home">
            <Card>
                <Card.Header>Sandman Swap</Card.Header>
                <Card.Body>
                    <Card.Title>Welcome!</Card.Title>
                    <Card.Text>
                        This website presents a simple React interface to
                        interact with ETH/token swapping smart contracts on the
                        Ethereum blockchain. With a connected browser wallet
                        (ex. MetaMask) a user can provide/remove liquidity, and
                        exchange between ETH and tokens using these liquidity
                        pools.
                    </Card.Text>
                    <Card.Text>
                        To start, please link your browser wallet on the{" "}
                        <b>Wallet</b> page.
                    </Card.Text>
                    <a href="https://github.com/nefrob/sandman-swap">
                        GitHub Repository
                    </a>{" "}
                    |{" "}
                    <a href="https://hackmd.io/@HaydenAdams/HJ9jLsfTz?type=view">
                        Uniswap V1 Whitepaper
                    </a>
                    <Card.Text></Card.Text>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Home;
