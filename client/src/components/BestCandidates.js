import React from 'react';
import {Button, Spinner} from 'react-bootstrap';
import '../css/boosted.min.css';

import Elect from '../contracts/Elect.json';
import getWeb3 from '../getWeb3';

import ResourceId from "./ResourceId";
import axios from 'axios';

import $ from 'jquery'; 

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
      matchingIds:[],
      toOptim:[], 

      QoS:[],
      bestProfiles:[],
      BCQuery:false
    };

    this.handleResultBC = this.handleResultBC.bind(this);
    this.refreshBCQuery = this.refreshBCQuery.bind(this);
  };
  

  refreshBCQuery = () => {
    this.setState({BCQuery: !this.state.BCQuery});
  }

  async componentWillMount() {


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



      /// get best candidates
      instance.events.BestCandidates({
        fromBlock: 0
      }, function (error, event) {
  
        if (error) {console.log(error)}
  
        else{
          console.log(event.returnValues[1]);
        }
      })
  
      this.setState({ web3, accounts, contract: instance });

      var QoS = await this.state.contract.methods.getQoSList().call();

      var bestProfiles = await this.state.contract.methods.getBestProfiles().call();

      this.setState({'QoS':QoS, 'bestProfiles':bestProfiles});

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


  async handleResultBC(e){
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


  render(){
    const hasCandidates = this.state.hasCandidates;
    
    

    return <div>
    <br/>
    <Button variant="primary" type="submit" onClick={this.handleSubmitBC}>
      Filter and Sort 
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

  {hasCandidates?    
                  <div className="album py-5 bg-yellow">
                     <div className="container">
                     <h2>Three Best Matches</h2>

                     <div className="row">
                     {this.state.bestProfiles.map((items, index) => {
                              return <ResourceId key={index} resource={candidates[items[0]]} QoS={items[1]}/>;
                            })}
                  </div>

                  {false? <div><h2>Matching candidates</h2>
                        <div className="row">
                        {this.state.matchingIds.map(id=> 
                        <ResourceId resource={candidates[id]} QoS={this.state.QoS[id]}/>
                        )}                          
                      </div></div>: <div></div>
                    }
                        


                      </div>


                  </div> :  <div className="album py-5">
                              <div className="container">
                                  <p>No matching candidates, retry with other configuration? </p>
                              </div>  
                            </div>  
    }

  </div>;
  }};

export default RequestCmp

