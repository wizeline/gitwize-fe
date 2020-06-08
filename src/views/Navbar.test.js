import React from 'react'
import { shallow } from 'enzyme'
import * as oktaLib from '@okta/okta-react'
import Navbar from './Navbar'
import RepositoryStats from '../pages/RepositoryStats'
import PullRequestStats from '../pages/PullRequestStats'
import ContributorStatsPage from '../pages/ContributorStatsPage'
import Drawer from '@material-ui/core/Drawer'
import ExpandLess from "@material-ui/icons/ExpandLess";

jest.mock('@okta/okta-react')

const subMenuItem = [
  {name: 'Repository stats', uri: '/repository-stats', component: RepositoryStats},
  {name: 'Pull request stats', uri: '/pull-request-stats', component: PullRequestStats}, 
  {name: 'Contributor stats', uri: '/contributor-stats', component: ContributorStatsPage},
  {name: 'Inactivity', uri: '/inactivity'},
  {name: 'Code churn/frequency', uri: '/code-churn-frequency'},
  {name: 'Commit activity trend', uri: '/commit-activity-trend'},
  {name: 'Velocity', uri: '/velocity'}
];

describe('Navbar component', () => {
  it('renders without crashing', () => {
    oktaLib.useOktaAuth.mockImplementation(() => {
      return {
        authState: {},
        authService: {},
      }
    })
    const component = shallow(<Navbar subMenuItem={subMenuItem} userInfor={{name: 'Test'}}/>)

    expect(component.length).toBe(1)
  })

  it('renders with drawer', () => {
    oktaLib.useOktaAuth.mockImplementation(() => {
      return {
        authState: {},
        authService: {},
      }
    })
    const component = shallow(<Navbar subMenuItem={subMenuItem} userInfor={{name: 'Test'}}/>)

    expect(component.contains(<Drawer/>)).toBe(false)
  })

  it('renders without Expend Button', () => {
    const component = shallow(<Navbar subMenuItem={subMenuItem} userInfor={{name: 'Test'}}/>)

    expect(component.contains(<ExpandLess/>)).toBe(false)
  })
})
