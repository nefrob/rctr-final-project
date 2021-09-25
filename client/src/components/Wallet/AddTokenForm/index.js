import React, { useRef } from "react";
import { Button, Form, Row, Col, InputGroup } from "react-bootstrap";

const AddTokenForm = ({ handleAdd, disabled }) => {
    const addressRef = useRef("");
    const symbolRef = useRef("");
    const imageRef = useRef("");

    const handleSubmit = (e) => {
        console.log("Add token");
        e.preventDefault();

        handleAdd({
            address: addressRef.current.value,
            symbol: symbolRef.current.value,
            image: imageRef.current.value,
        });

        addressRef.current.value = "";
        symbolRef.current.value = "";
        imageRef.current.value = "";
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
                        <Form.Control
                            required
                            ref={addressRef}
                            type="text"
                            placeholder="Address"
                        />
                    </InputGroup>
                </Form.Group>
                <Form.Group as={Col}>
                    <Form.Label>Token Symbol</Form.Label>
                    <Form.Control
                        required
                        ref={symbolRef}
                        type="text"
                        placeholder="Symbol"
                    />
                </Form.Group>
                <Form.Group as={Col}>
                    <Form.Label>Token Image</Form.Label>
                    <Form.Control
                        ref={imageRef}
                        type="text"
                        placeholder="https://..."
                    />
                </Form.Group>
                <Col>
                    <Button
                        variant="primary"
                        type="submit"
                        onClick={handleSubmit}
                        disabled={disabled}
                    >
                        Add
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

export default AddTokenForm;
