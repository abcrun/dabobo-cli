import React from 'react';
import { hot } from 'react-hot-loader/root';

class App extends React.PureComponent {
  render(): React.ReactNode {
    return (
      <div>
        Hello, <span>Cousin</span>, Welcome to use the cousin scaffold!
      </div>
    );
  }
}

export default hot(App);
