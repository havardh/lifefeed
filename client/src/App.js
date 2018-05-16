import React, { Component } from 'react';
import { Route } from "react-router";
import './App.css';
import 'font-awesome/css/font-awesome.css'
import FontAwesome from "react-fontawesome";

import AddItem from "./Feed/AddItem";
import Feed from "./Feed/Feed";
import AddTags from "./Feed/AddTags";
import Image from "./Feed/Image";
import ImageTags from "./Feed/ImageTags";

function goBack() {
  window.history.back();
}

function isOnRoot() {
  return document.location.pathname === "/";
}

const HeaderBack = () => !isOnRoot() ?
  <div style={{position: "absolute", top: "10px", left: "20px", right: "auto", bottom: "auto", margin: "auto"}}>
    <FontAwesome size="2x" onClick={() => goBack()} name="arrow-left" />
  </div> :
  null;

const Header = () => (
  <div style={{width: "100%", marginTop: "10px", marginBottom: "10px"}}>
    <HeaderBack/>
    <h1 style={{textAlign: "center"}}>lifefeed</h1>
  </div>
);

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <Route exact path="/" component={Feed} />
        <Route exact path="/add" component={AddItem} />
        <Route exact path="/add/tags" component={AddTags} />
        <Route exact path="/image/:id" component={Image} />
        <Route exact path="/image/:id/tags" component={ImageTags} />
      </div>
    );
  }
}

export default App;
