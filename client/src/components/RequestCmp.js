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
      matchingIds:[]

    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.updCandidates = this.updCandidates.bind(this);
    this.computeProfileMatrix = this.computeProfileMatrix.bind(this);
  };
  
  componentWillMount() {
    // instanciating the smart contract //
    this.computeProfileMatrix();
    this.moveCandidatesToBC();
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
      if ((bcCandidates.length==0) | (bcCandidates.length != this.state.candidateMatrix.length)){
        alert('A transaction to instanciate the candidate db will be asked after you close this window.');
        await this.state.contract.methods.setCandidates(this.state.candidateMatrix).send({ from: this.state.accounts[0] });  
      }

      const testState = await this.state.contract.methods.getTestState().call();

      var cdd  = await this.state.contract.methods.getFilteredCandidates().call();
  
      if (cdd.includes('1')){
        var indices = cdd.map((e, i) => e === '1' ? i : '').filter(String)
        this.setState({hasCandidates:true,'matchingIds':indices});
      }
  
      this.setState({'bcCandidates':bcCandidates, 'testState':testState, 'cdd':cdd});

    } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
    };
  }

  async handleSubmit(e){
    // call sorting function smart contract
    e.preventDefault()

    if(this.props.availability !=''){
      var splAvailability = this.props.availability.split(' ');   
      var start = splAvailability[0].split('/');
      var end = splAvailability[2].split('/');
      var date = [start[1], start[0],start[2]%100, end[1], end[0],end[2]%100];
    
      var filteringAttributes = [this.props.equipment1,this.props.equipment2,this.props.equipment3];

      await this.state.contract.methods.filter(
        filteringAttributes,
        date
      ).send({ from: this.state.accounts[0] });    

    }

    else{
      alert('Availability missing, please fill it in.')
    }

    var cdd  = await this.state.contract.methods.getFilteredCandidates().call();

    var indices = cdd.map((e, i) => e === '1' ? i : '').filter(String)
    this.setState({'cdd':cdd,'matchingIds':indices});

    if (cdd.includes(1)){
      this.setState({hasCandidates:true});
    }
    else{
      this.setState({hasCandidates:false});
    } 

  }

  updCandidates(e){
    e.preventDefault();
    this.computeProfileMatrix();
  }


  render(){
    const hasCandidates = this.state.hasCandidates;
    
    return <div>

    <Button variant="primary" type="submit" onClick={this.handleSubmit}>
      Filter (sort to be implemented)
    </Button>

    <Button variant="secondary" type="submit" onClick={this.updCandidates}>
      Update list of candidates
    </Button>



  {hasCandidates?    
                  <div className="album py-5 bg-yellow">
                     <div className="container">
                        <h2>Matching candidates</h2>
                        <div className="row">
                        {this.state.matchingIds.map(id=> 
                        <ResourceId resource={candidates[id]}/>
                          )}                          
                      </div>
                      </div>
                  </div> :  <div className="album py-5">
                              <div className="container">
                                  <p>No matching candidates, retry with other configuration? </p>
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


  </div>;
  }};

export default RequestCmp

