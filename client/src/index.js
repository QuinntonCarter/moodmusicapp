import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.js';
import UserProvider from './components/context/userProvider.js';
import AppContextProvider from './components/context/appContext.js';

import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <BrowserRouter>
    <UserProvider>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </UserProvider>
  </BrowserRouter>,
  document.getElementById('root')
);