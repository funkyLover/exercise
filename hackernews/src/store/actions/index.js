
import * as types from '../actionTypes';
import {
  PATH_BASE,
  PATH_SEARCH,
  PARAM_SEARCH,
  PARAM_PAGE
} from '../../constant';

export const appStatus = ({ status, err }) => {
  if (status) {
    return {
      type: types.FETCH_BEGIN
    }
  } else {
    return {
      type: types.FETCH_END,
      err: err
    }
  }
}

export const appendList = ({ query, list, page }) => {
  return {
    type: types.APPEND_LIST,
    query,
    list,
    page
  }
}

export const triggerSort = ({ sortKey }) => {
  return {
    type: types.CHANGE_SORT,
    sortKey
  }
}

export const triggerDismiss = ({ id, searchKey }) => {
  return {
    type: types.DISSMISS_ITEM,
    id,
    searchKey
  }
}

export const updateSearch = ({ key }) => {
  return {
    type: types.SET_SEARCH_KEY,
    key
  }
}

export const requestSearch = ({ key }) => {
  return {
    type: types.REQUEST_SEARCH_KEY,
    key
  }
}

export const requestPost = ({ key, reqPage = 0 }) => {
  return (dispatch, getStates) => {
    dispatch(appStatus({ status: true, err: null }));
    const { searchKey } = getStates().app;
    const { page } = getStates().data;
    if (searchKey !== key) {
      dispatch(updateSearch({ key }));
    }
    dispatch(requestSearch({ key }));
    const { list } = getStates().data;
    if (list.length === 0 || page < reqPage) {
      fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${key}&${PARAM_PAGE}${reqPage}`)
      .then(res => res.json(), err => {
        dispatch(appStatus({ status: false, err }));
      }).then(result => {
        dispatch(appStatus({ status: false, err: null }));
        dispatch(appendList({ query: key, list: result.hits, page: result.page }));
      });
    } else {
      dispatch(appStatus({ status: false, err: null }));
    }
  }
}
