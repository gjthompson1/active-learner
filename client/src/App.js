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
      logitParams: {},
    }
  }

  componentDidMount() {
    this.executeSearch('basic');
  }

  handleSearchClick = (event) => {
    this.executeSearch('basic');
  }

  handleWorstClick = (event) => {
    this.executeSearch('worst');
  }

  handleBestClick = (event) => {
    this.executeSearch('best');
  }

  handleKeyPress = (event) => {
    if ( event.key === 'Enter' ) {
      this.executeSearch('basic');
    }
  }

  executeSearch = (searchType) => {
    const url = `${process.env.REACT_APP_SERVER_URL}/search/${searchType}`
    let data = {
      'query': this.state.query,
      'logit_params': this.state.logitParams,
      'thumb_ups': this.state.thumbUps,
      'thumb_downs': this.state.thumbDowns,
    };
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
    // if (!this.isEmpty(this.state.logitParams)) {
    this.executeSearch('basic');
    // }
  }

  handleThumbsUp = (hit) => {
    const thumbUps = this.state.thumbUps;
    thumbUps.push(hit);
    this.setState({
      thumbUps: thumbUps
    })
    this.trainModel();
    // if (!this.isEmpty(this.state.logitParams)) {
    this.executeSearch('basic');
    // }
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
        'logitParams':res.data
      })
    })
    .catch((err) => {
      console.log(err);
    })
  }


  isEmpty = (obj) => {

      // null and undefined are "empty"
      if (obj == null) return true;

      // Assume if it has a length property with a non-zero value
      // that that property is correct.
      if (obj.length > 0)    return false;
      if (obj.length === 0)  return true;

      // If it isn't an object at this point
      // it is empty, but it can't be anything *but* empty
      // Is it empty?  Depends on your application.
      if (typeof obj !== "object") return true;

      // Otherwise, does it have any properties of its own?
      // Note that this doesn't handle
      // toString and valueOf enumeration bugs in IE < 9
      for (var key in obj) {
          if (hasOwnProperty.call(obj, key)) return false;
      }

      return true;
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
                { this.isEmpty(this.state.logitParams) != true &&
                  <div className="control">
                    <a
                      onClick={(e) => this.handleWorstClick(e)}
                      className="button is-danger"
                    >
                      Worst
                    </a>
                  </div>
                }
                { this.isEmpty(this.state.logitParams) != true &&
                  <div className="control">
                    <a
                      onClick={(e) => this.handleBestClick(e)}
                      className="button is-success"
                    >
                      Best
                    </a>
                  </div>
                }
              </div>
            </div>
          </div>
        </section>

        <section>
          {JSON.stringify(this.state.thumbUps.length)}<br/>
          {JSON.stringify(this.state.thumbDowns.length)}<br/>
          {JSON.stringify(this.state.logitParams)}<br/>
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
