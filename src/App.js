import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  NavLink,
  Route,
  Switch
 } from 'react-router-dom'
import Home from "./components/Home"
import About from "./components/About"
import Upload from "./components/Upload"
import './App.css'

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <h1 className="FaceMe">Welcome to FaceMe to FindMe</h1>
          </header>
          <div className="menu">
            <ul>
              <li> <NavLink replace to="/">Home</NavLink> </li>
              <li> <NavLink replace to="/about">About</NavLink> </li>
              <li> <NavLink replace to="/upload">Upload</NavLink> </li>
            </ul>
          </div>
          <div className="content">
            <Switch>
              <Route exact path="/" component={Home}/>
              <Route path="/about" component={About}/>
              <Route path="/upload" render={ props => <Upload { ...props } />}/>
            </Switch>
          </div>
        </div>
      </Router>
    )
  }
}

export default App
