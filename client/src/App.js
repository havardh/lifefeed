import React, { Component } from 'react';
import { Route } from "react-router";
import logo from './logo.svg';
import './App.css';

import AddItem from "./Feed/AddItem";
import Feed from "./Feed/Feed";
import Tags from "./Feed/Tags";

const Header = () => (<h1>lifefeed</h1>);

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <Route exact path="/" component={Feed} />
        <Route exact path="/add" component={AddItem} />
        <Route exact path="/tags" component={Tags} />
      </div>
    );
  }
}

export default App;
