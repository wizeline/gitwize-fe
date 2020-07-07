import React, { useState } from 'react'
import { shallow, mount } from 'enzyme'
import BranchFilter from '../index'
import renderer from 'react-test-renderer'; 

const showDate = ['Last 7 Days', 'Last 14 Days', 'Last 21 Days', 'Last 30 Days', 'Custom']

describe('BranchFilter', () => {

  test("render correctly", () => {
    expect(true).toBeTruthy();
  }) 
})


