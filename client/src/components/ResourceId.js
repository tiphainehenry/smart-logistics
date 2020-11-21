import React from 'react';
import { Navbar, Nav, NavDropdown} from 'react-bootstrap';
import '../css/boosted.min.css';


class ResourceId extends React.Component {

  constructor(props){
    super(props);
    this.state = {equipment:[]};
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

  render(){return <div className="col-md-4">
          <div className="card mb-4 shadow-sm">
              <img className="bd-placeholder-img card-img-top" src={this.props.resource.picture} alt='Profile Picture'/>
              <div className="card-header">{this.props.resource.name}</div>  
                  <div className="card-body">
                    <p className="card-text">{this.props.resource.availableStart} - {this.props.resource.availableEnd}</p>
                    <p className="card-text">({this.props.resource.lat},{this.props.resource.long})</p>
                    <hr/>
                    <p className="card-text"> {this.state.equipment.map(i=> <p>{i}</p>)} </p>
                    <hr/>   
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="btn-group">
                        <a type="button" className="btn btn-sm btn-secondary" href='/ecmr'>Hire</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>                            
;
  
}};

export default ResourceId

