import React from 'react';
import './App.css';

import Routes from './Routes'

import store from './store';
import { Provider } from 'react-redux';

import { CookiesProvider } from 'react-cookie';

function App() {
  return (
    <CookiesProvider>
      <Provider store={store} >
        <Routes />
      </Provider>
    </CookiesProvider>
  );
}

export default App;