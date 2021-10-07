import React, { useContext } from "react";
import { Alert, Row, Col } from "react-bootstrap";

import { AppContext } from "../App";

import AddCard from "./AddCard";
import RemoveCard from "./RemoveCard";

const Liquidity = () => {
    const [state, dispatch] = useContext(AppContext);

    return (
        <div className="Liquidity">
            {state.account.address === "0x0" ? (
                <Alert variant="warning">
                    You must connect a wallet before using this feature.
                </Alert>
            ) : (
                <Row>
                    <Col>
                        <AddCard />
                    </Col>
                    <Col>
                        <RemoveCard />
                    </Col>
                </Row>
            )}
        </div>
    );
};

export default Liquidity;
