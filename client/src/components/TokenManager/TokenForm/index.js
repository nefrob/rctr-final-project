import React from "react";
import { Button, Form, Row, Col, InputGroup } from "react-bootstrap";

const TokenForm = ({ handleAdd, disabled }) => {
    const handleClick = () => {
        console.log("Add token");

        // todo: validation
        // address = 40 hex characters
        // symbol = text
        // image = url
        // Alert with state error message?

        handleAdd();
    };

    return (
        <Form>
            <Row className="align-items-end">
                <Form.Group as={Col}>
                    <Form.Label>Token address</Form.Label>
                    <InputGroup>
                        <InputGroup.Text id="basic-addon1">
                            <code>0x</code>
                        </InputGroup.Text>
                        <Form.Control type="text" placeholder="Address" />
                    </InputGroup>
                </Form.Group>
                <Form.Group as={Col}>
                    <Form.Label>Token Symbol</Form.Label>
                    <Form.Control type="text" placeholder="Symbol" />
                </Form.Group>
                <Form.Group as={Col}>
                    <Form.Label>Token Image</Form.Label>
                    <Form.Control type="text" placeholder="https://..." />
                </Form.Group>
                <Col>
                    <Button
                        variant="primary"
                        type="submit"
                        onClick={handleClick}
                        disabled={disabled}
                    >
                        Add
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

export default TokenForm;
