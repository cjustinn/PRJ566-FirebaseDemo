import React from 'react';
import { Container, Row, Col, Card, FloatingLabel, Form, Spinner, Button } from 'react-bootstrap';
import { parseErrorMessage, RegisterWithEmail } from '../Firebase';

export class Registration extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isProcessing: false,
            errorMessage: undefined
        };

        this.handleRegistration = this.handleRegistration.bind(this);
    }

    async handleRegistration(e) {
        e.preventDefault();

        // Set isProcessing to true in the component's state to disable the submit button.
        this.setState({ ...this.state, isProcessing: true }, () => null);

        // Create references to the inputs.
        const { email, password, confirmPassword } = e.target.elements;

        // Verify that the password and confirm password values are the same.
        if (password.value === confirmPassword.value) {

            // Attempt to register the provided email and password with Firebase, using the function defined in Firebase.js
            RegisterWithEmail(email.value, password.value).then((registrationResponse) => {
                if (registrationResponse.success) {

                    // If the registration was a success, update the state to set isProcessing to false.
                    this.setState({ ...this.state, isProcessing: false }, () => null);
    
                } else {
    
                    // If registration was unsuccessful for some reason, update the state to set isProcessing to false, and to update the state's errorMessage property.
                    this.setState({ ...this.state, isProcessing: false, errorMessage: parseErrorMessage(registrationResponse.errorMessage) }, () => null);
    
                }
            }).catch((err) => {
                // An error was caught, set isProcessing to false and update the state's errorMessage property.
                this.setState({ ...this.state, isProcessing: false, errorMessage: parseErrorMessage(err.code) }, () => null);
            });
            
            

        } else {
            // If the password doesn't match the confirmPassword field, display the error message and re-enable the submit button. 
            this.setState({ ...this.state, isProcessing: false, errorMessage: `Both entered passwords must match.` }, () => null); 
        }
    }

    render() {
        return (
            <Container fluid>
                <Row md="3" sm="1">
                    <Col md="4" sm="0"></Col>

                    <Col md="4" sm="12">
                        <Card className="mt-4">
                            <Card.Header>
                                <Card.Title>Account Registration</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <Form onSubmit={this.handleRegistration}>
                                    <FloatingLabel label="Email Address" className="mb-3">
                                        <Form.Control type="email" name="email" placeholder="email@domain.com"/>
                                    </FloatingLabel>
                                    <FloatingLabel label="Password" className="mb-3">
                                        <Form.Control type="password" name="password" placeholder="Password"/>
                                    </FloatingLabel>
                                    <FloatingLabel label="Confirm Password" className="mb-3">
                                        <Form.Control type="password" name="confirmPassword" placeholder="Confirm Password"/>
                                    </FloatingLabel>

                                    <div className="d-grid gap-2">
                                        <Form.Text className="text-danger">{this.state.errorMessage}</Form.Text>
                                        <Button variant="primary" type="submit" disabled={this.state.isProcessing}>
                                            {
                                                this.state.isProcessing ?
                                                <><Spinner size="sm" animation="border"/>{' '}Processing...</>
                                                :
                                                <span>Register</span>
                                            }
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md="4" sm="0"></Col>
                </Row>
            </Container>
        );
    }

}