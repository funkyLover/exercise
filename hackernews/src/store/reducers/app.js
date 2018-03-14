
import * as types from '../actionTypes';
import { DEFAULT_QUERY } from '../../constant';

const appReducer = (state = { loading: true, err: null, searchKey: DEFAULT_QUERY }, action) => {
  switch (action.type) {
    case types.FETCH_BEGIN:
      return { ...state, loading: true, err: null };
    case types.FETCH_END:
      return { ...state, loading: false, err: action.err };
    case types.SET_SEARCH_KEY:
      return { ...state, searchKey: action.key };
    default:
      return state
  }
}

export default appReducer;
