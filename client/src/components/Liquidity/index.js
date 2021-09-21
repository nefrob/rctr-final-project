import React from "react";
import { Card, Row, Col, Form, InputGroup, Button } from "react-bootstrap";

import "./styles.css";

const Liquidity = () => {
    return (
        <div className="Liquidity">
            <Row>
                <Col>
                    <Card>
                        <Card.Header>Add Liquidity</Card.Header>
                        <Card.Body>
                            <Card.Title>Deposit:</Card.Title>
                            <Form.Group className="mb-2">
                                <Form.Label>Token:</Form.Label>
                                <Form.Select className="mb-2">
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </Form.Select>
                                <Form.Control
                                    className="mb-2 number-form"
                                    type="number"
                                    placeholder="0.00"
                                />
                                <Form.Label>ETH:</Form.Label>
                                <InputGroup className="mb-2">
                                    <Form.Control
                                        className="number-form"
                                        type="number"
                                        placeholder="0.00"
                                    />
                                    <InputGroup.Text>ETH{"  "}</InputGroup.Text>
                                </InputGroup>
                                <Form.Text className="text-muted">
                                    Exchange rate: X ETH : Y Tokens = Z DREAM
                                    <br />
                                    Pool size: A ETH : B Tokens
                                </Form.Text>
                            </Form.Group>
                            <Button>Supply</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <Card.Header>Remove Liquidity</Card.Header>
                        <Card.Body>
                            <Card.Title>Burn LP-tokens:</Card.Title>
                            <Form.Group as={Col} className="mb-2">
                                <Form.Label>LP-tokens:</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        className="number-form"
                                        type="number"
                                        placeholder="0.00"
                                    />
                                    <InputGroup.Text id="basic-addon1">
                                        DREAM
                                    </InputGroup.Text>
                                </InputGroup>
                                <Form.Text className="text-muted">
                                    Exchange rate: 1 DREAM = X ETH : Y Tokens
                                    <br />
                                    Pool share: Z %
                                </Form.Text>
                            </Form.Group>
                            <Button>Remove</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Liquidity;
