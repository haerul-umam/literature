import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { ModalContextProvider } from "../src/context/modalContext"
import { AuthContextProvider } from "../src/context/authContext"

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <AuthContextProvider>
      <ModalContextProvider>
        <App/>
      </ModalContextProvider>
      </AuthContextProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

