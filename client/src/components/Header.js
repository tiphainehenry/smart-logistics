import React from 'react';
import { Navbar, Nav, NavDropdown} from 'react-bootstrap';
import '../css/boosted.min.css';


class Header extends React.Component {

  constructor(props){
    super(props);
    this.state = {};
  };

   
  render(){return <div>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" sticky="top" className="navbar navbar-expand-md navbar-dark bg-dark fixed-top"> 
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/">Homepage</Nav.Link>
            <Nav.Link href="/request">Search and Hire</Nav.Link>
            <Nav.Link href="/mycontracts">Manage Contracts</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
;
  
}};

export default Header

