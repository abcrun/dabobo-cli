import React from 'react';
import ReactDom from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import './index.css';

class App extends React.PureComponent {
  render(): React.ReactNode {
    return (
      <div>
        Hello, <span>Cousin</span>, Welcome to use the cousin scaffold!
      </div>
    );
  }
}

ReactDom.render(
  <AppContainer>
    <App />
  </AppContainer>,
  document.querySelectorAll('.wrapper')[0]
);

if (typeof module.hot.accept === 'function') {
  module.hot.accept(() => {
    ReactDom.render(
      <AppContainer>
        <App />
      </AppContainer>,
      document.querySelectorAll('.wrapper')[0]
    );
  });
}
