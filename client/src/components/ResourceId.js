import React from 'react';
import {Button, Navbar, Nav, NavDropdown} from 'react-bootstrap';
import '../css/boosted.min.css';

import {
  Link, withRouter, BrowserRouter
} from 'react-router-dom';



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
    //alert(this.props.sc[1][0]+ " is hiring " + this.props.resource.name + " on " +this.props.service[0].replace(',','/'));
    console.log(this.props.service);

    this.props.history.push({ pathname: '/empty' });
    this.props.history.replace({ pathname: '/mycontracts' });

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


                    <BrowserRouter forceRefresh={true}>
                      <Link variant="primary" onClick={this.hireCandidate}
                                            to={{pathname:'/mycontracts', key: Math.random,state: {
                                              info:{
                                                tenants:{
                                                  'consignee':{'address':this.props.sc[1][0], 'name':'consigneeName'}, 
                                                  'consignor':{'address':this.props.resource.bcAddress,'name':this.props.resource.name}
                                                },
                                                service:{
                                                    'takeover':this.props.service[0],
                                                    'shipTo':this.props.service[1],
                                                    'shipFrom':this.props.service[2]
                                                },
                                                hiring:true
                                            }
                                                  

                                            }}}
                                          >                        Hire 
                      </Link>
                    </BrowserRouter>


: 
                      <div></div>                  
                    }

                    </div>
                  </div>
                </div>
              </div>                            
;
  
}};

export default withRouter(ResourceId)

