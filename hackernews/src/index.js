
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import App from './App';
import store from './store';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();

if (module.hot) {
  module.hot.accept();
}


var p1 = new Promise(resolve => {
  console.log(1)
  resolve(2)
})
var p2 = new Promise(resolve => {
  console.log(3)
  resolve(p1)
})
p1.then(re => {
  console.log(re)
})
p2.then(re => {
  console.log(re)
})
Promise.resolve(p1).then(re => {
  console.log(re)
})

