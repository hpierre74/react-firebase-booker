import React, { Component } from 'react';
import './App.css';
import Booker from './Booker.jsx';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className='header'></div>
            <Booker />
      </div>
    );
  }
}

export default App;
