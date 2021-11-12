import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { CheckCircleFill, XCircleFill } from 'react-bootstrap-icons';
import { GetUserProfile } from '../Firebase';

export class Home extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            userDetails: GetUserProfile()
        };
    }

    render() {

        return (
            <Container fluid className="mt-3">
                <Row md="2" sm="1">
                    <Col md="6" sm="12" className="d-block">
                        <h1>Welcome, {this.state.userDetails.displayName}!</h1>
                        <p className="font-weight-light">
                            The purpose of this page is just to provide a quick demo, so you can see exactly how you would get access to the user's profile details (for display purposes),
                            and to verify that changes made in other parts of the demo site are fulfilled.
                        </p>
                    </Col>

                    <Col md="6" sm="12" className="d-none d-md-block">
                        <table className="table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>Property</th>
                                    <th>Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Display Name</td>
                                    <td>{this.state.userDetails.displayName}</td>
                                </tr>
                                <tr>
                                    <td>Email Address</td>
                                    <td>
                                        {this.state.userDetails.email}
                                        {' '}
                                        {
                                            this.state.userDetails.emailVerified ?
                                            <CheckCircleFill className="text-success" size={15}/>
                                            :
                                            <XCircleFill className="text-danger" size={15}/>
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td>User Id</td>
                                    <td>{this.state.userDetails.uid}</td>
                                </tr>
                                <tr>
                                    <td>Profile Picture URL</td>
                                    <td>{this.state.userDetails.profilePicture}</td>
                                </tr>
                                <tr>
                                    <td>Account Created</td>
                                    <td>{this.state.userDetails.meta.creationTime}</td>
                                </tr>
                                <tr>
                                    <td>Last Sign-In</td>
                                    <td>{this.state.userDetails.meta.lastSignInTime}</td>
                                </tr>
                            </tbody>
                        </table>
                    </Col>
                </Row>
            </Container>  
        );

    }

}