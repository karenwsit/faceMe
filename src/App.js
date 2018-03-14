import React, { Component } from 'react'
import {
  HashRouter,
  Route,
  NavLink,
  Switch
 } from 'react-router-dom'
import Home from "./Home"
import About from "./About"
import Upload from "./Upload"
import './App.css'

class App extends Component {
  render() {
    return (
      <HashRouter>
        <div className="App">
          <header className="App-header">
            <h1 className="FaceMe">Welcome to FaceMe to FindMe</h1>
          </header>
          <div className="menu">
            <ul>
              <li> <NavLink to="/">Home</NavLink> </li>
              <li> <NavLink to="/about">About</NavLink> </li>
              <li> <NavLink to="/upload">Upload</NavLink> </li>
            </ul>
          </div>
          <div className="content">
            <Switch>
              <Route exact path="/" component={Home}/>
              <Route path="/about" component={About}/>
              <Route path="/upload" component={Upload}/>
            </Switch>
          </div>
        </div>
      </HashRouter>
    )
  }
}

export default App
