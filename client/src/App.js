import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  BrowserRouter
} from "react-router-dom";
import Homepage from './components/Homepage';
import Request from './components/Request';
import Ecmr from './components/Ecmr';


const App = () => (
  <BrowserRouter>
      <div className="sans-serif">
      <Route exact path="/" component={Homepage} />
      <Route exact path="/request" component={Request} />
      <Route exact path="/ecmr" component={Ecmr} />
    </div>
  </BrowserRouter>
);

//render(<App />, document.getElementById('root'));
//<Route exact path="/GraphPage" component={View} />
export default App;

