import React, { Component } from 'react';
// import logo from './logo.svg';
import logo from './learning.svg';
import './App.css';
import SearchResults from './components/searchResults'
import axios from 'axios';
import _ from 'lodash';

// import 'bulma/css/bulma.css'
import 'bulmaswatch/lux/bulmaswatch.min.css'

class App extends Component {

  constructor() {
    super()
    this.state = {
      query: 'Dunkirk',
      res: [],
      thumbUps: [],
      thumbDowns: [],
      logitParams: {},
      logitParamsClean: [],
      tabActive:1,
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
    // this.executeSearch('basic');
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
    // this.executeSearch('basic');
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
      let logitParamsClean = []
      for (let val in res.data['coef']){
        logitParamsClean.push({
          name: val,
          val: res.data['coef'][val]
        })
      }
      this.setState({
        logitParamsClean: logitParamsClean
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

  handleTabChange = (number) => {
    this.setState({ tabActive: number})
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

        <div className="section has-text-centered">
          <div className="columns">
            <div className="column">
              <div class="tabs">
                <ul>
                  <li className={this.state.tabActive === 1 ? 'is-active': ''}><a onClick={() => this.handleTabChange(1)}>Good</a></li>
                  <li className={this.state.tabActive === 2 ? 'is-active': ''}><a onClick={() => this.handleTabChange(2)}>Bad</a></li>
                  <li className={this.state.tabActive === 3 ? 'is-active': ''}><a onClick={() => this.handleTabChange(3)}>Params</a></li>
                </ul>
              </div>
              { this.state.tabActive === 1 &&
                <div>
                  {this.state.thumbUps.map((row,idx) => (
                    <div>
                      {row.title}
                      <hr/>
                    </div>
                  ))}
                </div>
              }
              { this.state.tabActive === 2 &&
                <div>
                  {this.state.thumbDowns.map((row,idx) => (
                    <div>
                      {row.title}
                      <hr/>
                    </div>
                  ))}
                </div>
              }
              { this.state.tabActive === 3 &&
                <div>
                  {this.state.logitParamsClean.map((row, idx) => (
                    <div className={row['val'] >= 0 ? 'goodCoef' : 'badCoef'}>
                      {row['name']}<br/>
                      {row['val']}
                      <hr/>
                    </div>
                  ))}
                </div>
              }
            </div>
            <div className="column is-10">
              <SearchResults
                hits={this.state.res}
                handleThumbsUp={this.handleThumbsUp}
                handleThumbsDown={this.handleThumbsDown}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
