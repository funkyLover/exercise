
import React from 'react';
import { connect } from 'react-redux';
import Button from '../Button';
import className from 'classname';
import { triggerSort } from '../../store/actions';
import PropTypes from 'prop-types';

const Sort = ({
  sortKey,
  onSort,
  children,
  activeSortKey
}) => {
  const sortClass = className(
    'button-inline',
    { 'button-active': sortKey === activeSortKey }
  );

  return (
    <Button
      onClick={() => onSort(sortKey)}
      className={sortClass}
    >
      {children}
    </Button>
  )
}

Sort.propTypes = {
  activeSortKey: PropTypes.string.isRequired,
  onSort: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return {
    activeSortKey: state.data.sortKey
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSort: function (key) {
      dispatch(triggerSort({ sortKey: key }))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sort);
