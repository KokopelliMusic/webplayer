import EventEmitter from 'events';
import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import Connect from './pages/Connect';
import Player from './pages/Player';

interface AppProps {
}

const App: React.FC<AppProps> = (props) => {

  useEffect(() => {
    if (!window.playerEvents) window.playerEvents = new EventEmitter()
  }, [])

  return <Router>
    <Switch>
      <Route path="/player">
        <Player />
      </Route>
      <Route>
        <Connect />
      </Route>
    </Switch>
  </Router>

}



export default App;
