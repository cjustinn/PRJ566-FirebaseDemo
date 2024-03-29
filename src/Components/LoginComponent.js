import React from 'react';
import { Col, Row, Container, Card, Form, FloatingLabel, Spinner, Button } from 'react-bootstrap';
import { LoginWithEmail, parseErrorMessage } from '../Firebase';

export class Login extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isProcessing: false,
            errorMessage: undefined
        };

        this.handleLogin = this.handleLogin.bind(this);
    }

    async handleLogin(e) {
        e.preventDefault();
        
        // Save constant references to the email and password inputs.
        const { email, password } = e.target.elements;
        
        // Attempt to login with the values entered in the inputs, and store the result in loginResponse.
        const loginResponse = await LoginWithEmail(email.value, password.value);
        if (!loginResponse.success) {

            // If login fails, set the errorMessage on the page to let the user know why.
            this.setState({...this.state, errorMessage: parseErrorMessage(loginResponse.errorMessage) }, () => null);

        }
    }

    render() {
        return (
            <Container fluid>

                <Row md="3" sm="1">
                    <Col md="4" sm="0"><span></span></Col>

                    <Col md="4" sm="12">
                        <Card className="mt-4">
                            <Card.Header>
                                <Card.Title>Account Login</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <Form onSubmit={this.handleLogin}>
                                    <FloatingLabel label="Email Address" className="mb-3">
                                        <Form.Control type="email" placeholder="email@domain.com" name="email"/>
                                    </FloatingLabel>
                                    <FloatingLabel label="Password" className="mb-3">
                                        <Form.Control type="password" placeholder="Password" name="password"/>
                                    </FloatingLabel>

                                    <div className="d-grid gap-2">
                                        <Form.Text className="text-danger">
                                            {this.state.errorMessage}
                                        </Form.Text>
                                        <Button variant="primary" type="submit" disabled={this.state.isProcessing}>
                                            {
                                                this.state.isProcessing ?
                                                <> <Spinner animation="border"/>{' '}Processing... </>
                                                :
                                                <span>Login</span>
                                            }
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md="4" sm="0"><span></span></Col>
                </Row>

            </Container>
        );
    }

}