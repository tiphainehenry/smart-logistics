import React from 'react';
import {
  Route,
  Switch,
  BrowserRouter
} from "react-router-dom";
import Homepage from './components/Homepage';
import Request from './components/Request';
import Ecmr from './components/Ecmr';
import MyContracts from './components/MyContracts';


const App = () => (
  <BrowserRouter>
      <div className="sans-serif">
      <Switch>
      <Route exact path="/" component={Homepage} />
      <Route exact path="/request" component={Request} />
      <Route exact path="/ecmr" component={Ecmr} />
      <Route exact path="/mycontracts" component={MyContracts} />
      </Switch>
    </div>
  </BrowserRouter>
);

//render(<App />, document.getElementById('root'));
//<Route exact path="/GraphPage" component={View} />
export default App;

