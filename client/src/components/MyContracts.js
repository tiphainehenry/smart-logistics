import React, { useState } from 'react';
import {Tab, Tabs, Row, Col, Form, Button} from 'react-bootstrap';
import '../css/boosted.min.css';
import '../css/App.css';


import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
 
import Header from "./Header";
import Footer from "./Footer";

import Hire from '../contracts/Hire.json';
import getWeb3 from '../getWeb3';


class MyContracts extends React.Component {

  constructor(props){
    super(props);

    this.state = {

      tenants : {
        'consignee': {'address':'0x3b8e54c2E7Bb38ffeb8Ddc9511461C6691Ff52A8', 'name':'Orange'},
        'consignor': {'address':'0x3b8e54c2E7Bb38ffeb8Ddc9511461C6691Ff52A8', 'name': 'FM logistics'}
      },

      //consigneeLoc: '140 Avenue de la République 92230 Chatillon',
      //consignorLoc:'55 Rue du Faubourg Saint-Honoré, 75008 Paris',
      //carrierLoc:'10 Place de la Concorde, 75008 Paris',

      //consigneeCompany: 'Orange',
      //consignorCompany:'Nespresso',
      //carrierCompany:'FM Logistic',

      service : {
        shipFrom:'4 Rue du Clos Courtel, 35510 Cesson-Sévigné',
        shipTo:'78 Rue Olivier de Serres, 75015 Paris',
        takeover:'',  
      },

      merchandise : {
        quantity:'',
        nature:'',
        weight:'',
        volume:'',   
      },

      comments:'',

      aggreements: [],

      storedContracts: []

    };

    this.handleConsigneeETH = this.handleConsigneeETH.bind(this);
    this.handleConsignorETH = this.handleConsignorETH.bind(this);

    this.handleConsigneeCompany = this.handleConsigneeCompany.bind(this);
    this.handleConsignorCompany = this.handleConsignorCompany.bind(this);

    this.handleTakeover = this.handleTakeover.bind(this);
    this.handleShipFromLoc = this.handleShipFromLoc.bind(this);
    this.handleShipToLoc = this.handleShipToLoc.bind(this);

    this.handleNature = this.handleNature.bind(this);
    this.handleQuantity = this.handleQuantity.bind(this);
    this.handleWeight = this.handleWeight.bind(this);
    this.handleVolume = this.handleVolume.bind(this);
    this.handleComments = this.handleComments.bind(this);

    this.handleRegistration = this.handleRegistration.bind(this);
    this.getCommands = this.getCommands.bind(this);
  };


  componentDidMount(){

    var today = new Date();
    var date =  (today.getMonth() + 1) + '/' + today.getDate() + '/' +  today.getFullYear();


    const { info } = this.props.location.state  || '';
    if (typeof info !== "undefined") {
      //const { service } = this.state.service;
    
      console.log(info);
      this.setState({'issuanceDate':date.toString(), 'tenants':info.tenants, 'service':info.service});

    }

  }

