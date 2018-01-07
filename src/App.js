import React, { Component } from 'react';
import './App.css';

import fetchJsonp from 'fetch-jsonp';
/*
 * A business object with a search function that returns a promise of
 * an array of images from flickr.
 */
class BusinessObject {
  search(string) {
    return fetchJsonp(
        `https://api.flickr.com/services/feeds/photos_public.gne?lang=en-us&format=json&tags=${string}`,
        { jsonpCallback: 'jsoncallback' })
        .then(res => res.json())
        .then(data => data.items);
  }
  cancel(string) {
    // Awaiting cancelable fetch()...
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
