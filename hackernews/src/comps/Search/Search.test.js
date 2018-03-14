
import React from 'react';
import ReactDom from 'react-dom';
import renderer from 'react-test-renderer';
import Search from './';

describe('Search', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDom.render(<Search>Search</Search>, div);
  });

  test('has a valid snapshot', () => {
    const component = renderer.create(
      <Search>Search</Search>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
