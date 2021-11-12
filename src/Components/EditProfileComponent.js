import React from 'react';
import { Container, Row, Col, Card, FloatingLabel, Form, Button, Spinner } from 'react-bootstrap';
import { GetUserProfile, parseErrorMessage, UpdateUserProfile, UploadProfilePicture } from '../Firebase';

export class EditProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isProcessing: false,
            errorMessage: undefined,
            successMessage: undefined,
            originalUserDetails: GetUserProfile()
        };

        this.handleUpdate = this.handleUpdate.bind(this);
    }

    async handleUpdate(e) {
        e.preventDefault();

        this.setState({ ...this.state, isProcessing: true }, () => null);

        const { newDisplayName, newProfileImage } = e.target.elements;
        if (newDisplayName.value !== this.state.originalUserDetails.displayName || newProfileImage.files[0] !== undefined) {

            let updateObj = {
                displayName: newDisplayName.value
            };

            if (newProfileImage.files[0] !== undefined) {

                await UploadProfilePicture(new File([newProfileImage.files[0]], `${GetUserProfile().uid}-${Math.round(Date.now() / 1000)}`, { type: newProfileImage.files[0].type})).then((result) => {
                    if (result.success === true && result.url !== null) {
                        updateObj.photoURL = result.url;
                    }
                    else
                    {
                        this.setState({ ...this.state, errorMessage: parseErrorMessage(result.errorMessage) }, () => null);
                    }
                }).catch((err) => {
                    this.setState({ ...this.state, errorMessage: parseErrorMessage(err.code)}, () => null);
                });

            }
            
            const uPResp = await UpdateUserProfile(updateObj);
            if (uPResp.success) {
                this.setState({ ...this.state, isProcessing: false, successMessage: uPResp.errorMessage, errorMessage: null }, () => null);
            }
            else {
                this.setState({ ...this.state, isProcessing: false, successMessage: null, errorMessage: parseErrorMessage(uPResp.errorMessage)}, () => null);
            }
        } else {
            this.setState({ ...this.state, isProcessing: false }, () => null);
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
                                <Card.Title>Editing Your Profile</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <Form onSubmit={this.handleUpdate}>
                                    <FloatingLabel label="Display Name" className="mb-3">
                                        <Form.Control type="text" name="newDisplayName" defaultValue={this.state.originalUserDetails.displayName}/>
                                    </FloatingLabel>
                                    <Form.Group className="mb-4">
                                        <Form.Label className="text-muted">Profile Picture</Form.Label>
                                        <Form.Control type="file" name="newProfileImage" accept="image/*"/>
                                    </Form.Group>
                                    <FloatingLabel label="Account Created">
                                        <Form.Control type="text" defaultValue={this.state.originalUserDetails.meta.creationTime} readOnly/>
                                    </FloatingLabel>

                                    <div className="d-grid gap-2">
                                        <Form.Text className="text-danger">{this.state.errorMessage}</Form.Text>
                                        <Form.Text className="text-success">{this.state.successMessage}</Form.Text>
                                        <Button variant="primary" type="submit" disabled={this.state.isProcessing}>
                                            {
                                                this.state.isProcessing ?
                                                <><Spinner size="sm" animation="border"/>{' '}<span>Processing...</span></>
                                                :
                                                <span>Save Changes</span>
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