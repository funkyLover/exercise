
import * as types from '../actionTypes';
import { DEFAULT_QUERY } from '../../constant';
// import { SORTS } from '../../utils'

const dataReducer = (state = {
  page: 0,
  list: [],
  sortKey: 'NONE',
  isSortReverse: false,
  cache: {
    [DEFAULT_QUERY]: {
      list: [],
      page: 0
    }
  }
}, action) => {
  switch (action.type) {
    case types.APPEND_LIST: {
      const prevCache = state.cache[action.query];
      const list = prevCache ? prevCache.list : [];
      const appended = action.list || [];
      const appendedList = [...list, ...appended];
      const page = action.page || 0;
      return {
        ...state,
        page,
        list: appendedList,
        cache: {
          ...state.cache,
          [action.query]: {
            list: appendedList,
            page: page
          }
        }
      };
    }
    case types.CHANGE_SORT: {
      const sortKey = action.sortKey || 'NONE';
      const isSortReverse = sortKey === state.sortKey && !state.isSortReverse;
      return {
        ...state,
        sortKey,
        isSortReverse
      };
    }
    case types.REQUEST_SEARCH_KEY: {
      const prevCache = state.cache[action.key];
      const list = prevCache
                    ? (prevCache.list || [])
                    : [];
      const page = prevCache
                    ? (prevCache.page || 0)
                    : 0;
      const cache = prevCache
                      ? state.cache
                      : { ...state.cache, [action.key]: { list, page } };
      return {
        ...state,
        cache,
        list,
        page
      };
    }
    case types.DISSMISS_ITEM: {
      const id = action.id;
      const searchKey = action.searchKey;
      const list = state.list.filter(v => v.objectID !== id);
      const prevCache = state.cache[searchKey];
      const cache = { ...prevCache, list };
      return {
        ...state,
        cache: {
          ...state.cache,
          [searchKey]: cache
        },
        list
      }
    }
    default:
      return state;
  }
}

export default dataReducer;
