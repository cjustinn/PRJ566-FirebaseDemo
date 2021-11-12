import React from 'react';
import { Container, Col, Row, Card, Ratio, ListGroup, Image } from 'react-bootstrap';
import { Envelope, Flag } from 'react-bootstrap-icons';
import { GetUserProfile } from '../Firebase';

export class Profile extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            userDetails: GetUserProfile()
        }
    }

    render() {
        
        return (
            <Container fluid>
                <Row md="2" sm="1">
                    <Col md="2" sm="12">
                        <Card className="mt-3">
                            <Card.Header>
                                <Card.Title>
                                    <Ratio aspectRatio="1x1">
                                        <Image src={this.state.userDetails.profilePicture} thumbnail/>
                                    </Ratio>
                                    <h3 className="mt-1">Username (Mongo)</h3>
                                    <h5 className="mt-1 text-muted">@{this.state.userDetails.displayName}</h5>
                                </Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <ListGroup variant="flush">
                                    <ListGroup.Item><Envelope/>{' '}{this.state.userDetails.email}</ListGroup.Item>
                                    <ListGroup.Item><Flag/>{' '}Location (Mongo)</ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md="10" sm="12" className="mt-3">
                        <h1 className="text-muted">Something goes here.. eventually.</h1>
                    </Col>
                </Row>
            </Container>
        );
    }
}