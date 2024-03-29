import React from 'react';

import './searchResults.css';

const SearchResults = props => {

  const {
    hits,
    handleThumbsDown,
    handleThumbsUp
  } = props;

  // formatLogoString(_string) {
  //   return 'https://logo.clearbit.com/'+_string.split('http://')[1]
  // }
  //
  // addDefaultSrc(ev){
  //   ev.target.src = 'https://s3-us-west-2.amazonaws.com/gjt-personal/'
  // }

  if (hits.length !== 0) {
    return (
      <div>
        { hits.map((hit,idx) => (
          <div className="searchItem" key={idx}>
            <div className="columns">
              <figure className="column has-text-left">
                <div className="content">
                  <p>
                    <span>
                      <strong>PD ES</strong>: {Math.abs(Math.round(hit.score * 1000) / 1000)}<br/>
                    </span>
                    <span>
                      <strong>PD Manual</strong>: {Math.abs(Math.round(hit.score_manual * 1000) / 1000)}<br/>
                    </span>
                    <span>
                      <strong>PD Manual (S)</strong>: {Math.abs(Math.round(hit.score_manual_scaled * 1000) / 1000)}<br/>
                    </span>
                  </p>
                </div>
              </figure>
              <div className="column is-7 has-text-left">
                <div className="content">
                  <h4>
                    <strong>{hit.title}</strong>
                  </h4>
                </div>
                <div className="content">
                  <div className="columns">
                    <div className="column">
                      <div className="content">
                        <p>
                          <span>
                            <strong>Status</strong>: {hit.status}<br/>
                          </span>
                          <span>
                            <strong>Release Date</strong>: {hit.release_date}<br/>
                          </span>
                          <span>
                            <strong>Genres</strong>: {hit.genres}<br/>
                          </span>
                          <span>
                            <strong>Spoken Languages</strong>: {hit.spoken_languages}<br/>
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="column">
                      <div className="content">
                        <p>
                          <span>
                            <strong>Vote Average</strong>: {hit.vote_average}<br/>
                          </span>
                          <span>
                            <strong>Vote Count</strong>: {hit.vote_count}<br/>
                          </span>
                          <span>
                            <strong>Revenue</strong>: {hit.revenue}<br/>
                          </span>
                          <span>
                            <strong>Budget</strong>: {hit.budget}<br/>
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="column">
                      <div className="content">
                        <p>
                          <span>
                            <strong>Popularity</strong>: {hit.popularity}<br/>
                          </span>
                          <span>
                            <strong>Release Year</strong>: {hit.release_year}<br/>
                          </span>
                          <span>
                            <strong>Spoken Languages Number</strong>: {hit.spoken_languages_number}<br/>
                          </span>
                          <span>
                            <strong>Production Companies Number</strong>: {hit.production_countries_number}<br/>
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="column actionColumn">
                <div class="tile is-ancestor">
                  <div class="tile is-vertical is-parent">
                    <div class="tile is-child">
                      <p class="title">
                        <a onClick={() => handleThumbsUp(hit)}>
                          <span className="icon is-small thumbsUp"><i className="far fa-check-circle fa-2x"></i></span>
                        </a>
                      </p>
                    </div>
                    <div class="tile is-child">
                      <p class="title">
                        <a onClick={() => handleThumbsDown(hit)}>
                          <span className="icon is-small thumbsDown"><i className="far fa-times-circle fa-2x"></i></span>
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  } else {
    return (
      <div>
        No Hits
      </div>
    )
  }

}

export default SearchResults;
