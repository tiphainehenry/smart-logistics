import React, { useState } from 'react';
import {Row, Col, Form, Button} from 'react-bootstrap';
import '../css/boosted.min.css';
import '../css/App.css';


import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
 
import Header from "./Header";
import Footer from "./Footer";

class Ecmr extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      issuanceDate:'',
      setStartDate:'',
      shipperETH:'0x3b8e54c2E7Bb38ffeb8Ddc9511461C6691Ff52A8',
      carrierETH:''
    };

    this.handleChange = this.handleChange.bind(this);
  };


  componentDidMount(){
    var today = new Date();
    var date =  (today.getMonth() + 1) + '/' + today.getDate() + '/' +  today.getFullYear();

    this.setState({'issuanceDate':Date.parse(date.toString())});
  }

  handleChange(e) {
  
    this.setState({startDate:e});

  }


  
  render(){
    
    return <div>
    <Header/>
     <div className="discovery-module-one-pop-out py-5 py-lg-3">

    <div className="container">

    <h1>ECMR generation.</h1>
    <hr/><br/>

    <Form>

    <Form.Group>
    <Form.Label>Date of takeover</Form.Label>
    <Form.Group controlId="formBasicEmail">
      <DatePicker className="form-control" selected={this.state.issuanceDate} onChange={this.handleChange} />    
    </Form.Group>
    </Form.Group>

    <Form.Group controlId="formGridEmail">
      <Form.Label>Carrier Eth address</Form.Label>
      <Form.Control type="address" placeholder="carrier address" value={this.state.carrierETH}/>
    </Form.Group>
    <Form.Group controlId="formGridEmail">
      <Form.Label>Shipper Eth address</Form.Label>
      <Form.Control type="address" placeholder="shipper address" value={this.state.shipperETH}/>
    </Form.Group>

    <hr/><br/>

    <Form.Group controlId="formGridEmail">
      <Form.Label>Nature</Form.Label>
      <Form.Control type="address" placeholder="nature" />
    </Form.Group>

    <Form.Group controlId="exampleForm.ControlSelect1">
    <Form.Label>Quantity</Form.Label>
    <Form.Control as="select">
      <option>1</option>
      <option>2</option>
      <option>3</option>
      <option>4</option>
      <option>5</option>
    </Form.Control>
  </Form.Group>
  <Form.Group controlId="formGridEmail">
      <Form.Label>Gross weight</Form.Label>
      <Form.Control type="address" placeholder="gross weight" />
    </Form.Group>
    <Form.Group controlId="formGridEmail">
      <Form.Label>Gross Volume</Form.Label>
      <Form.Control type="address" placeholder="gross volume" />
    </Form.Group>

    <hr/><br/>
    <Form.Group controlId="formBasicEmail">
      <Form.Group controlId="formGridAddress1">
      <Form.Label>Pickup address</Form.Label>
      <Form.Control placeholder="40 rue Georges Huguet" />
    </Form.Group>

    <Form.Row>
      <Form.Group as={Col} controlId="formGridCity">
        <Form.Label>City</Form.Label>
        <Form.Control placeholder="Clamart"/>
      </Form.Group>


      <Form.Group as={Col} controlId="formGridZip">
        <Form.Label>Zip</Form.Label>
        <Form.Control placeholder="92140"/>
      </Form.Group>
  </Form.Row>    
  </Form.Group>
  <hr/><br/>

    <Form.Group controlId="formBasicEmail">
      <Form.Group controlId="formGridAddress1">
      <Form.Label>Delivery Address</Form.Label>
    <Form.Control placeholder="40 avenue de la République" />
  </Form.Group>

  <Form.Row>
    <Form.Group as={Col} controlId="formGridCity">
      <Form.Label>City</Form.Label>
      <Form.Control placeholder="Châtillon"/>
    </Form.Group>

    <Form.Group as={Col} controlId="formGridZip">
      <Form.Label>Zip</Form.Label>
      <Form.Control placeholder="92320"/>
    </Form.Group>
    </Form.Row>    
  </Form.Group>
  

  <hr/><br/>

    <Button variant="primary" type="submit">
      Option1: Generate onchain contract
    </Button>

    <Button variant="secondary" type="submit">
      Option2: Generate IPFS contract, hash stored onchain
    </Button>

  </Form>
  </div>


  </div>

  <Footer/>
  </div>;
  }};

export default Ecmr

