import React from "react";
import { Card } from "react-bootstrap";

// todo: description of site, link to git repo, resources/references
import "./styles.css";

const Home = () => {
    return (
        <div className="Home">
            <Card>
                <Card.Header>Sandman Swap</Card.Header>
                <Card.Body>
                    <Card.Title>Welcome!</Card.Title>
                    <Card.Text>Project description</Card.Text>
                    <Card.Title>Links:</Card.Title>
                    <a
                        href="https://github.com/nefrob/rctr-final-project"
                        target="_blank"
                    >
                        GitHub Repository
                    </a>
                    <br />
                    <a
                        href="https://hackmd.io/@HaydenAdams/HJ9jLsfTz?type=view"
                        target="_blank"
                    >
                        Uniswap V1 Whitepaper
                    </a>
                    <Card.Text></Card.Text>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Home;
