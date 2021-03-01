
import React, { Component } from "react";

import "../css/boosted.min.css";

import Header from "./Header";
import ResourceId from "./ResourceId";

import ReactGA from 'react-ga';
ReactGA.initialize('UA-186881152-2');
ReactGA.pageview(window.location.pathname + window.location.search);

var resources = require('../resources.json');


class Homepage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      resourceLength: resources.length,
      resourceArray: []

    };
  }

  componentDidMount() {
    var resourceArray = [];

    for (var i = 0; i < resources.length; i++) {
      resourceArray.push(i);
    }

    this.setState({ 'resourceArray': resourceArray });
  }


  render() {
    return (
      <div>
        <Header />
        <section className="jumbotron text-center">
          <div className="container">
            <h1>Marketplace 3.0</h1>
            <p className="lead text-muted">Need a trusted mechanism to find the best service delivery driver? Try it the decentralized way. This webapp builds on the blockchain technology to manage a set of resources. Its services span from autonomous resource matching (see the "Search and hire" pannel) to SC-based binding management (see the "Manage Contracts" pannel).
            Watch out: the resource availability has been tuned for January 12th, and January 13th 2021.
      </p>
            <p>
              <a href="/request" className="btn btn-primary my-2">Search and Hire</a>
              <a href="/ecmr" className="btn btn-secondary my-2">Manage e-CMRs</a>
            </p>

            <div className="container">
              <hr /><br />
              <p className="lead text-muted">
                The below resource profiles are registered into the binding smart contract. Among the registered criteria figure their availability, their location (lat, long), and their truck equipement. Their experience and delay QoS ratings are also stored in the smart contract. The latter can update them upon each service fulfillment.
               </p>

              <hr />

              <div className="row">

                {this.state.resourceArray.map(i => <ResourceId resource={resources[i]} hire={false} />)}
              </div>
            </div>
          </div>
        </section>
      </div>

    );
  }
}

export default Homepage;
