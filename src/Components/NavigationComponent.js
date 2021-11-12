import React from 'react';
import { Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { LogoutUser, useAuthState } from '../Firebase';

export const NavigationList = () => {
    const { isAuthenticated } = useAuthState();
    if (isAuthenticated) {
        return (
            <>
                <Nav.Link><Link to="/" className="NavigationRouteLink">My Feed</Link></Nav.Link>
                <Nav.Link><Link to="/profile" className="NavigationRouteLink">My Profile</Link></Nav.Link>
                <Nav.Link><Link to="/edit-profile" className="NavigationRouteLink">Edit Your Profile</Link></Nav.Link>
                <Nav.Link><Link to="/browse" className="NavigationRouteLink">Browse</Link></Nav.Link>
                <Nav.Link onClick={LogoutUser}>Logout</Nav.Link>
            </>
        );
    }
    else {
        return (
            <>
                <Nav.Link><Link to="/login" className="NavigationRouteLink">Login</Link></Nav.Link>
                <Nav.Link><Link to="/register" className="NavigationRouteLink">Register</Link></Nav.Link>
            </>
        );
    }
}