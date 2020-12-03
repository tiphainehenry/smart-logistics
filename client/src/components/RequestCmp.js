import React from 'react';
import {Row, Col, Form, Button} from 'react-bootstrap';
import '../css/boosted.min.css';

import Elect from '../contracts/Elect.json';
import getWeb3 from '../getWeb3';

import ResourceId from "./ResourceId";
import axios from 'axios';

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
      bestProfiles:[]



    };

    this.updCandidates = this.updCandidates.bind(this);
    this.computeProfileMatrix = this.computeProfileMatrix.bind(this);
    this.handleSubmitBC = this.handleSubmitBC.bind(this);
    this.handleResultBC = this.handleResultBC.bind(this);
    this.askSCSort = this.askSCSort.bind(this);

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

      /// sorting criteria: delay, experience, carbon, duration

      candidate.push(elem["nbDelayTime(min)"]);
      candidate.push(elem["nbServices"]);

      candidateMatrix.push(candidate);

    }

    //console.log(candidateMatrix);
    //alert('Candidate matrix: '+candidateMatrix);

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

  async handleSubmitBC(e){
    e.preventDefault();
    if(this.props.availability !=''){

      // AVAILABILITY
      var splAvailability = this.props.availability.split(' ');   
      var start = splAvailability[0].split('/');
      var end = splAvailability[2].split('/');
      var date = [start[1], start[0],start[2]%100, end[1], end[0],end[2]%100];
    
      // EQUIPMENT
      var filteringAttributes = [this.props.equipment1,this.props.equipment2,this.props.equipment3];

      this.setState({'date':date, 'filteringAttributes':filteringAttributes});

    
      // DISTANCE.DURATION
      if(this.state.pickupAddress != ''){
        axios.post(`http://open.mapquestapi.com/geocoding/v1/address?key=`+opengeocodingAPI+"&location="+this.state.pickupAddress).then( 
          (response) => { 
              var result = response.data; 

              var pickupCoordsLat = result['results'][0]['locations'][0]['displayLatLng'].lat;
              var pickupCoordsLng = result['results'][0]['locations'][0]['displayLatLng'].lng;

              this.setState({pickupCoords:{
                lat:pickupCoordsLat,
                lng:pickupCoordsLng}});


              var locationList = [[pickupCoordsLng, pickupCoordsLat]];
              for(var i=0; i<candidates.length; i++){
                  locationList.push([candidates[i].long, candidates[i].lat]);
              }  
          
              axios.post("https://api.openrouteservice.org/v2/matrix/driving-car",{locations:locationList, sources:[0],"metrics":["distance","duration"]},{
                  headers: {Authorization: openrouteservice}
                 }).then( 
                  (response) => { 
                      var result = response.data; 

                      var dists = result["durations"][0];
                      var durations = result["distances"][0];
          
                      //var ratio = Math.max.apply(Math, dists) / 100;
                      
                      for (var i = 0; i < dists.length; i++) {
                        dists[i] = Math.round(100*dists[i]);
                        durations[i] = Math.round(100*durations[i]);
                      }

                      this.setState({'dists':dists, 'durations':durations});


                      this.askSCSort();
                  }, 
                  (error) => { 
                      console.log(error); 
                  }) 
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

      else{
        alert('Availability missing, please fill it in.')
      }

    this.handleResultBC();

  }


  async askSCSort(){
    const bcCandidates = await this.state.contract.methods.getCandidates().call();

    // Normalize

    /// retrieve optim matrix
    var ToNormalize = [];
    for(var i=0;i<bcCandidates.length;i++){
      var candidateProfile = []
      for(var j=10;j<bcCandidates[0].length;j++){
        candidateProfile.push(bcCandidates[i][j]);
      }

      candidateProfile.push(this.state.dists[i]);
      candidateProfile.push(this.state.durations[i]);

      ToNormalize.push(candidateProfile);
    }

    // normalize matrix
    var cols=[]
    for (var j=0;j<ToNormalize[0].length;j++){
      var col = ToNormalize.map(function(value,index) { return value[j]; });
      
      var ratio = Math.max.apply(Math, col);
      for (var i = 0; i < col.length; i++) {
          col[i] = Math.round(col[i] / ratio);
      }
      cols.push(col);
    }

    var normalized = [];
    for (var i=0;i<cols[0].length;i++){
      var line = cols.map(function(value,index) { return value[i]; });            
      normalized.push(line);
    }

    console.log(normalized);

    var qosList = []
    for (var i=0;i<normalized.length;i++){
      var line = normalized[i];
      var qos_i = 0;

      for (var j=0;j<line.length;j++){
        qos_i = qos_i+this.props.optimRatios[j]*line[j];
      }
      qosList.push(qos_i);
    }

    // send to BC
    await this.state.contract.methods.elect(
      qosList,
      this.state.filteringAttributes,
      this.state.date
    ).send({ from: this.state.accounts[0] });    
    
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

  updCandidates(e){
    e.preventDefault();
    this.computeProfileMatrix();
  }


  render(){
    const hasCandidates = this.state.hasCandidates;
    
    

    return <div>
    <br/>
    <Button variant="primary" type="submit" onClick={this.handleSubmitBC}>
      Filter and Sort 
    </Button>

    <Button variant="primary" type="submit" onClick={this.computeProfileMatrix}>
      Display candidate matrix
    </Button>

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

