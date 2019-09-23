import React from 'react';
import { render } from 'react-dom';
import App from './App.js';
import StateProvider from './components/StateProvider';

const Index = () => {
  return (
    <StateProvider>
      <App />
    </StateProvider>
  );
};

render(<Index />, document.getElementById('root'));
