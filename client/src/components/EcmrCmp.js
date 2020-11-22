import React, { useState } from 'react';
import {Tab, Tabs, Row, Col, Form, Button} from 'react-bootstrap';
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

    };

    this.handleSubmit = this.handleSubmit.bind(this);

  };

  componentWillMount() {
    // instanciating the smart contract //
       this.generateECMR();
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
    axios.post(`http://open.mapquestapi.com/geocoding/v1/address?key=`+opengeocodingAPI+"&location="+this.props.consigneeLoc).then( 
      (response) => { 
          var result = response.data; 
          this.setState({consignee:{
            lat:result['results'][0]['locations'][0]['displayLatLng'].lat,
            lng:result['results'][0]['locations'][0]['displayLatLng'].lng}});
      }, 
      (error) => { 
          console.log(error); 
      } 
    );     

    axios.post(`http://open.mapquestapi.com/geocoding/v1/address?key=`+opengeocodingAPI+"&location="+this.props.consignorLoc).then( 
    (response) => { 
        var result = response.data; 
        this.setState({consignor:{
          lat:result['results'][0]['locations'][0]['displayLatLng'].lat,
          lng:result['results'][0]['locations'][0]['displayLatLng'].lng}});
    }, 
    (error) => { 
        console.log(error); 
    } 
    );     

    axios.post(`http://open.mapquestapi.com/geocoding/v1/address?key=`+opengeocodingAPI+"&location="+this.props.carrierLoc).then( 
    (response) => { 
        var result = response.data; 
        this.setState({carrier:{
          lat:result['results'][0]['locations'][0]['displayLatLng'].lat,
          lng:result['results'][0]['locations'][0]['displayLatLng'].lng}});
    }, 
    (error) => { 
        console.log(error); 
    } 
    );     

    axios.post(`http://open.mapquestapi.com/geocoding/v1/address?key=`+opengeocodingAPI+"&location="+this.props.shipFrom).then( 
    (response) => { 
        var result = response.data; 
        this.setState({shipFrom:{
          lat:result['results'][0]['locations'][0]['displayLatLng'].lat,
          lng:result['results'][0]['locations'][0]['displayLatLng'].lng}});
    }, 
    (error) => { 
        console.log(error); 
    } 
    );     

    axios.post(`http://open.mapquestapi.com/geocoding/v1/address?key=`+opengeocodingAPI+"&location="+this.props.shipTo).then( 
    (response) => { 
        var result = response.data; 
        this.setState({shipTo:{
          lat:result['results'][0]['locations'][0]['displayLatLng'].lat,
          lng:result['results'][0]['locations'][0]['displayLatLng'].lng}});
      }, 
      (error) => { 
        console.log(error); 
      } 
    );     

    await this.state.contract.methods.initializeTenants(this.props.consigneeETH, this.state.consignee.lat, this.state.consignee.lng,
      this.props.consignorETH, this.state.consignor.lat, this.state.consignor.lng,
      this.props.carrierETH, this.state.carrier.lat, this.state.carrier.lng
      ).send({ from: this.state.accounts[0] });  
    
    await this.state.contract.methods.initializeCommand(
      this.state.shipFrom.lat, this.state.shipFrom.lng, this.state.shipTo.lat, this.state.shipTo.lng,
      this.props.nature, this.props.quantity, this.props.weight, this.props.volume, 
      this.props.comments, this.props.takeoverDate
        ).send({ from: this.state.accounts[0] });  

  }

  
  render(){return <div>

<div className="discovery-module-one-pop-out py-5 py-lg-3">

<div className="container">  

<Button variant="primary" type="submit" onClick={this.handleSubmit}>
  Option1: Generate onchain contract
</Button>

<Button variant="secondary" type="submit">
  Option2: Generate IPFS contract, hash stored onchain
</Button>
<hr/><br/>

    <div className="discovery-module-one-pop-out py-5 py-lg-3">

    <div className="container">

    <h1>ECMR vizualization.</h1>
    <hr/><br/>

    
    </div>
    
  </div>

  </div>

  <hr/><br/>
    
    </div>
  
    </div>
  
  

  }};

export default EcmrCmp