  async componentWillMount(){
    
    try {  
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Hire.networks[networkId];
      const instance = new web3.eth.Contract(
        Hire.abi,
        deployedNetwork && deployedNetwork.address,
      );

      this.setState({ web3, accounts, contract: instance });

      
      this.getCommands();


    } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
    };
  }




  handleTakeover = (e) =>{
    e.preventDefault();
    console.log(e.target.value);

    var new_service = {
      shipFrom:this.state.service.shipFrom,
      shipTo:this.state.service.shipTo,
      takeover:e.target.value  
    }

    this.setState({service:new_service});
  }

  handleShipFromLoc(e) {
    e.preventDefault();

    var new_service = {
      shipFrom:e.target.value,
      shipTo:this.state.service.shipTo,
      takeover:this.state.service.takeover
    }

    this.setState({service:new_service});
  }
  handleShipToLoc(e) {
    e.preventDefault();
    var new_service = {
      shipFrom:this.state.service.shipFrom,
      shipTo:e.target.value,
      takeover:this.state.service.takeover
    }
    this.setState({service:new_service});
  }

  handleNature(e) {
    e.preventDefault();

    var new_merchandise = {
      quantity:this.state.merchandise.quantity,
      nature:e.target.value,
      weight:this.state.merchandise.weight,
      volume:this.state.merchandise.volume   
    }

    this.setState({merchandise:new_merchandise});
  }

  handleQuantity(e) {
    e.preventDefault();
    var new_merchandise = {
      quantity:e.target.value,
      nature:this.state.merchandise.nature,
      weight:this.state.merchandise.weight,
      volume:this.state.merchandise.volume   
    }

    this.setState({merchandise:new_merchandise});
  }
  handleWeight(e) {
    e.preventDefault();
    var new_merchandise = {
      quantity:this.state.merchandise.quantity,
      nature:this.state.merchandise.nature,
      weight:e.target.value,
      volume:this.state.merchandise.volume   
    }

    this.setState({merchandise:new_merchandise});
  }
  handleVolume(e) {
    e.preventDefault();
    var new_merchandise = {
      quantity:this.state.merchandise.quantity,
      nature:this.state.merchandise.nature,
      weight:this.state.merchandise.weight,
      volume:e.target.value   
    }
    this.setState({merchandise:new_merchandise});
  }


  handleComments(e) {
    e.preventDefault();
    this.setState({comments:e.target.value});
  }


  handleConsigneeETH(e) {
    e.preventDefault();
    var new_tenants = {
      'consignee': {'address':e.target.value, 'name':this.state.tenants.consignee.name},
      'consignor': {'address':this.state.tenants.consignor.address, 'name':this.state.tenants.consignor.name}
    }
    this.setState({tenants:new_tenants});
  }
  handleConsignorETH(e) {
    e.preventDefault();
    var new_tenants = {
      'consignee': {'address':this.state.tenants.consignee.address, 'name':this.state.tenants.consignee.name},
      'consignor': {'address':e.target.value, 'name':this.state.tenants.consignor.name}
    }
    this.setState({tenants:new_tenants});
  }

  handleConsigneeCompany(e) {
    e.preventDefault();
    var new_tenants = {
      'consignee': {'address':this.state.tenants.consignee.address, 'name':e.target.value},
      'consignor': {'address':this.state.tenants.consignor.address, 'name':this.state.tenants.consignor.name}
    }
    this.setState({tenants:new_tenants});
    
  }
  handleConsignorCompany(e) {
    var new_tenants = {
      'consignee': {'address':this.state.tenants.consignee.address, 'name':this.state.tenants.consignee.name},
      'consignor': {'address':this.state.tenants.consignor.address, 'name':e.target.value}
    }
    this.setState({tenants:new_tenants});
  }


  async getCommands(){
    const numcommand = await this.state.contract.methods.totalAggreements().call();

    if(numcommand>0){
      for(var i=0;i<numcommand;i++){
        var seeAggreement = await this.state.contract.methods.seeAggreement(i).call();
        seeAggreement.push(i);

        var storedCtrs = this.state.storedContracts;

        storedCtrs.push(seeAggreement);
        this.setState({storedContracts: storedCtrs});

        console.log(seeAggreement)
      }
    }
  }

  async handleRegistration(){
    alert('loaded web3');

    console.log(this.state.service);
    // Get network provider and web3 instance.

    //console.log([this.state.tenants.consignee.address,this.state.tenants.consignor.address],this.state.issuanceDate,
    //  [this.state.service.shipFrom,this.state.service.shipTo, this.state.service.takeover], this.state.merchandise.nature, 
    //  [this.state.merchandise.quantity, this.state.merchandise.weight,this.state.merchandise.volume]);


    await this.state.contract.methods.addAggreement(
      [this.state.tenants.consignee.address,this.state.tenants.consignor.address],
      this.state.issuanceDate,
      [this.state.service.shipFrom,this.state.service.shipTo, this.state.service.takeover], 
      this.state.merchandise.nature, 
      [this.state.merchandise.quantity, this.state.merchandise.weight,this.state.merchandise.volume] 
       ).send({ from: this.state.accounts[0] });  
  }

  
  render(){return <div>
    <Header/>
    <div className="discovery-module-one-pop-out py-5 py-lg-3">

<div className="container">
<table id="news-table" class="table tablesorter mb-5">
          <caption>
            My Contracts.
          </caption>
          <thead class="cf">
            <tr>

              <th scope="col" class="header">ID</th>
              <th scope="col" class="header">IssuanceDate</th>
              <th scope="col" class="header">Status</th>
              <th scope="col" class="header">Tenants</th>
              <th scope="col" class="header">Service</th>
              <th scope="col" class="header">Merchandise</th>
              <th scope="col" class="header">Actions</th>

            </tr>
          </thead>
          <tbody>
          {this.state.storedContracts.map(i=> 
            <tr>
            <td class="align-middle">{i[6]}</td>
            <td class="align-middle">{i[0]}</td>
            <td class="align-middle">{i[5]}</td>

            <td class="align-middle">
              <b>Consignee:</b> {i[1][0]}
              <br/>
              <b>Consignor:</b> {i[1][1]}
            </td>
            <td class="align-middle">
              
            <b>ShipFrom:</b> {i[2][0]}<br/>
            <b>ShipTo:</b> {i[2][1]}<br/>
            <b>TakeoverDate:</b> {i[2][2]}
            </td>
            <td class="align-middle">{i[3][0]} (#{i[3][1]}). {i[3][2]}m3-{i[3][3]}Kg.</td>

            <td class="align-middle">
                <a href="#" class="btn btn-sm btn-secondary">Monitor</a>
                <a href="#" class="btn btn-sm btn-secondary">Delegate</a>
             </td>


          </tr>


)}


          </tbody>
        </table>


        <br/>

  <h1>Generate a new contract.</h1>

  <Tabs defaultActiveKey="tenants" id="uncontrolled-tab-example">
    <Tab eventKey="tenants" title="(1) Service">
      <Form>
              <h3>Consignee</h3>
              <Form.Group controlId="formGridEmail">
                <Form.Label>Company</Form.Label>
                <Form.Control type="address" placeholder="consignee address" onChange={this.handleConsigneeCompany} value={this.state.tenants.consignee.name} />
              </Form.Group>
              <Form.Group controlId="formGridEmail">
                <Form.Label>Eth account</Form.Label>
                <Form.Control type="address" placeholder="consignee address" onChange={this.handleConsigneeETH} value={this.state.tenants.consignee.address} />
              </Form.Group>
            <hr/><br/>
              <h3>Consignor</h3>
              <Form.Group controlId="formGridEmail">
                <Form.Label>Company</Form.Label>
                <Form.Control type="address" placeholder="consignee address" onChange={this.handleConsignorCompany} value={this.state.tenants.consignor.name} />
              </Form.Group>

              <Form.Group controlId="formGridEmail">
                <Form.Label>Eth account</Form.Label>
                <Form.Control type="address" placeholder="consignor address" onChange={this.handleConsignorETH} value={this.state.tenants.consignor.address} />
              </Form.Group>

              <hr/><br/>
              <h3>Service</h3>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Pickup date</Form.Label>
                <DateRangePicker onApply={this.handleTakeover}  startDate="1/1/2014" endDate="3/1/2014">
                  <input type="text" className="form-control" />
                </DateRangePicker>
            </Form.Group>

              <Form.Group controlId="formBasicEmail">
                <Form.Group controlId="formGridAddress1">
                <Form.Label>Ship from</Form.Label>
                <Form.Control placeholder="40 rue Georges Huguet 92140 Clamart" value={this.state.service.shipFrom} onChange={this.handleShipFromLoc} />
              </Form.Group>
            </Form.Group>

              <Form.Group controlId="formBasicEmail">
                <Form.Group controlId="formGridAddress1">
                <Form.Label>Ship to</Form.Label>
              <Form.Control placeholder="40 avenue de la République 92320 Châtillon" value={this.state.service.shipTo} onChange={this.handleShipToLoc} />
            </Form.Group>

            </Form.Group>
            <hr/><br/>
      </Form>
    </Tab>

    <Tab eventKey="command" title="(2) Merchandise Information">
    <Form>

    <Form.Group controlId="formGridEmail">
      <Form.Label>Nature</Form.Label>
      <Form.Control type="address" placeholder="nature" value={this.state.merchandise.nature}  onChange={this.handleNature}/>
    </Form.Group>

      <Form.Group controlId="exampleForm.ControlSelect1">
      <Form.Label>Quantity</Form.Label>
      <Form.Control type="address" placeholder="quantity" value={this.state.merchandise.quantity} onChange={this.handleQuantity}/>
    </Form.Group>


    <Form.Row>
      <Col sm={6}>
    <Form.Group controlId="formGridEmail">
        <Form.Label>Gross weight</Form.Label>
        <Form.Control type="address" placeholder="gross weight" value={this.state.merchandise.weight} onChange={this.handleWeight}/>
      </Form.Group>
      </Col>
      <Col sm={6}>
      <Form.Group  controlId="formGridEmail">
        <Form.Label >Gross Volume</Form.Label>
        <Form.Control type="address" placeholder="gross volume" value={this.state.merchandise.volume} onChange={this.handleVolume}/>
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
      <div><br/>
        <Button onClick={this.handleRegistration}>Register aggreement on the blockchain</Button>
        <p>
          If the aggreement information is correct, please click this button.
        </p>

        </div>


      </div>
  </div>

  <Footer/>
  </div>;
  }};

export default MyContracts

