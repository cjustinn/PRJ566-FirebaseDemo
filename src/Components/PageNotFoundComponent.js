import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

export class NotFound extends React.Component {

    render() {
        return (
            <Container fluid className="mt-3 ">
                <Row md="3" sm="1">
                    <Col md="3" sm="0"></Col>
                    <Col md="6" sm="12">
                        <h1 className="text-muted text-center">Uh-oh!</h1>
                        <h2 className="text-center">It looks like we've lost the page you're looking for!</h2>
                    </Col>
                    <Col md="3" sm="0"></Col>
                </Row>
            </Container>
        )
    }

}