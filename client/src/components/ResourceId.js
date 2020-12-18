import React from 'react';
import {Button, Navbar, Nav, NavDropdown} from 'react-bootstrap';
import '../css/boosted.min.css';

import ECMR from '../contracts/ECMR.json';
import getWeb3 from '../getWeb3';

class ResourceId extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      web3: null,
      accounts: null,
      contract: null,

      account:null,

      issuanceDate:"",
      equipment:[] 
    };

    this.hireCandidate = this.hireCandidate.bind(this);
  };

  componentDidMount(){
    var equips = [];
    for(var i=0;i<this.props.resource.equipment.length;i++){
      if(this.props.resource.equipment[i].equip_id == 1){
        equips.push(this.props.resource.equipment[i].equip_name)
      }
    }

    this.setState({'equipment':equips});
  } 


  async componentWillMount(){
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
      this.setState({ web3, accounts, contract: instance});

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
  };


  var today = new Date();
  var date =  (today.getMonth() + 1) + '/' + today.getDate() + '/' +  today.getFullYear();

  this.setState({'issuanceDate':date});

}

  async hireCandidate(){
    alert(this.props.sc[1]+ " is hiring " + this.props.resource.name + " " + this.props.resource.bcAddress);
  }


  render(){return <div key={this.props.resource.name} className="col-md-4">
          <div className="card mb-4 shadow-sm">
              <img className="bd-placeholder-img card-img-top" src={this.props.resource.picture} alt='Profile Picture'/>
              <div className="card-header">{this.props.resource.name}</div>  
                  <div className="card-body">
                    {this.props.QoS?  <h2>QoS: {this.props.QoS}</h2>: <div></div>  }
                    <p className="card-text">{this.props.resource.availableStart} - {this.props.resource.availableEnd}</p>
                    <p className="card-text">({this.props.resource.lat},{this.props.resource.long})</p>
                    <hr/>
                    <div className="card-text"> {this.state.equipment.map(i=> <p key={i}>{i}</p>)} </div>
                    <hr/>   
                    <div className="d-flex justify-content-between align-items-center">

                      {this.props.hire?
                      <Button variant="primary" type="submit" onClick={this.hireCandidate}>
                        Hire 
                      </Button>: 
                      <div></div>                  
                    }

                    </div>
                  </div>
                </div>
              </div>                            
;
  
}};

export default ResourceId

