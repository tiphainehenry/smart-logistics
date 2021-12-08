import React from 'react';
import {Card, ListGroup, Row, Col, Button} from 'react-bootstrap';
import '../css/boosted.min.css';
import '../css/App.css';

import ECMR from '../contracts/ECMR.json';
import getWeb3 from '../getWeb3';
 

import axios from 'axios';
const opengeocodingAPI = require("../../package.json")["opengeocodingAPI"];

class EcmrCmp extends React.Component {

  constructor(props){
    super(props);

    this.state = {

      web3: null,
      accounts: null,
      contract: null, 

      consignee:{lat:'', lng:''},
      consignor:{lat:'', lng:''},
      carrier:{lat:'', lng:''},
      shipFrom:{lat:'', lng:''},
      shipTo:{lat:'', lng:''},

      command:[],
      tenants:[],
      status:[],

      takeover:this.props.takeover, 
      issuanceDate:''

    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.instantiateSC = this.instantiateSC.bind(this);

  };

  componentWillMount() {
    // instanciating the smart contract //
       this.generateECMR();
       var today = new Date();
       var date =  (today.getMonth() + 1) + '/' + today.getDate() + '/' +  today.getFullYear();

       this.setState({'issuanceDate':date});
   
  }
  async generateECMR() {

    try {  
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ECMR.networks[networkId];
      const instance = new web3.eth.Contract(
        ECMR.abi,
        deployedNetwork && deployedNetwork.address,
      );

      this.setState({ web3, accounts, contract: instance });


      const command = await this.state.contract.methods.getCommand().call();
      const tenants = await this.state.contract.methods.getTenants().call();
      const status = await this.state.contract.methods.getStatus().call();

      console.log(command);

      this.setState({'command': command, 'tenants':tenants, 'status':status});

    } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
    };
  }

  async handleSubmit(e){
    e.preventDefault()

    // compute lat et long 
    axios.post(`http://open.mapquestapi.com/geocoding/v1/batch?key=`+opengeocodingAPI, 
    {
      "locations": [
        this.props.consigneeLoc,
        this.props.consignorLoc,
        this.props.carrierLoc,
        this.props.shipFrom,
        this.props.shipTo
      ],
      "options": {
          "maxResults": -1,
          "thumbMaps": true,
          "ignoreLatLngInput": false
      }
  }
  
    ).then( 
      (response) => { 
          var result = response.data; 
          console.log(result);
          alert('wait');
          this.setState({consignee:{
            lat:result['results'][0]['locations'][0]['displayLatLng'].lat,
            lng:result['results'][0]['locations'][0]['displayLatLng'].lng}});
          this.setState({consignor:{
            lat:result['results'][1]['locations'][0]['displayLatLng'].lat,
            lng:result['results'][1]['locations'][0]['displayLatLng'].lng}});
          this.setState({carrier:{
            lat:result['results'][2]['locations'][0]['displayLatLng'].lat,
            lng:result['results'][2]['locations'][0]['displayLatLng'].lng}});
          this.setState({shipFrom:{
            lat:result['results'][3]['locations'][0]['displayLatLng'].lat,
            lng:result['results'][3]['locations'][0]['displayLatLng'].lng}});
          this.setState({shipTo:{
            lat:result['results'][4]['locations'][0]['displayLatLng'].lat,
            lng:result['results'][4]['locations'][0]['displayLatLng'].lng}}); 

          this.instantiateSC();
          }, 
      (error) => { 
          console.log(error); 
      } 
    );         
    
  }

