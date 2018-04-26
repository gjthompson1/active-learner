import React, { Component } from 'react';
// import logo from './logo.svg';
import logo from './learning.svg';
import './App.css';
import SearchResults from './components/searchResults'
import axios from 'axios';

// import 'bulma/css/bulma.css'
import 'bulmaswatch/lux/bulmaswatch.min.css'

class App extends Component {

  constructor() {
    super()
    this.state = {
      query: 'Lord of the Ring',
      res: [],
    }
  }

  componentDidMount() {
    this.executeSearch();
  }

  handleSearchClick = (event) => {
    this.executeSearch();
  }

  handleKeyPress = (event) => {
    if ( event.key === 'Enter' ) {
      this.executeSearch();
    }
  }

  executeSearch = () => {
    const url = `${process.env.REACT_APP_SERVER_URL}/search/basic`
    let data = {
      'query': this.state.query,
    };
    // this.setState({'isSearchLoading':true})
    axios.post(url, data)
    .then((res) => {
      console.log(res);
      this.setState({
        'res':res.data.results
      })
    })
    .catch((err) => {
      console.log(err);
    })
  }

  handleSearchChange = (event) => {
    const obj = this.state;
    obj[event.target.name] = event.target.value;
    this.setState(obj);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Active Learner</h1>
        </header>
        <div className="section has-text-centered">
          <div className="field has-addons">
            <div className="control">
              <input
                onChange={(e) => this.handleSearchChange(e)}
                onKeyPress={this.handleKeyPress.bind(this)}
                className="input is-primary"
                type="text"
                name="query"
                value={this.state.query}
                placeholder="Search"
              />
            </div>
            <div className="control">
              <a
                onClick={(e) => this.handleSearchClick(e)}
                className="button is-primary"
              >
                Button
              </a>
            </div>
          </div>
          <SearchResults
            hits={this.state.res}
          />
        </div>
      </div>
    );
  }
}

export default App;
