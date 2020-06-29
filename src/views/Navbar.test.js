import React from 'react'
import { shallow } from 'enzyme'
import * as oktaLib from '@okta/okta-react'
import Navbar from './Navbar'
import RepositoryStats from '../pages/RepositoryStats'
import PullRequestStats from '../pages/PullRequestStats'
import QuartelyTrends from '../pages/QuartelyTrends'
import Drawer from '@material-ui/core/Drawer'
import ExpandLess from "@material-ui/icons/ExpandLess";
import {PageProvider} from '../contexts/PageContext'

jest.mock('@okta/okta-react')

const subMenuItem = [
  {
    name: 'Repository stats', 
    uri: '/repository-stats', 
    component: RepositoryStats
  },
  {
    name: 'Pull request',
    uri: '/pull-request',
    children: [
      {
        name: 'Pull request stats', 
        uri: '/pull-request-stats',
        component: PullRequestStats
      },
      {
        name: 'Quartely Trends', 
        uri: '/quartely-trends', 
        component: QuartelyTrends
      }
    ]
  }
];

describe('Navbar component', () => {
  it('renders without crashing', () => {
    oktaLib.useOktaAuth.mockImplementation(() => {
      return {
        authState: {},
        authService: {},
      }
    })
    const component = shallow(
        <PageProvider>
        <Navbar subMenuItem={subMenuItem} userInfor={{name: 'Test'}}/>
        </PageProvider>
    )

    expect(component.length).toBe(1)
  })

  it('renders with drawer', () => {
    oktaLib.useOktaAuth.mockImplementation(() => {
      return {
        authState: {},
        authService: {},
      }
    })
    const component = shallow(
      <PageProvider>
      <Navbar subMenuItem={subMenuItem} userInfor={{name: 'Test'}}/>
      </PageProvider>
  )

    expect(component.contains(<Drawer/>)).toBe(false)
  })

  it('renders without Expend Button', () => {
    const component = shallow(
      <PageProvider>
      <Navbar subMenuItem={subMenuItem} userInfor={{name: 'Test'}}/>
      </PageProvider>
  )

    expect(component.contains(<ExpandLess/>)).toBe(false)
  })
})
