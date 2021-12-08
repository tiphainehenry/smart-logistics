import React from 'react';
import {Button, Spinner} from 'react-bootstrap';
import '../css/boosted.min.css';

import TenderManager from '../contracts/TenderManager.json';
import getWeb3 from '../getWeb3';

import ResourceId from "./ResourceId";
//import axios from 'axios';

import ReactGA from 'react-ga';
ReactGA.initialize('UA-186881152-2');
ReactGA.pageview(window.location.pathname + window.location.search);

var candidates = require("../resources.json");

class RequestCmp extends React.Component {

  constructor(props){
    super(props);
    this.state = {

      web3: null,
      accounts: null,
      contract: null, 

      candidateMatrix:[], 
      
      hasCandidates:false, 
      testCandidate:'nope',
      matchingResources:[],
      cdd:[],
      bcCandidates:[], 
      testState:'',
      matchingIds:[],
      toOptim:[], 

      QoS:[],
      bestProfiles:[],
      BCQuery:false,

      balance:0,

      provableAddress: "0x87B2729580A0842BE45E2CB6b7C564d0989FDE18" // for ganache
      //provableAddress: '0xBcB81ae97446B6946a72A07d35b2849fc5C68455' // for ganache
    };
    this.handleSubmitBC = this.handleSubmitBC.bind(this);
    this.registerOffer = this.registerOffer.bind(this);
  };


  async componentWillMount() {
    // instanciating the smart contract //
    this.moveCandidatesToBC();
  }
  
  async moveCandidatesToBC() {

    try {  
      // Get network provider and web3 instance.
      const web3 = await getWeb3();


      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = TenderManager.networks[networkId];
      const instance = new web3.eth.Contract(
        TenderManager.abi,
        deployedNetwork && deployedNetwork.address,
      );

      this.setState({ web3, accounts, contract: instance });

      // update candidates (mockup environment)
      //
      instance.events.allEvents({fromBlock: 0, toBlock: 'latest'}).on('data', (event) => {
        console.log(event);
      })
      .on('error', console.error);

      instance.events.LogBestAlloc().on('data', (event) => {
        console.log(event);  
      })
      .on('error', console.error);
  
    } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
    };
  }

  async handleSubmitBC(e){
    e.preventDefault();

    this.setState({BCQuery: !this.state.BCQuery});
    this.registerOffer();

  }


  async registerOffer(){
    ReactGA.event({
      category:'Form',
      action:'register offer submit'
    });


    const { accounts, contract } = this.state;
    console.log(  this.props.c_key);
    console.log(this.props.c_offer);

    try{
        await contract.methods.newOffer(
          this.props.tenderName,         
          this.props.c_key,
          this.props.c_offer
        ).send({
          from: this.state.accounts[0],
          gas:5712388,
          gasPrice: 100000000000}).then(output=>{
            console.log(output);
        })
    }
    catch(error){
        console.log(error);
    }
  }


  render(){    
    
    return <div>
    <br/>
    <Button variant="primary" type="submit" onClick={this.handleSubmitBC}>
      Send offer to smart contract 
    </Button>
    {' '}

    {this.state.BCQuery?     <Button variant="primary" disabled>
                                <Spinner
                                  as="span"
                                  animation="border"
                                  size="sm"
                                  role="status"
                                  aria-hidden="true"
                                />
                                <span className="sr-only">Loading...</span>
                              </Button>
                            : 
                            <div></div>    
    }

  </div>;
  }};

export default RequestCmp

