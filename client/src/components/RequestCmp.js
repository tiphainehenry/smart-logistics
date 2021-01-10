import React from 'react';
import {Button, Spinner} from 'react-bootstrap';
import '../css/boosted.min.css';

import Elect from '../contracts/Elect.json';
import getWeb3 from '../getWeb3';

import ResourceId from "./ResourceId";
//import axios from 'axios';

//const opengeocodingAPI = require("../../package.json")["opengeocodingAPI"];
//const openrouteservice = require("../../package.json")["openrouteservice"];

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

      //provableAddress: '0x87b2729580a0842be45e2cb6b7c564d0989fde18' // for ganache

      provableAddress: '0xBcB81ae97446B6946a72A07d35b2849fc5C68455' // for ganache

    };

    this.computeProfileMatrix = this.computeProfileMatrix.bind(this);
    this.handleSubmitBC = this.handleSubmitBC.bind(this);
    this.askSCSort = this.askSCSort.bind(this);
    this.refreshBCQuery = this.refreshBCQuery.bind(this);
    this.FundContract = this.FundContract.bind(this);

  };
  
  async componentWillMount() {
    // instanciating the smart contract //
    this.computeProfileMatrix();
    this.moveCandidatesToBC();

  }



  computeProfileMatrix(){  // mockup environment
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

      /// sorting criteria: delay, experience, carbon, duration

      candidate.push(elem["nbDelayTime(min)"]);
      candidate.push(elem["nbServices"]);

      candidateMatrix.push(candidate);

    }

    console.log(candidateMatrix);
    //alert('Candidate matrix: '+candidateMatrix);

    this.setState({'candidateMatrix':candidateMatrix});
    
  }


  refreshBCQuery = () => {
    this.setState({BCQuery: !this.state.BCQuery});
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

      /// Check oracle balance
      var elect_address = instance.options.address;
      const balance = await this.state.web3.eth.getBalance(this.state.provableAddress);
      this.setState({'balance': balance, provableAddress: elect_address});
      console.log('Current Oracle balance is '+ balance.toString());

      // update candidates (mockup environment)
      const bcCandidates = await instance.methods.getCandidates().call();


      if ((bcCandidates === null) | ((bcCandidates !== null) && (bcCandidates.length !== this.state.candidateMatrix.length))){ // mockup setting
        alert('A transaction to instanciate the candidate db will be asked after you close this window.');
        await instance.methods.setCandidates(this.state.candidateMatrix).send({ from: this.state.accounts[0] });  
      }

      instance.events.allEvents({fromBlock: 0, toBlock: 'latest'}).on('data', (event) => {
        console.log(event);
      })
      .on('error', console.error);


      instance.events.BestCandidates().on('data', (event) => {
        console.log(event);
  
        this.refreshBCQuery();
        var hasCandidates=0;
        if(event.returnValues[0]==='No matching found'){
          hasCandidates=2;
        }
        else if(event.returnValues[0]==='Matching'){
          hasCandidates=1;
        }
        else{
          hasCandidates=0;
        }

        if (event.returnValues[1] !== ""){
          var qosresults = event.returnValues[1].split("Profiles': '")[1].slice(0, -2).split('], ');

          // convert to array
          var qoslist = [];
          for(var i=0;i<qosresults.length;i++){
  
            var qoscdd = qosresults[i].replace("[[","").replace("]]","").replace("[","").replace("]","").split(",");
  
            console.log(qoscdd);
  
            var profile = []
            for(var j=0;j<qoscdd.length;j++){
              profile.push(parseInt(qoscdd[j]));
            }
  
            qoslist.push(profile);
          }
          console.log(qoslist);
  
          // save to state
          this.setState({hasCandidates:hasCandidates,bestProfiles:qoslist})  
        }
        else{
          alert("Oops, HTTP error, please try again")
        }
      })
      .on('error', console.error);

      //this.setState({hasCandidates:true,bestProfiles:[[1, 1445],[7, 1012],[4, 1012]]})  


  
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

    if(this.props.availability !==''){

      this.refreshBCQuery();

      // AVAILABILITY
      var splAvailability = this.props.availability.split(' ');   
      var start = splAvailability[0].split('/');
      var end = splAvailability[2].split('/');
      var date = [start[1], start[0],start[2]%100, end[1], end[0],end[2]%100];
    
      // EQUIPMENT
      var filteringAttributes = [this.props.equipment1,this.props.equipment2,this.props.equipment3];

      this.setState({'date':date, 'filteringAttributes':filteringAttributes});

      this.askSCSort();

      }

      else{
        alert('Availability missing, please fill it in.')
      }

  }


  async askSCSort(){
    const bcCandidates = await this.state.contract.methods.getCandidates().call();
    //console.log(bcCandidates);

    ReactGA.event({
      category:'Form',
      action:'FilterAndSort submit'
    });

    // send to BC
    await this.state.contract.methods.elect(
          this.state.filteringAttributes,
          this.state.date,
          this.props.optimRatios.toString(),
          this.props.optimRatios.length
        ).send({from: this.state.accounts[0],
                gas:4712388,
                gasPrice: 100000000000});    
    

    // Normalize

    /// retrieve optim matrix
    //var ToNormalize = [];
    //for(var i=0;i<bcCandidates.length;i++){
    //  var candidateProfile = []
    //  for(var j=10;j<bcCandidates[0].length;j++){
    //    candidateProfile.push(bcCandidates[i][j]);
    //  }

    //  candidateProfile.push(this.state.dists[i]);
    //  candidateProfile.push(this.state.durations[i]);

    //  ToNormalize.push(candidateProfile);
    //}

    // normalize matrix
    //var cols=[]
    //for (var j=0;j<ToNormalize[0].length;j++){
    //  var col = ToNormalize.map(function(value,index) { return value[j]; });
      
    //  var ratio = Math.max.apply(Math, col);
    //  for (var i = 0; i < col.length; i++) {
    //      col[i] = Math.round(col[i] / ratio);
    //  }
    //  cols.push(col);
    //}

    //var normalized = [];
    //for (var i=0;i<cols[0].length;i++){
    //  var line = cols.map(function(value,index) { return value[i]; });            
    //  normalized.push(line);
    //}
    //console.log(normalized);

    //var qosList = []
    //for (var i=0;i<normalized.length;i++){
    //  var line = normalized[i];
    //  var qos_i = 0;

    //  for (var j=0;j<line.length;j++){
    //    qos_i = qos_i+this.props.optimRatios[j]*line[j];
    //  }
    //  qosList.push(qos_i);
    //}

    
  }

  async FundContract(){
    const balance = await this.state.web3.eth.getBalance(this.state.provableAddress);
    console.log('Current balance is '+ balance.toString());


    await this.state.web3.eth.sendTransaction({
        from: this.state.accounts[0],
        to: this.state.provableAddress,
        value: this.state.web3.utils.toWei('1', 'ether'),
        data: this.state.accounts[0]
          })
  }

  render(){    
    
    return <div>
    <br/>
    <Button variant="primary" type="submit" onClick={this.handleSubmitBC}>
      Filter and Sort 
    </Button>
    {' '}

    {this.state.balance < 10000000 ? 
    <Button variant="primary" type="submit" onClick={this.FundContract}>
    Fund Oracle
    </Button>:
    <Button variant="primary" type="submit" onClick={this.FundContract} disabled>
        Fund Oracle
    </Button>
    }
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

  {this.state.hasCandidates===1?    
                  <div className="album py-5 bg-yellow">
                     <div className="container">
                     <h2>Three Best Matches</h2>

                     <div className="row">
                     {this.state.bestProfiles.map((items, index) => {
                              return <ResourceId key={index} resource={candidates[items[0]]} QoS={items[1]} hire={true}
                                                 sc={[this.state.web3, this.state.accounts]}
                                                 service = {[this.props.availability,this.props.pickupAddress, this.props.deliveryAddress]
                                                  }               
                              />;
                            })}
                  </div>         
                  </div>
                  </div> : 
    this.state.hasCandidates===2? <div className="album py-5">
                              <div className="container">
                                  <p>No matching candidates, retry with other configuration? </p>
                              </div>  
                            </div> :
    <div></div> 
    }

  </div>;
  }};

export default RequestCmp

