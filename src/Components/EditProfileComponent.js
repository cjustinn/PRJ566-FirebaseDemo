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
        // Stop the default form submission from taking place.
        e.preventDefault();

        // Set the component's "isProcessing" state value to true-- this disables the submit button, changes it's text, and enables a spinner.
        this.setState({ ...this.state, isProcessing: true }, () => null);

        // Get the references to the display name and image inputs.
        const { newDisplayName, newProfileImage } = e.target.elements;

        // If the display name stored in the input is different from the user's current display name, or there was a file uploaded to the file input, then proceed.
        if (newDisplayName.value !== this.state.originalUserDetails.displayName || newProfileImage.files[0] !== undefined) {

            // Create an object to store the new user profile data.
            let updateObj = {
                displayName: newDisplayName.value // Sets the displayName property to the newly entered value from the input.
            };

            // If there was an image selected, complete the following if statement.
            if (newProfileImage.files[0] !== undefined) {

                /*
                    Invoke "UploadProfilePicture(file: File)", providing it with a new File created from the selected one, with the name changed to `${userid}-${currenttimestamp}`
                    to ensure uniqueness, and set it's type to match the type of the selected file.

                    Wait for the result of this upload-- if successful, add the "photoURL" field to the updateObj and set it's value to the newly uploaded file's download url.
                    If not successful, set the state's errorMessage value to whatever error was returned to let the user know that their profile picture couldn't be updated.
                */
                await UploadProfilePicture(new File([newProfileImage.files[0]], `${GetUserProfile().uid}-${Math.round(Date.now() / 1000)}`, { type: newProfileImage.files[0].type})).then((result) => {
                    if (result.success === true && result.url !== null) {
                        updateObj.photoURL = result.url;
                    }
                    else
                    {
                        // If the download url couldn't be found, set the error message so that the user knows that their profile picture won't be updated.
                        this.setState({ ...this.state, errorMessage: parseErrorMessage(result.errorMessage) }, () => null);
                    }
                }).catch((err) => {
                    this.setState({ ...this.state, errorMessage: parseErrorMessage(err.code)}, () => null);
                });

            }
            
            // Update the user's profile and wait for the result, storing it in uPResp.
            const uPResp = await UpdateUserProfile(updateObj);
            if (uPResp.success) {
                // If successful, update the state of the component to show the success message.
                this.setState({ ...this.state, isProcessing: false, successMessage: uPResp.errorMessage, errorMessage: null }, () => null);
            }
            else {
                // If unsuccessful, update the state's errorMessage and set isProcessing to false to re-enable the submit button.
                this.setState({ ...this.state, isProcessing: false, successMessage: null, errorMessage: parseErrorMessage(uPResp.errorMessage)}, () => null);
            }
        } else {
            // There are no changes, so just immediately change isProcessing back to false to re-enable the submit button.
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