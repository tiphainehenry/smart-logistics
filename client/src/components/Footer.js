import React from 'react';
//import { Navbar, Nav, NavDropdown} from 'react-bootstrap';
import '../css/boosted.min.css';


class Footer extends React.Component {

  constructor(props){
    super(props);
    this.state = {};
  };

  

  
  render(){return     <footer className="o-footer" id="footer" role="contentinfo">
  <div className="o-footer-bottom">
    <div className="container">
      <div className="row mb-0">
        <ul className="nav">
          <li className="nav-item"><span className="nav-link">© Work in progress - 2020/2021</span></li>
        </ul>
      </div>
    </div>
  </div>
</footer>
;
  
}};

export default Footer

