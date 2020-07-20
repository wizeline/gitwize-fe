import React from 'react'
import { mount } from 'enzyme'
import { act } from '@testing-library/react'
import WeeklyImpact from '../WeeklyImpact'
import { PageProvider } from '../../contexts/PageContext'
import * as oktaLib from '@okta/okta-react'

jest.mock('@okta/okta-react')
jest.mock('../../apis', () => {
  const mockResponse = jest.requireActual('../../mockData/WeeklyImpactData.json')
  return {
    ApiClient: jest.fn().mockImplementation(() => ({
      weeklyImpact: {
        getWeeklyImpactStats: jest.fn().mockReturnValue(Promise.resolve(mockResponse))
      },
      setAccessToken: jest.fn()
    }))
  }
})

describe('Weekly Impact', () => {
  beforeEach(() => {
    oktaLib.useOktaAuth.mockImplementation(() => {
      return {
        authState: {},
        authService: {},
      }
    })
  });
  it('render without crashing component', async () => {
    const wrapper = mount(
      <PageProvider>
        <WeeklyImpact match={{ params: { id: 1 }, isExact: true, path: "", url: "" }} />
      </PageProvider>
    )
    await act(async () => {
      await Promise.resolve(wrapper);
      wrapper.update();
      expect(wrapper.length).toBe(1)
    });
  })
})
