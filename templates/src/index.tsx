import React from 'react';
import ReactDom from 'react-dom';
import App from './App';
import './index.css';

ReactDom.render(<App />, document.querySelectorAll('.wrapper')[0]);

if (typeof module.hot === 'object' && typeof module.hot.accept === 'function') {
  module.hot.accept(() => {
    ReactDom.render(<App />, document.querySelectorAll('.wrapper')[0]);
  });
}
