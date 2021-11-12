import logo from './logo.svg';
import './App.css';
import { AuthContextProvider, GetAuthenticatedState, useAuthState } from './Firebase';
import { Route, Switch, Redirect, Link } from 'react-router-dom';
import { Home } from './Components/HomeComponent.js';
import { Login } from './Components/LoginComponent.js';
import { NotFound } from './Components/PageNotFoundComponent';
import { Registration } from './Components/RegistrationComponent';
import { Container, Nav, Navbar, Offcanvas } from 'react-bootstrap';
import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse';
import { NavigationList } from './Components/NavigationComponent';
import { EditProfile } from './Components/EditProfileComponent';

const AuthenticatedRoute = ({ component: C, ...props}) => {
  const { isAuthenticated } = useAuthState();
  return (
    <Route {...props} component={routeProps => isAuthenticated ? <C {...routeProps}/> : <Redirect to="/login"/>}/>
  );
}

const UnauthenticatedRoute = ({ component: C, ...props}) => {
  const { isAuthenticated } = useAuthState();
  return (
    <Route {...props} component={routeProps => !isAuthenticated ? <C {...routeProps}/> : <Redirect to="/"/>}/>
  );
}

function App() {
  return (
    <AuthContextProvider>
      <header>
        <Navbar bg="dark" variant="dark" expand={false}>
          <Container fluid>
            <Navbar.Brand>
              <Link to="/" className="NavigationRouteLink" style={{color: 'white'}}>
                <img src={logo} width="30" height="30" className="d-inline-block align-top"/>{' '}
                Firebase Demo
              </Link>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="sidebar"/>
            <Navbar.Offcanvas id="sidebar" aria-labelledby="sidebarLabel" placement="end">
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id="sidebarLabel">Navigation Menu</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <NavigationList/>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      </header>
      <body>
        <Switch>
          <AuthenticatedRoute exact path="/" component={Home}/>
          <AuthenticatedRoute exact path="/edit-profile" component={EditProfile}/>
          <UnauthenticatedRoute exact path="/login" component={Login}/>
          <UnauthenticatedRoute exact path="/register" component={Registration}/>
          <Route path="*" component={NotFound}/>
        </Switch>
      </body>
      <footer>
        <Navbar bg="light" variant="light">
          <Container fluid>
            <Navbar.Text>
              <span className="text-muted"><small>&copy;2021 FIREBASE-DEMO-JMERCER INC., ALL RIGHTS RESERVED</small></span>
            </Navbar.Text>
          </Container>
        </Navbar>
      </footer>
    </AuthContextProvider>
  );
}

export default App;
