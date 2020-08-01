import React from 'react'
import { mount, shallow } from 'enzyme'
import { List } from 'immutable'
import { ListGroupItem } from 'reactstrap';
import { MemoryRouter as Router } from 'react-router-dom'

import Spinner from 'components/common/Spinner'
import { DetailData, ListData } from 'store/common/models'
import { REQUEST_STATUS } from 'constants/common'
import { User } from 'store/modules/user/models'
import { Site } from 'store/modules/sites'
import { Sidebar, DEFAULT_VISIBLE_SITES_COUNT } from './index'
import { SystemStatus } from 'store/modules/system/models'

const props = {
  siteList: ListData(),
  onClose: e => e,
  loadSiteList: e => e,
  loadRecentSiteStats: e => e,
  updateSiteDetail: e => e,
  loadUser: e => e,
  user: DetailData({ data: User() }),
  userTitle: 'John Doe',
  systemStatus: SystemStatus(),
}

const siteListDataMock = List([
  Site({ server: '1' }),
  Site({ server: '2' }),
  Site({ server: '3' }),
  Site({ server: '4' }),
  Site({ server: '5' }),
  Site({ server: '6' }),
  Site({ server: '7' }),
])

describe('Sidebar', () => {
  it('renders loading status properly', () => {
    const localProps = { ...props }
    const wrapper = shallow(<Sidebar {...localProps} />)

    expect(wrapper.find(Spinner).length).not.toEqual(0)
  })

  it('renders the user\'s full name in title section', () => {
    const localProps = { ...props }
    const wrapper = mount(<Router><Sidebar {...localProps} /></Router>)

    expect(wrapper.find('h1').text()).toEqual('John Doe')
  })

  it('does not render favorites section if there is no site in favorite state', () => {
    const localProps = { ...props }
    const wrapper = shallow(<Sidebar {...localProps} />)

    expect(wrapper.find('section.Sidebar__favorites').length).toEqual(0)
  })

  it('renders favorites section if there are sites in favorite state', () => {
    const localProps = {
      ...props,
      siteList: ListData({
        data: List([
          Site({ favorite: true }),
        ]),
        state: REQUEST_STATUS.SUCCESS,
      })
    }
    const wrapper = shallow(<Sidebar {...localProps} />)

    expect(wrapper.find('section.Sidebar__favorites').length).toEqual(1)
  })

  it('renders 5 items in maximum in your sites section', () => {
    const localProps = {
      ...props,
      siteList: ListData({
        data: siteListDataMock,
        state: REQUEST_STATUS.SUCCESS,
      })
    }
    const wrapper = mount(<Router><Sidebar {...localProps} /></Router>)
    const siteItems = wrapper.find('section.Sidebar__yoursites').find(ListGroupItem)

    expect(siteItems.length).toEqual(DEFAULT_VISIBLE_SITES_COUNT + 1)
    expect(siteItems.last().text()).toContain('More...')
  })

  it('renders all items when `More...` link clicked', () => {
    const localProps = {
      ...props,
      siteList: ListData({
        data: siteListDataMock,
        state: REQUEST_STATUS.SUCCESS,
      })
    }
    const wrapper = mount(<Router><Sidebar {...localProps} /></Router>)
    wrapper.find('section.Sidebar__yoursites').find(ListGroupItem).last().find('a').simulate('click')
    const siteItems = wrapper.find('section.Sidebar__yoursites').find(ListGroupItem)

    expect(siteItems.length).toEqual(siteListDataMock.size + 1)
    expect(siteItems.last().text()).toContain('Less...')
  })
})
