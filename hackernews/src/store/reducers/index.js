
import { combineReducers } from 'redux';
import appReducer from './app';
import dataReducer from './data';

export default combineReducers({
  app: appReducer,
  data: dataReducer
});
