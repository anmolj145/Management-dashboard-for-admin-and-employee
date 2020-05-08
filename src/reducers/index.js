import { combineReducers } from 'redux';
import mainReducer from './mainReducers';

export default combineReducers({
    app: mainReducer
});