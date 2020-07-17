import React from 'react';
import ReactDom from 'react-dom';
import './index.css';

class App extends React.PureComponent {
  render() {
    return (
      <div>
        Hello, <span>Cousin</span>, Welcome to use the cousin scaffold!
      </div>
    );
  }
}

ReactDom.render(<App />, document.querySelectorAll('.wrapper')[0]);
