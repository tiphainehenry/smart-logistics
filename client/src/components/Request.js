import React from 'react';
import {Tab, Tabs, Form} from 'react-bootstrap';
import '../css/boosted.min.css';

import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';

import Header from "./Header";
import RequestCmp from "./RequestCmp";

import ReactGA from 'react-ga';
ReactGA.initialize('UA-186881152-2');
ReactGA.pageview(window.location.pathname + window.location.search);

class Request extends React.Component {

  constructor(props){
    super(props);
    this.state = {

      web3: null,
      accounts: null,
      contract: null, 

      pickupAddress:'55 Rue du Faubourg Saint-Honoré, 75008 Paris',
      deliveryAddress:'10 Place de la Concorde, 75008 Paris',

      pickupCoords:'Fill in the pickup address',
      deliveryCoords:'Fill in the delivery address',

      availability:'01/12/2021 - 01/12/2021',

      equipment1:0,
      equipment2:0,
      equipment3:0,

      delayRatio:50,
      carbonRatio:50,
      experienceRatio:50,
      durationRatio:50

    };
    this.handlePickupChange = this.handlePickupChange.bind(this);
    this.handleDeliveryChange = this.handleDeliveryChange.bind(this);
    this.handleAvailability = this.handleAvailability.bind(this);
    this.handleEquipment1 = this.handleEquipment1.bind(this);
    this.handleEquipment2 = this.handleEquipment2.bind(this);
    this.handleEquipment3 = this.handleEquipment3.bind(this);

    this.handleDelayRatio = this.handleDelayRatio.bind(this);
    this.handleCarbonRatio = this.handleCarbonRatio.bind(this);
    this.handleExperienceRatio = this.handleExperienceRatio.bind(this);
    this.handleDurationRatio = this.handleDurationRatio.bind(this);

  };

  handleCarbonRatio = (e) =>{
    e.preventDefault();
    this.setState({carbonRatio:e.target.value});
  }
  handleExperienceRatio = (e) =>{
    e.preventDefault();
    this.setState({experienceRatio:e.target.value});
    ReactGA.event({
      category:'Form',
      action:'ExperienceRatio tweaked'
    });
  }

  handleDelayRatio = (e) =>{
    e.preventDefault();

    ReactGA.event({
      category:'Form',
      action:'DelayRatio tweaked'
    });
 
    this.setState({delayRatio:e.target.value});
  }
  handleDurationRatio = (e) =>{
    e.preventDefault();
    this.setState({durationRatio:e.target.value});
  }


  handlePickupChange = (e) =>{
    e.preventDefault();
    this.setState({pickupAddress:e.target.value});
  }

  handleDeliveryChange = (e) =>{
    e.preventDefault();
    this.setState({deliveryAddress:e.target.value});
  }



  handleAvailability = (e) =>{
    e.preventDefault();
    console.log(e.target.value);
    this.setState({availability:e.target.value});
  }

  handleEquipment1 (e){
     if(this.state.equipment1 ===0){
      this.setState({equipment1:1});
    }
    else{
      this.setState({equipment1:0});
    }
  }
  handleEquipment2 (e){
    if(this.state.equipment2 ===0){
     this.setState({equipment2:1});
    }
    else{
      this.setState({equipment2:0});
    }
  }
  handleEquipment3 (e){
    if(this.state.equipment3 ===0){
    this.setState({equipment3:1});
    }
    else{
      this.setState({equipment3:0});
    }
  }


  render(){
    
    return <div>
    <Header/>
    <div className="discovery-module-one-pop-out py-5 py-lg-3">
    <div className="container">

    <h1>Resource Binding Smart-Contract.</h1> 
    <p>Fill in this form to find the right resource for your needs.</p>
    <p>Watch out: the resource availability has been tuned for January 12th, and January 13th 2021.</p>
    <hr/><br/>


    <Tabs defaultActiveKey="filtering" id="uncontrolled-tab-example">
  <Tab eventKey="filtering" title="Filtering criteria">
  <Form>
    <Form.Group controlId="formBasicEmail">
      <Form.Label>When?</Form.Label>
      <DateRangePicker onApply={this.handleAvailability}  startDate="1/1/2014" endDate="3/1/2014">
        <input type="text" className="form-control" />
      </DateRangePicker>
    </Form.Group>
    <hr/><br/>
    <Form.Group controlId="formBasicEmail">
      <Form.Label>Truck equipment</Form.Label>
      <Form.Check 
        onChange={this.handleEquipment1}
        type={'checkbox'}
        id={`default-checkbox`}
        label={`cool storage`}
      />
      <Form.Check 
        onChange={this.handleEquipment2}
        type={'checkbox'}
        id={`default-checkbox`}
        label={`dangerous goods license`}
      />
      <Form.Check 
        onChange={this.handleEquipment3}
        type={'checkbox'}
        id={`default-checkbox`}
        label={`international license`}
      />
    </Form.Group>

    <hr/><br/>

    <Form.Group controlId="formBasicEmail">
      <Form.Group controlId="formGridAddress1">
      <Form.Label>Pickup address</Form.Label>
      <Form.Control onChange={this.handlePickupChange} value={this.state.pickupAddress}  />
    </Form.Group>
  </Form.Group>
  <hr/><br/>

  <Form.Group controlId="formBasicEmail">
      <Form.Group controlId="formGridAddress1">
      <Form.Label>Delivery address</Form.Label>
      <Form.Control onChange={this.handleDeliveryChange} value={this.state.deliveryAddress}  />
    </Form.Group>
  </Form.Group>
</Form>  

</Tab>

  <Tab eventKey="optim" title="Sorting criteria">
  <Form>
      <Form.Group controlId="formBasicRange">
        <Form.Label>Delay acceptance</Form.Label>
        <Form.Control onChange={this.handleDelayRatio} value={this.state.delayRatio} type="range" />
      </Form.Group>
      <Form.Group controlId="formBasicRange">
        <Form.Label>Max Experience</Form.Label>
        <Form.Control onChange={this.handleExperienceRatio} value={this.state.experienceRatio} type="range" />
      </Form.Group>
      </Form>

  </Tab>

{false? <Tab eventKey="incentives" title="Incentives">

<Form>

<Form.Group controlId="exampleForm.ControlSelect2">
<Form.Label>Incentives</Form.Label>
<Form.Control as="select" >
<option>None</option>
<option>Caution</option>
<option>Audit service</option>
</Form.Control>
</Form.Group>
<Form.Group controlId="exampleForm.ControlSelect1">
<Form.Label>Tips (€)</Form.Label>
<Form.Control as="select">
<option>0</option>
<option>1</option>
<option>2</option>
<option>3</option>
<option>4</option>
<option>5</option>
</Form.Control>
</Form.Group>
</Form>

</Tab>
: <div></div>}

</Tabs>


    <RequestCmp pickupAddress={this.state.pickupAddress} 
                deliveryAddress={this.state.deliveryAddress}
                pickupCoords={this.state.pickupCoords}
                deliveryCoords={this.state.deliveryCoords}
                availability={this.state.availability}
                equipment1={this.state.equipment1}
                equipment2={this.state.equipment2}
                equipment3={this.state.equipment3}

                optimRatios= {[this.state.delayRatio, this.state.experienceRatio]} 

    />

  </div>
  </div>

  </div>;
  }};

export default Request

