import React from 'react';
import ReactDOM from 'react-dom';
import App from './';

import renderer from 'react-test-renderer';

// test
console.log = function(){}

describe('App', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
  });

  test('has a valid snapshot', () => {
    const component = renderer.create(<App />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
