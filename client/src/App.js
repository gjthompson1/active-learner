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
      thumbUps: [],
      thumbDowns: [],
      modelParameters: {},
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

  handleThumbsDown = (hit) => {
    const thumbDowns = this.state.thumbDowns;
    thumbDowns.push(hit);
    this.setState({
      thumbDowns: thumbDowns
    })
    console.log(this.state);
    this.trainModel();
  }

  handleThumbsUp = (hit) => {
    const thumbUps = this.state.thumbUps;
    thumbUps.push(hit);
    this.setState({
      thumbUps: thumbUps
    })
    this.trainModel();
  }

  trainModel = () => {
    const url = `${process.env.REACT_APP_SERVER_URL}/search/train`
    let data = {
      'thumbUps': this.state.thumbUps,
      'thumbDowns': this.state.thumbDowns,
    };
    axios.post(url, data)
    .then((res) => {
      console.log(res);
      this.setState({
        'modelParameters':res.data
      })
    })
    .catch((err) => {
      console.log(err);
    })
  }

  render() {
    return (
      <div className="App">
        <section class="hero is-primary has-text-centered">
          <div class="hero-body">
            <div class="container">
              <img src={logo} className="App-logo" alt="logo" />
              <h1 class="title">
                Active Learner
              </h1>
              <div className="field has-addons is-grouped is-grouped-centered">
                <div className="control searchBox">
                  <input
                    onChange={(e) => this.handleSearchChange(e)}
                    onKeyPress={this.handleKeyPress.bind(this)}
                    className="input is-info"
                    type="text"
                    name="query"
                    value={this.state.query}
                    placeholder="Search"
                  />
                </div>
                <div className="control">
                  <a
                    onClick={(e) => this.handleSearchClick(e)}
                    className="button is-info"
                  >
                    Search
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          {JSON.stringify(this.state.modelParameters)}
        </section>

        <div className="section has-text-centered">
          <SearchResults
            hits={this.state.res}
            handleThumbsUp={this.handleThumbsUp}
            handleThumbsDown={this.handleThumbsDown}
          />
        </div>
      </div>
    );
  }
}

export default App;
