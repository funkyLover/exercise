
import React from 'react';
import ReactDom from 'react-dom';
import renderer from 'react-test-renderer';
import Table from './';

import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() });

describe('Table', () => {
  const props = {
    list: [
      { title: '1', author: '1', num_comments: 1, points: 2, objectID: 'x'},
      { title: '1', author: '1', num_comments: 1, points: 2, objectID: 'y'},
      { title: '1', author: '1', num_comments: 1, points: 2, objectID: 'z'} 
    ],
    onDismiss: function(){}
  };

  it('shows two items in list', () => {
    const element = shallow(
      <Table { ...props } />
    );

    expect(element.find('.table-row').length).toBe(3);
  });
})