
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { updateSearch, requestPost } from '../../store/actions';

class Search extends Component {
  constructor(props) {
    super(props);

    this.onSearchSubmit = this.props.onSearchSubmit.bind(this);
    this.onSearchChange = this.props.onSearchChange.bind(this);
  }

  componentDidMount () {
    if (this.input) {
      this.input.focus();
    }
    // 模拟第一次请求
    this.onSearchSubmit();
  }

  render () {
    const {
      searchKey,
      children
    } = this.props;

    return (
      <form onSubmit={this.onSearchSubmit}>
        <input
          type="text"
          value={searchKey}
          onChange={this.onSearchChange}
          ref={(node) => { this.input = node; }}
        />
        <button type="submit">{children}</button>
      </form>
    )
  }
}

Search.propTypes = {
  searchKey: PropTypes.string.isRequired,
  onSearchSubmit: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return {
    searchKey: state.app.searchKey
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSearchSubmit: function (e) {
      e && e.preventDefault();
      dispatch(requestPost({ key: this.props.searchKey }));
    },
    onSearchChange: function (e) {
      e.preventDefault();
      dispatch(updateSearch({ key: e.target.value }));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
