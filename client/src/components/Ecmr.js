import React, { useState } from 'react';
import {Tab, Tabs, Row, Col, Form, Button} from 'react-bootstrap';
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
      consigneeETH:'0x3b8e54c2E7Bb38ffeb8Ddc9511461C6691Ff52A8',
      consignorETH:'0x3b8e54c2E7Bb38ffeb8Ddc9511461C6691Ff52A8',
      carrierETH:'0x3b8e54c2E7Bb38ffeb8Ddc9511461C6691Ff52A8',

      consigneeLoc: '',
      consignorLoc: '',
      carrierLoc: '',


      takeover:'',
      shipFrom:'',
      shipTo:'',
      quantity:'',
      nature:'',
      weight:'',
      volume:'', 
      comments:''

    };

    this.handleConsigneeETH = this.handleConsigneeETH.bind(this);
    this.handleConsignorETH = this.handleConsignorETH.bind(this);
    this.handleCarrierETH = this.handleCarrierETH.bind(this);

    this.handleConsigneeLoc = this.handleConsigneeLoc.bind(this);
    this.handleConsignorLoc = this.handleConsignorLoc.bind(this);
    this.handleCarrierLoc = this.handleCarrierLoc.bind(this);

    this.handleTakeover = this.handleTakeover.bind(this);
    this.handleShipFromLoc = this.handleShipFromLoc.bind(this);
    this.handleShipToLoc = this.handleShipToLoc.bind(this);

    this.handleNature = this.handleNature.bind(this);
    this.handleQuantity = this.handleQuantity.bind(this);
    this.handleWeight = this.handleWeight.bind(this);
    this.handleVolume = this.handleVolume.bind(this);
    this.handleComments = this.handleComments.bind(this);

  };


  componentDidMount(){
    var today = new Date();
    var date =  (today.getMonth() + 1) + '/' + today.getDate() + '/' +  today.getFullYear();

    this.setState({'startDate':Date.parse(date.toString())});

  }
  handleTakeover(e) {
    this.setState({startDate:e});
  }

  handleShipFromLoc(e) {
    e.preventDefault();
    this.setState({shipFrom:e.target.value});
  }
  handleShipToLoc(e) {
    e.preventDefault();
    this.setState({shipTo:e.target.value});
  }
  handleNature(e) {
    e.preventDefault();
    this.setState({nature:e.target.value});
  }
  handleQuantity(e) {
    e.preventDefault();
    this.setState({quantity:e.target.value});
  }
  handleWeight(e) {
    e.preventDefault();
    this.setState({weight:e.target.value});
  }
  handleVolume(e) {
    e.preventDefault();
    this.setState({volume:e.target.value});
  }
  handleComments(e) {
    e.preventDefault();
    this.setState({comments:e.target.value});
  }


  handleConsigneeETH(e) {
    e.preventDefault();
    this.setState({consigneeETH:e.target.value});
  }
  handleConsignorETH(e) {
    e.preventDefault();
    this.setState({consignorETH:e.target.value});
  }
  handleCarrierETH(e) {
    e.preventDefault();
    this.setState({carrierETH:e.target.value});
  }

  handleConsigneeLoc(e) {
    e.preventDefault();
    this.setState({consigneeLoc:e.target.value});
  }
  handleConsignorLoc(e) {
    e.preventDefault();
    this.setState({consignorLoc:e.target.value});
  }
  handleCarrierLoc(e) {
    e.preventDefault();
    this.setState({carrierLoc:e.target.value});
  }
  
  
  render(){return <div>
    <Header/>
    <div className="discovery-module-one-pop-out py-5 py-lg-3">

<div className="container">

<h1>ECMR generation.</h1>
    <hr/><br/>

<Tabs defaultActiveKey="tenants" id="uncontrolled-tab-example">
  <Tab eventKey="tenants" title="Tenants Information">
    <Form>
            <h3>Consignee</h3>
            <Form.Group controlId="formGridEmail">
              <Form.Label>Eth account</Form.Label>
              <Form.Control type="address" placeholder="consignee address" onChange={this.handleConsigneeETH} value={this.state.consigneeETH}/>
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Group controlId="formGridAddress1">
              <Form.Label>Location</Form.Label>
              <Row>
                <Col sm={10}><Form.Control onChange={this.handleConsigneeLoc} value={this.state.consigneeLoc}  /></Col>
              </Row>
            </Form.Group>
          </Form.Group>

            <h3>Consignor</h3>
            <Form.Group controlId="formGridEmail">
              <Form.Label>Eth account</Form.Label>
              <Form.Control type="address" placeholder="consignor address" onChange={this.handleConsignorETH} value={this.state.consignorETH}/>
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Group controlId="formGridAddress1">
              <Form.Label>Location</Form.Label>
              <Row>
                <Col sm={10}><Form.Control onChange={this.handleConsignorLoc} value={this.state.consignorLoc}  /></Col>
              </Row>
            </Form.Group>
          </Form.Group>

            <h3>Carrier</h3>
            <Form.Group controlId="formGridEmail">
              <Form.Label>Eth account</Form.Label>
              <Form.Control type="address" placeholder="carrier address" onChange={this.handleCarrierETH} value={this.state.carrierETH}/>
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Group controlId="formGridAddress1">
              <Form.Label>Location</Form.Label>
              <Row>
                <Col sm={10}><Form.Control onChange={this.handleCarrierLoc} value={this.state.carrierLoc}  /></Col>
              </Row>
            </Form.Group>
          </Form.Group>
    </Form>
  </Tab>

  <Tab eventKey="command" title="Command Information">
  <Form>

  <Form.Group>
    <Form.Label>Date of takeover</Form.Label>
      <Form.Group controlId="formBasicEmail">
        <DatePicker className="form-control" 
        selected={this.state.startDate} 
        value={this.state.startDate} 
        onChange={this.handleTakeover}  />    
      </Form.Group>
  </Form.Group>

  <hr/><br/>
    <Form.Group controlId="formBasicEmail">
      <Form.Group controlId="formGridAddress1">
      <Form.Label>Ship from</Form.Label>
      <Form.Control placeholder="40 rue Georges Huguet 92140 Clamart" value={this.state.shipFrom} onChange={this.handleShipFromLoc}/>
    </Form.Group>
  </Form.Group>

    <Form.Group controlId="formBasicEmail">
      <Form.Group controlId="formGridAddress1">
      <Form.Label>Ship to</Form.Label>
    <Form.Control placeholder="40 avenue de la République 92320 Châtillon" value={this.state.shipTo} onChange={this.handleShipToLoc}/>
  </Form.Group>

  </Form.Group>
  <hr/><br/>


  <Form.Group controlId="formGridEmail">
    <Form.Label>Nature</Form.Label>
    <Form.Control type="address" placeholder="nature" value={this.state.nature} onChange={this.handleNature}/>
  </Form.Group>

    <Form.Group controlId="exampleForm.ControlSelect1">
    <Form.Label>Quantity</Form.Label>
    <Form.Control type="address" placeholder="quantity" value={this.state.quantity} onChange={this.handleQuantity}/>
  </Form.Group>


  <Form.Row>
    <Col sm={6}>
  <Form.Group controlId="formGridEmail">
      <Form.Label>Gross weight</Form.Label>
      <Form.Control type="address" placeholder="gross weight" value={this.state.weight} onChange={this.handleWeight}/>
    </Form.Group>
    </Col>
    <Col sm={6}>
    <Form.Group  controlId="formGridEmail">
      <Form.Label >Gross Volume</Form.Label>
      <Form.Control type="address" placeholder="gross volume" value={this.state.volume} onChange={this.handleVolume}/>
    </Form.Group>
    </Col>
    </Form.Row>    

    <hr/><br/>
    <Form.Group controlId="formGridEmail">
      <Form.Label>Comments</Form.Label>
      <Form.Control type="address" placeholder="enter any comments" value={this.state.comments} onChange={this.handleComments}/>
    </Form.Group>
    </Form>
  </Tab>
</Tabs>

  </div>


     <div className="discovery-module-one-pop-out py-5 py-lg-3">

    <div className="container">  

    <Button variant="primary" type="submit">
      Option1: Generate onchain contract
    </Button>

    <Button variant="secondary" type="submit">
      Option2: Generate IPFS contract, hash stored onchain
    </Button>

  </div>

  </div>

  </div>

  <Footer/>
  </div>;
  }};

export default Ecmr

