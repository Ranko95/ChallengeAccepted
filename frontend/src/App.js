import React, { Component } from 'react';
import './App.css'
import {
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import MainPage from './pages/MainPage/MainPage'

export class App extends Component {
  render() {
    return (
      <div>
        <MainPage />
        <h1>Hello React</h1>
      </div>
    )
  }
}

export default App;

