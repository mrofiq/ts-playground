import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Button from 'antd/lib/button';
import { Avatar } from './ImageUpload';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Avatar />
      </div>
    );
  }
}

export default App;
