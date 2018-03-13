import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './App.css'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header classNAme="App-header">
          <h1 className="FaceMe">Welcome to FaceMe to FindMe</h1>
        </header>
        <p className="App-intro">
          FaceMe is a facial recognition app to help detect missing and most wanted persons
        </p>
        <div className="menu">
          <ul>
            <li> <Link to="/">Home</Link> </li>
            <li> <Link to="/about">About</Link> </li>
            <li> <Link to="/match">Match</Link> </li>
          </ul>
        </div>
      </div>
    )
  }
}

export default App
