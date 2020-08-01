import React from 'react'
import { act } from 'react-dom/test-utils'
import { mount } from 'enzyme'
import { MemoryRouter as Router } from 'react-router-dom'

import { REQUEST_STATUS } from 'constants/common'
import { ListData, DetailData } from 'store/common/models'
import Spinner from 'components/common/Spinner'
import { SiteCreate } from './index'
import SiteCreateForm from '../SiteCreateForm'

import { sites } from 'test/fixtures/sites'
import { pathDetails } from 'test/fixtures/siteContent'
import { storages } from 'test/fixtures/storage'


jest.mock('../SiteCreateForm', () => ({ submitted, renderConfirmationPage }) => <form>
  {submitted && renderConfirmationPage()}
</form>)

const props = {
  history: { push: e => e },
  myStorageList: ListData(),
  createSiteState: REQUEST_STATUS.INITIAL,
  siteList: ListData(),
  rootDetails: DetailData(),
  loadMyStorageList: e => e,
  createSite: e => e,
  createSiteResetState: e => e,
  loadRootDetails: e => e,
  loadRootDetailsReset: e => e,
}

const data = {
  myStorageList: ListData({
    state: REQUEST_STATUS.SUCCESS,
    data: storages,
  }),
  siteList: ListData({
    state: REQUEST_STATUS.SUCCESS,
    data: sites,
  }),
  rootDetails: DetailData({
    state: REQUEST_STATUS.SUCCESS,
    data: pathDetails,
  }),
}

const TestComponent = props => <Router>
  <SiteCreate {...props} />
</Router>

it('renders initial state of loading data', () => {
  const wrapper = mount(<TestComponent {...props} />)

  expect(wrapper.find(Spinner).length).not.toEqual(0)
})

it('renders initial form state', () => {
  const localProps = {
    ...props,
    myStorageList: data.myStorageList,
    createSiteState: REQUEST_STATUS.SUCCESS,
  }
  const wrapper = mount(<TestComponent {...localProps} />)

  expect(wrapper.find(SiteCreateForm).length).not.toEqual(0)
})

it('renders state of server created successfully', () => {
  const localProps = {
    ...props,
    ...data,
    createSiteState: REQUEST_STATUS.SUCCESS,
  }
  const wrapper = mount(<TestComponent {...localProps} />)

  act(() => {
    wrapper.find(SiteCreateForm).prop('onSubmit')({
      name: 'mysite',
      desc: 'My Site',
      storage: storages.get(0).name,
      websiteConfig: 'website',
    })
  })

  expect(wrapper.find(SiteCreateForm).length).not.toEqual(0)
  expect(wrapper.text()).toContain('Successfully created website')
  expect(wrapper.text()).toContain('There is now a folder in your Google Drive named "mysite.imfastio.com".')
  expect(wrapper.text()).toContain('Anything you put into that folder will sync to your website at mysite.imfastio.com.')
})
