import React from "react";
import { Button, Card, Form } from "react-bootstrap";

import "./styles.css";

const Swap = () => {
    return (
        <div className="Swap">
            <Card>
                <Card.Header>Swap</Card.Header>
                <Card.Body>
                    <Card.Title>Exchange ETH/Tokens:</Card.Title>
                    <Form>
                        <Form.Group className="mb-2">
                            <Form.Label>From:</Form.Label>
                            <Form.Select>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Control
                                className="number-form"
                                type="number"
                                placeholder="0.00"
                                rows={3}
                            />
                            <Form.Text className="text-muted">
                                ~1 ETH = X USD
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>To:</Form.Label>
                            <Form.Select>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Control
                                className="number-form"
                                type="number"
                                placeholder="0.00"
                            />
                            <Form.Text className="text-muted">
                                ~1 Token = X USD
                            </Form.Text>
                        </Form.Group>
                        <Form.Text className="text-muted">
                            1 Token = X ETH
                        </Form.Text>
                    </Form>
                    <Button
                        variant="primary"
                        type="submit"
                        onClick={() => {
                            console.log("Swap");
                        }}
                        disabled={false}
                    >
                        Swap
                    </Button>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Swap;
