
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '../Button';
import PropTypes from 'prop-types';
import { SORTS } from '../../utils';
import Sort from '../Sort';
import { triggerDismiss } from '../../store/actions';

const largeColumn = { width: '40%' };
const midColumn = { width: '30%' };
const smallColumn = { width: '10%' };

class Table extends Component {

  constructor (props) {
    super(props);

    this.onDismiss = this.props.onDismiss.bind(this);
  }

  render () {
    const {
      list,
      sortKey,
      isSortReverse,
    } = this.props;

    const sortedList = SORTS[sortKey](list);
    const reverseSortedList = isSortReverse ? sortedList.reverse() : sortedList;

    return (
      <div className="table">
        <div className="table-header">
          <span style={{ width: '40%' }}>
            <Sort sortKey={"TITLE"}> Title</Sort>
          </span>
          <span style={{ width: '30%' }}>
            <Sort sortKey={"AUTHOR"}>Author</Sort>
          </span>
          <span style={{ width: '10%' }}>
            <Sort sortKey={"COMMENTS"}>Comments</Sort>
          </span>
          <span style={{ width: '10%' }}>
            <Sort sortKey={"POINTS"}>Points</Sort>
          </span>
          <span style={{ width: '10%' }}>Archive</span>
        </div>
        {reverseSortedList.map(item =>
          <div key={ item.objectID } className="table-row">
            <span style={largeColumn}>
              <a href={item.url}>{ item.title }</a>
            </span>
            <span style={midColumn}>{ item.author }</span>
            <span style={smallColumn}>{ item.num_comments }</span>
            <span style={smallColumn}>{ item.points }</span>
            <span style={smallColumn}>
              <Button
                className="button-inline"
                onClick={() => this.onDismiss({ id: item.objectID })}
              >
                Dismiss
              </Button>
            </span>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    list: state.data.list,
    sortKey: state.data.sortKey,
    isSortReverse: state.data.isSortReverse,
    searchKey: state.app.searchKey
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onDismiss: function ({ id }) {
      const { searchKey } = this.props;
      dispatch(triggerDismiss({ id, searchKey }));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Table);

Table.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number
    })
  ).isRequired,
  sortKey: PropTypes.string.isRequired,
  onDismiss: PropTypes.func.isRequired,
  isSortReverse: PropTypes.bool.isRequired
}
