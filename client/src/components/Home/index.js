import React from "react";
import { Card } from "react-bootstrap";

// todo: description of site, link to git repo, resources/references

const Home = () => {
    return (
        <div className="Home">
            <Card>
                <Card.Header>Sandman Swap</Card.Header>
                <Card.Body>
                    <Card.Title>Welcome!</Card.Title>
                    <Card.Text>Pending project description...</Card.Text>
                    <Card.Text>
                        Please link your wallet on the "Wallet" page to start
                        swapping!
                    </Card.Text>
                    <Card.Title>Links:</Card.Title>
                    <a href="https://github.com/nefrob/rctr-final-project">
                        GitHub Repository
                    </a>
                    <br />
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
