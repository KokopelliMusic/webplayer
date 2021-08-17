import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { firebase, FirebaseContext } from './data/firebase';
import { SessionContext, SessionContextProvider } from './data/session';

// const socket = io('http://localhost:8080/socket.io', {
  // transports: ['websocket']
// })

ReactDOM.render(
  <React.StrictMode>
    <FirebaseContext.Provider value={firebase}>
      <SessionContextProvider>
        <App />
      </SessionContextProvider>
    </FirebaseContext.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
