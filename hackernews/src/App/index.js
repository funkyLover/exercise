
import React, { Component } from 'react';
import { connect } from 'react-redux';
// import fetch from 'isomorphic-fetch'
import PropTypes from 'prop-types';

import { requestPost } from '../store/actions';
import './App.css';
import Button from '../comps/Button';
import Search from '../comps/Search';
import Table from '../comps/Table';
import Loading from '../comps/Loading';

const withLoading = (Component) => ({ isLoading, ...rest }) =>
  isLoading
    ? <Loading />
    : <Component { ...rest } />

const ButtonWithLoading = withLoading(Button);

class App extends Component {
  constructor(props) {
    super(props);

    this.fetchMorePost = this.props.fetchMorePost.bind(this);
  }

  render() {
    const helloWorld = 'Welcome to the Road to learn React & Redux';
    const ahui = { name: 'ahui' };
    const {
      error,
      isLoading,
      searchKey,
      page
    } = this.props;
    return (
      <div className="page">
        <div className="interactions">
          <h2>{ `${ helloWorld }, ${ ahui.name } !`}</h2>
          <Search>Search</Search>
        </div>
        {
          error
          ? <div className="interactions">
            <p>Something went wrong.</p>
          </div>
          : <Table/>
        }
        <div className="interactions">
          <ButtonWithLoading
            isLoading={isLoading}
            onClick={() => this.fetchMorePost({ key: searchKey, page: page + 1 })}>
            More
          </ButtonWithLoading>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  error: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  searchKey: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
  fetchMorePost: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  err: state.app.err,
  isLoading: state.app.loading,
  searchKey: state.app.searchKey,
  page: state.data.page
});

const mapDispatchToProps = (dispatch) => {
  return {
    fetchMorePost: function ({ key, page }) {
      dispatch(requestPost({ key, reqPage: page }));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
