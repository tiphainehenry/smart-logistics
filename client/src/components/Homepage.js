
import React, { Component } from "react";

import "../css/boosted.min.css";

import Header from "./Header";
import Footer from "./Footer";
import ResourceId from "./ResourceId";

var resources = require('../resources.json');

class Homepage extends Component {
  
  constructor(props){
    super(props);
    this.state = { storageValue: 0, 
      web3: null, 
      accounts: null, 
      contract: null,
      value: 'coconut',
      resourceLength: resources.length,
      resourceArray: []

    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('Your favorite flavor is: ' + this.state.value);
    event.preventDefault();
  }

  componentDidMount(){
    var resourceArray = [];

    for(var i=0; i<resources.length; i++){
      resourceArray.push(i);
    }

    this.setState({'resourceArray':resourceArray});
  }


  render() {
    return (
      <div>
        <Header/>
        <section className="jumbotron text-center">
            <div className="container">
            <h1>Marketplace 3.0</h1>
            <p className="lead text-muted">Need a trusted platform to find the best service delivery assets? Try it the decentralized way. This webapp builds on the blockchain technology to manage a set of resources. Its services span from autonomous resource matching to smart contractualization and tamper-proof feedbacks.</p>
            <p>
                <a href="/request" className="btn btn-primary my-2">Search and Hire</a>
                <a href="/ecmr" className="btn btn-secondary my-2">Manage e-CMRs</a>
            </p>
            </div>
        </section>

        <div className="album py-5 bg-light">
            <div className="container">            
                <div className="row">
                    {this.state.resourceArray.map(i=> <ResourceId resource={resources[i]} hire={false}/>)}
                </div>
            </div>
        </div>

        <Footer/>
    
      </div>
      
    );
  }
}

export default Homepage;