  async instantiateSC(){

    if(this.props.takeover !==''){
      await this.state.contract.methods.initializeTenants(this.props.consigneeETH, this.state.consignee.lat.toString(), this.state.consignee.lng.toString(),
        this.props.consignorETH, this.state.consignor.lat.toString(), this.state.consignor.lng.toString(),
        this.props.carrierETH, this.state.carrier.lat.toString(), this.state.carrier.lng.toString(), 
        this.state.issuanceDate
      ).send({ from: this.state.accounts[0] });  
    
      await this.state.contract.methods.initializeCommand(
        this.state.shipFrom.lat.toString(), this.state.shipFrom.lng.toString(), this.state.shipTo.lat.toString(), this.state.shipTo.lng.toString(),
        this.props.nature, this.props.quantity, this.props.weight, this.props.volume, 
        this.props.comments, this.props.takeover.toString(), this.state.issuanceDate
          ).send({ from: this.state.accounts[0] });  

        const command = await this.state.contract.methods.getCommand().call();
        const tenants = await this.state.contract.methods.getTenants().call();
        const status = await this.state.contract.methods.getStatus().call();
    
        console.log(command);

        this.setState({'command': command, 'tenants':tenants, 'status':status});
    }

    else{
      alert('Availability missing, please fill it in.')
    }

    
  }

  
  render(){return <div>

<div className="discovery-module-one-pop-out py-5 py-lg-3">

<div className="container">  

<Button variant="primary" type="submit" onClick={this.handleSubmit}>
  Register contract
</Button>

<Button variant="secondary" disabled type="submit">
  Option2: Generate IPFS contract, hash stored onchain
</Button>
<hr/><br/>

    <div className="discovery-module-one-pop-out py-5 py-lg-3">

    <div className="container">

    <h1 id="sysInfo">ECMR vizualization.</h1>
    <hr/>

    {(this.state.command!==[])?     <Card style={{height:'90%','marginTop':'3vh'}}>
      <Card.Header>
        
      <Row>
      <Col sm={3}><h4>Registered ECMR</h4></Col>
        {false? <div><Col sm={3}><h4>Status</h4></Col>
                <Col sm={8}>{this.state.status.map(e=><p>{e}</p>)}</Col></div>: <div></div>}
    </Row>
      </Card.Header>
      
      
      <Card.Body >

    <ListGroup variant="flush">
    <ListGroup.Item>             
    <Row>
      <Col sm={3}><h4>Issuance date</h4></Col>
      <Col sm={8}>{this.state.command[9]}</Col>
    </Row>
    <hr/>
    <Row>
      <Col sm={3}><h4>Takeover date</h4></Col>
      <Col sm={8}>{this.state.command[10]}</Col>
    </Row>
</ListGroup.Item>

<ListGroup.Item>
<Row>
      <Col sm={3}><h4>Ship From</h4></Col>
      <Col sm={8}>({this.state.command[0]},{this.state.command[1]})</Col>
    </Row>    <hr/>

    <Row>
      <Col sm={3}><h4>Ship To</h4></Col>
      <Col sm={8}>({this.state.command[2]},{this.state.command[3]})</Col>
    </Row>    
    </ListGroup.Item>


    <ListGroup.Item>    <Row>
      <Col sm={3}><h4>Consignee Account</h4></Col>
      <Col sm={8}>{this.state.tenants[0]}</Col>
    </Row>
    <hr/>
    <Row>
      <Col sm={3}><h4>Consignee Location</h4></Col>
      <Col sm={8}>({this.state.tenants[1]},{this.state.tenants[2]})</Col>
    </Row>
    <hr/>
    <Row>
      <Col sm={3}><h4>Consignor Account</h4></Col>
      <Col sm={8}>{this.state.tenants[3]}</Col>
    </Row>
    <hr/>
    <Row>
      <Col sm={3}><h4>Consignor Location</h4></Col>
      <Col sm={8}>({this.state.tenants[4]},{this.state.tenants[5]})</Col>
    </Row>
    <hr/>

    <Row>
      <Col sm={3}><h4>Carrier Account</h4></Col>
      <Col sm={8}>{this.state.tenants[6]}</Col>
    </Row>    <hr/>

    <Row>
      <Col sm={3}><h4>Carrier Location</h4></Col>
      <Col sm={8}>({this.state.tenants[7]},{this.state.tenants[8]})</Col>
    </Row>    </ListGroup.Item>
    <ListGroup.Item>    

    <Row>
      <Col sm={3}><h4>Nature</h4></Col>
      <Col sm={8}>{this.state.command[4]}</Col>
    </Row>    <hr/>

    <Row>
      <Col sm={3}><h4>Quantity</h4></Col>
      <Col sm={8}>{this.state.command[5]}</Col>
    </Row>    <hr/>

    <Row>
      <Col sm={3}><h4>Gross Weight (Kg)</h4></Col>
      <Col sm={8}>{this.state.command[6]}</Col>
    </Row>    <hr/>

    <Row>
      <Col sm={3}><h4>Gross Volume (m3)</h4></Col>
      <Col sm={8}>{this.state.command[7]}</Col>
    </Row>    <hr/>
    <Row>
      <Col sm={3}><h4>Comments</h4></Col>
      <Col sm={8}>{this.state.command[8]}</Col>
    </Row>

    </ListGroup.Item>
  </ListGroup>
      </Card.Body>
    </Card>

      :<div></div>
    }





    </div>
    
  </div>

  </div>

  <hr/><br/>
    
    </div>
  
    </div>
  
  

  }};

export default EcmrCmp

