import React, { Component } from 'react';
import './App.css';

import fetchJsonp from 'fetch-jsonp';

/** calls onChange when the text is modified, with the value of the text field
 *  calls onSubmit when the search form is submitted.
 */
class SearchForm extends Component {
  render() {
    return (
        <form onSubmit={e => this.props.onSubmit(e)}>
          <input type="search" onChange={(e) => this.props.onChange(e.target.value)} placeholder="Search flicker for images!!"/>
          <div class="buttons">
            <input type="submit" value="Search!"/>
            <input type="button" onClick={(e) => this.props.onCancel()} value="Cancel"/>
          </div>
        </form>
    );
  }
}


class Image extends Component {
  render() {
    return (
        <img
            alt={this.props.alt}
            src={this.props.src}
            onClick={(e) => this.props.onSelect(this.props.src)}
            style={{'--i': this.props.index}}
            className={this.props.className}
        />
    );
  }
}


class ResultsPanel extends Component {
  render() {
    // TODO: for each image in results, show image with zoom control.
    const results = this.props.results.map((result, index) => (
      <Image key={result.media.m} src={result.media.m} onSelect={(e) => this.props.onZoom(result.media.m)} index={index} />
    ));
    return <section className="results">
      {results}
    </section>;
  }
}

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
  constructor(props) {
    super(props);

    // the business object where the backend chatting happens
    this.business = new BusinessObject();

    // The state that the UI cares about
    this.state = {
      // the "mode" of the UI
      loading: false,

      // The currently "selected image" if any
      selectedImage: null,

      // the state in the text field
      text: "",

      // the results to show to the user
      results: []
    };

    this.zoom = null;
    this.results = null;
  }

  render() {
    if (this.state.loading) {
      this.loading = <div class="loading">Loading, please wait</div>;
    }
    else if (this.state.selectedImage) {
      this.zoom = <Image className="zoomed-in" src={this.state.selectedImage} onSelect={e => this.handleUnzoom()}/>;
    }
    else if (this.state.results) {
      this.results = <ResultsPanel onZoom={e => this.handleZoom(e)} results={this.state.results}/>;
    }
    return (
      <div className={this.state.mode}>
        <SearchForm onChange={e => this.setState({...this.state, text: e})}
                    onSubmit={e => this.handleSearch(e, this.state.text)}
                    onCancel={e => this.handleCancel(this.state.text)}
        />
        {this.state.loading ? this.loading : this.state.selectedImage ? this.zoom : this.results}
      </div>
    );
  }

  handleSearch(event, what) {
    event.preventDefault();
    this.setState({...this.state, loading: true});
    // Fake a slow server to highlight the "loading" state
    this.XHR = setTimeout(() => {
      this.business.search(what)
        .then(results => {
          console.log(results);
          this.setState({
            ...this.state,
            loading: false,
            results: results
          });
        });
    }, Math.random() ** 4 * 3000); // mostly short requests, but intermittent "slowness"
  }

  handleCancel() {
    console.log("Canceling search");
    if (this.XHR) {
      clearTimeout(this.XHR);
      this.XHR = null;
    }
    this.setState({
      ...this.state,
      loading: false
    });
  }

  handleZoom(what) {
    console.log("Zooming image number", what);
    this.setState({...this.state, selectedImage:  what});
  }

  handleUnzoom() {
    console.log("Unzooming");
    this.setState({...this.state, selectedImage:  ""});
  }
}

export default App;
