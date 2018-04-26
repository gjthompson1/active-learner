import React from 'react';

import './searchResults.css';

const SearchResults = props => {

  const {
    hits,
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
            <article className="media">
              <figure className="media-left">
                <p className="image is-64x64">
                  <img src="https://bulma.io/images/placeholders/128x128.png"/>
                </p>
              </figure>
              <div className="media-content noOverflow">
                <div className="content">
                  <p>
                    <strong>{hit.title}</strong>
                    <br/>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas non massa sem. Etiam finibus odio quis feugiat facilisis.
                  </p>
                </div>
                <div className="content">
                  <div className="columns">
                    <div className="column">
                      <div className="content is-small">
                        <p>
                          <span>
                            Genres: {hit.genres}<br/>
                          </span>
                          { hit.genres !== null &&
                            <span>
                              Genres: {hit.genres}<br/>
                            </span>
                          }
                        </p>
                      </div>
                    </div>
                    <div className="column">
                      <div className="content is-small">
                        <p>
                          <span>
                            Genres: {hit.genres}<br/>
                          </span>
                          { hit.genres !== null &&
                            <span>
                              Genres: {hit.genres}<br/>
                            </span>
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="media-right">
                <div className="level-left">
                  <a className="level-item">
                    <span className="icon is-small"><i className="fas fa-thumbs-up"></i></span>
                    {/* <span className="icon is-small"><i className="fas fa-thumbs-up fa-2x"></i></span> */}
                  </a>
                  <a className="level-item">
                    <span className="icon is-small"><i className="fas fa-thumbs-down"></i></span>
                    {/* <span className="icon is-small"><i className="fas fa-thumbs-down fa-2x"></i></span> */}
                  </a>
                </div>
              </div>
            </article>
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
