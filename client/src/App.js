import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

// import 'bulma/css/bulma.css'
import 'bulmaswatch/lux/bulmaswatch.min.css'

class App extends Component {

  constructor() {
    super()
    this.state = {
      query: '',
      res: '',
    }
  }

  componentDidMount() {
    console.log('mounted');
    console.log(process.env.REACT_APP_SERVER_URL);
  }

  // handleSearchClick = (event) => {
  //   const url = `${process.env.REACT_APP_SERVER_URL}/ping`
  //   let data = {
  //     'query': this.state.query,
  //   };
  //   // this.setState({'isSearchLoading':true})
  //   axios.post(url, data)
  //   .then((res) => {
  //     console.log(res);
  //     this.setState({
  //       'res':res
  //     })
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   })
  // }

  handleSearchClick = (event) => {
    const url = `${process.env.REACT_APP_SERVER_URL}/search/index_count`
    axios.get(url)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Active Learner</h1>
        </header>
        <p className="App-intro">
          Search!
        </p>
        <a onClick={(e) => this.handleSearchClick(e)} className="button is-primary" >Button</a>
      </div>
    );
  }
}

export default App;
