import React from 'react';
import {Row, Col, Form, Button} from 'react-bootstrap';
import '../css/boosted.min.css';

import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';

import Elect from '../contracts/Elect.json';
import getWeb3 from '../getWeb3';

import axios from 'axios';

import Header from "./Header";
import Footer from "./Footer";
import ResourceId from "./ResourceId";



const opengeocodingAPI = require("../../package.json")["opengeocodingAPI"];
const openrouteservice = require("../../package.json")["openrouteservice"];

var candidates = require("../resources.json");

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

      availability:'',

      equipment1:0,
      equipment2:0,
      equipment3:0,

      candidateMatrix:[], 
      
      hasCandidates:false, 
      testCandidate:'nope',
      matchingResources:[],
      cdd:[],
      bcCandidates:[], 
      testState:'',
      matchingIds:[]

    };
    this.handlePickupChange = this.handlePickupChange.bind(this);
    this.handlePickupLatLong = this.handlePickupLatLong.bind(this);
    this.handleDeliveryChange = this.handleDeliveryChange.bind(this);
    this.handleDeliveryLatLong = this.handleDeliveryLatLong.bind(this);
    this.handleAvailability = this.handleAvailability.bind(this);
    this.handleEquipment1 = this.handleEquipment1.bind(this);
    this.handleEquipment2 = this.handleEquipment2.bind(this);
    this.handleEquipment3 = this.handleEquipment3.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.updBCCandidates = this.updBCCandidates.bind(this);
    this.updCandidates = this.updCandidates.bind(this);
    this.computeProfileMatrix = this.computeProfileMatrix.bind(this);

  };

  componentWillMount() {
    // instanciating the smart contract //
    this.computeProfileMatrix();
    this.moveCandidatesToBC();
  }


  handlePickupChange = (e) =>{
    e.preventDefault();
    this.setState({pickupAddress:e.target.value});
  }

  handleDeliveryChange = (e) =>{
    e.preventDefault();
    this.setState({deliveryAddress:e.target.value});
  }

  handlePickupLatLong = (e) => {
    e.preventDefault();
    if(this.state.pickupAddress != ''){
      axios.post(`http://open.mapquestapi.com/geocoding/v1/address?key=`+opengeocodingAPI+"&location="+this.state.pickupAddress).then( 
        (response) => { 
            var result = response.data; 
            this.setState({pickupCoords:{
              lat:result['results'][0]['locations'][0]['displayLatLng'].lat,
              lng:result['results'][0]['locations'][0]['displayLatLng'].lng}});
        }, 
        (error) => { 
            console.log(error); 
        } 
    );     
    }
    else{
      alert('Fill in the pickup address');
    }
  }
  handleDeliveryLatLong = (e) => {
    e.preventDefault();
    if(this.state.deliveryAddress != ''){
      axios.post(`http://open.mapquestapi.com/geocoding/v1/address?key=`+opengeocodingAPI+"&location="+this.state.deliveryAddress).then( 
        (response) => { 
            var result = response.data; 
            this.setState({deliveryCoords:{
              lat:result['results'][0]['locations'][0]['displayLatLng'].lat,
              lng:result['results'][0]['locations'][0]['displayLatLng'].lng}});
        }, 
        (error) => { 
            console.log(error); 
        } 
    );     
    }
    else{
      alert('Fill in the delivery address');
    }
  }


  handleAvailability = (e) =>{
    e.preventDefault();
    console.log(e.target.value);
    this.setState({availability:e.target.value});
  }

  handleEquipment1 (e){
     if(this.state.equipment1 == 0){
      this.setState({equipment1:1});
    }
    else{
      this.setState({equipment1:0});
    }
  }
  handleEquipment2 (e){
    if(this.state.equipment2 == 0){
     this.setState({equipment2:1});
    }
    else{
      this.setState({equipment2:0});
    }
  }
  handleEquipment3 (e){
    if(this.state.equipment3 == 0){
    this.setState({equipment3:1});
    }
    else{
      this.setState({equipment3:0});
    }
  }


  async updBCCandidates(){
    try {  
      alert('setting candidates');

      await this.state.contract.methods.setCandidates(this.state.candidateMatrix).send({ from: this.state.accounts[0] });  
      const bcCandidates = await this.state.contract.methods.getCandidates().call();

      this.setState({'bcCandidates':bcCandidates});

    } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
    };



  }


  computeProfileMatrix(){
    var candidateMatrix = [];
    for (var i=0; i<candidates.length;i++){
      var elem = candidates[i];
      var candidate = [];

      candidate.push(elem.id);

      var startDate = elem.availableStart.split('/');
      
      candidate.push(startDate[0]); // start day
      candidate.push(startDate[1]); // start Month
      candidate.push(startDate[2]%100); // start Year


      var endDate = elem.availableEnd.split('/'); 
      candidate.push(endDate[0]); // end day
      candidate.push(endDate[1]); // end Month
      candidate.push(endDate[2]%100); // end Year

      for(var eqId=0; eqId < elem.equipment.length;eqId++){
        candidate.push(elem.equipment[eqId].equip_id);
      }
      candidateMatrix.push(candidate);
    }

    console.log(this.state.candidateMatrix);

    this.setState({'candidateMatrix':candidateMatrix});
  }

  updCandidates(e){
    e.preventDefault();
    this.computeProfileMatrix();
  }

  async moveCandidatesToBC() {

    try {  
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Elect.networks[networkId];
      const instance = new web3.eth.Contract(
        Elect.abi,
        deployedNetwork && deployedNetwork.address,
      );

      this.setState({ web3, accounts, contract: instance });

      const bcCandidates = await this.state.contract.methods.getCandidates().call();
      const testState = await this.state.contract.methods.getTestState().call();

      this.setState({'bcCandidates':bcCandidates, 'testState':testState});
      var cdd  = await this.state.contract.methods.getFilteredCandidates().call();
      this.setState({'cdd':cdd});

  
      if (cdd.includes('1')){
        this.setState({hasCandidates:true});
        var indices = cdd.map((e, i) => e === '1' ? i : '').filter(String)
        this.setState({'matchingIds':indices});
  
      }
  
      if ((bcCandidates.length==0) | (bcCandidates.length != this.state.candidateMatrix.length)){
        alert('A transaction to instanciate the candidate db will be asked after you close this window. Please validate it.');
        await this.state.contract.methods.setCandidates(this.state.candidateMatrix).send({ from: this.state.accounts[0] });  
      }

    } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
    };
  }




  async handleSubmit(e){
    e.preventDefault();
    // call sorting function smart contract

    if(this.state.availability !=''){
      var splAvailability = this.state.availability.split(' ');   
      var start = splAvailability[0].split('/');
      var end = splAvailability[2].split('/');
      var date = [start[1], start[0],start[2]%100, end[1], end[0],end[2]%100];
    
      var filteringAttributes = [this.state.equipment1,this.state.equipment2,this.state.equipment3];

      await this.state.contract.methods.filter(
        filteringAttributes,
        date
      ).send({ from: this.state.accounts[0] });    


    }

    else{
      alert('Availability missing, please fill it in.')
    }

    var cdd  = await this.state.contract.methods.getFilteredCandidates().call();
    this.setState({});

    if (cdd.includes(1)){
      this.setState({hasCandidates:true});
    }
    else{
      this.setState({hasCandidates:false});
      alert('No matching candidates, try with other search params?')
    } 


    var testState  = await this.state.contract.methods.getTestState().call();
    //this.setState({'testState':testState});

    var indices = cdd.map((e, i) => e === '1' ? i : '').filter(String)
    this.setState({'cdd':cdd,'matchingIds':indices});


  }



  render(){
    const hasCandidates = this.state.hasCandidates;
    
    return <div>
    <Header/>
    <div className="discovery-module-one-pop-out py-5 py-lg-3">
    <div className="container">

    <h1>Fill in this form to find the right resource for your needs.</h1>
    <hr/><br/>

    <Form>
    <Form.Group controlId="formBasicEmail">
      <Form.Label>When?</Form.Label>
      <DateRangePicker onApply={this.handleAvailability}  startDate="1/1/2014" endDate="3/1/2014">
        <input type="text" className="form-control" />
      </DateRangePicker>
    </Form.Group>

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
      <Row>
        <Col sm={10}><Form.Control onChange={this.handlePickupChange} value={this.state.pickupAddress}  /></Col>
        <Col><Button onClick={this.handlePickupLatLong}>Ok</Button></Col>
      </Row>
      <Form.Text>Retrieved coordinates: ({this.state.pickupCoords.lat},{this.state.pickupCoords.lng})</Form.Text>
    </Form.Group>
  </Form.Group>
  <hr/><br/>

  <Form.Group controlId="formBasicEmail">
      <Form.Group controlId="formGridAddress1">
      <Form.Label>Delivery address</Form.Label>
      <Row>
        <Col sm={10}><Form.Control onChange={this.handleDeliveryChange} value={this.state.deliveryAddress}  /></Col>
        <Col><Button onClick={this.handleDeliveryLatLong}>Ok</Button></Col>
      </Row>
      <Form.Text>Retrieved coordinates: ({this.state.deliveryCoords.lat},{this.state.deliveryCoords.lng})</Form.Text>
    </Form.Group>
  </Form.Group>

  <hr/><br/>

    <Form.Group controlId="formBasicEmail">

      <Form.Group controlId="exampleForm.ControlSelect1">
          <Form.Label>Optimize on</Form.Label>
          <Form.Control as="select">
            <option>Duration</option>
            <option>Distance</option>
          </Form.Control>
        </Form.Group>
      </Form.Group>

      <Form.Group controlId="formBasicRange">
        <Form.Label>Delay acceptance</Form.Label>
        <Form.Control type="range" />
      </Form.Group>
      <Form.Group controlId="formBasicRange">
        <Form.Label>Critair</Form.Label>
        <Form.Control type="range" />
      </Form.Group>


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
  <hr/><br/>

    <Button variant="primary" type="submit" onClick={this.handleSubmit}>
      Filter (sort to be implemented)
    </Button>

    <Button variant="secondary" type="submit" onClick={this.updCandidates}>
      Update list of candidates
    </Button>

  </Form>
  </div>
  </div>

  {hasCandidates ?  <div className="album py-5 bg-yellow">
                      <div className="container">            
                        <h2>Matching candidates</h2>
                        <div className="row">
                        {this.state.matchingIds.map(id=> 
                        <ResourceId resource={candidates[id]}/>
                          )}                          
                        </div>
                      </div>
                    </div> :  <div className="album py-5 bg-yellow">
                                <div className="container">            
                                  <h2>No matching candidates yet</h2>
                                </div>
                              </div>               
  }

  <div className="album py-5 bg-light">
    <div className="container">            
        <h2>BC candidates</h2>
            [
              {this.state.bcCandidates.map(item=> 
                      <div className="row">[{item[0]},{item[1]},{item[2]},{item[3]},{item[4]},{item[5]},{item[6]},{item[7]},{item[8]},{item[9]}]</div>
                )}
            ]

        <h2>Filtered resources</h2>
        <div className="row">
            {this.state.cdd.map(item=> 
                      <p>{item} </p>
                )}
        </div>

        <h2>Test state</h2>
        <div className="row">
            {this.state.testState}
        </div>

        
      </div>
  </div>

  <Footer/>

  </div>;
  }};

export default Request

