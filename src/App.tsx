import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import Connect from './Connect';
import Player from './Player';

const App: React.FC = () =>
<Router>
  <Switch>
    <Route path="/player">
      <Player />
    </Route>
    <Route>
      <Connect />
    </Route>
  </Switch>
</Router>


export default App;
