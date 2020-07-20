import React from 'react'
import { shallow, mount } from 'enzyme'
import * as oktaLib from '@okta/okta-react'
import Navbar from '../Navbar'
import RepositoryStats from '../../pages/RepositoryStats'
import PullRequestStats from '../../pages/PullRequestStats'
import QuartelyTrends from '../../pages/QuartelyTrends'
import Drawer from '@material-ui/core/Drawer'
import ExpandLess from "@material-ui/icons/ExpandLess";
import {PageProvider} from '../../contexts/PageContext'
import { BrowserRouter } from 'react-router-dom'

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
  beforeEach(() => {
    oktaLib.useOktaAuth.mockImplementation(() => {
      return {
        authState: {},
        authService: {},
      }
    })
  });
  it('renders without crashing', () => {
    const component = shallow(
        <PageProvider>
        <Navbar subMenuItems={subMenuItem} userInfor={{name: 'Test'}}/>
        </PageProvider>
    )

    expect(component.length).toBe(1)
  })

  it('renders with drawer', () => {
    const component = shallow(
      <PageProvider>
      <Navbar subMenuItems={subMenuItem} userInfor={{name: 'Test'}}/>
      </PageProvider>
  )

    expect(component.contains(<Drawer/>)).toBe(false)
  })

  it('renders without Expend Button', () => {
    const component = shallow(
      <PageProvider>
      <Navbar subMenuItems={subMenuItem} userInfor={{name: 'Test'}}/>
      </PageProvider>
  )

    expect(component.contains(<ExpandLess/>)).toBe(false)
  })

  it('renders correct Component', () => {
    const component = mount(
      <BrowserRouter>
        <PageProvider>
            <Navbar subMenuItems={subMenuItem} userInfor={{name: 'Test'}}/>
        </PageProvider>
      </BrowserRouter>
    )

    expect(component.contains('Repository stats')).toBe(true)
    expect(component.contains('Pull request')).toBe(true)
    expect(component.contains('Quartely Trends')).toBe(true)
  })
})
