import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter } from 'react-router'
import { List, Map } from 'immutable'
import {
  Breadcrumb, BreadcrumbItem,
  ListGroup, ListGroupItem,
} from 'reactstrap'
import { parseDate } from 'utils/format'

import { REQUEST_STATUS } from 'constants/common'
import { sites } from 'test/fixtures/sites'
import { storages, storageDetail } from 'test/fixtures/storage'
import { folderRecord, fileRecord } from 'test/fixtures/siteContent'
import { ListData, DetailData } from 'store/common/models'
import { prepareRenderContainer } from 'utils/testTools'
import Spinner from 'components/common/Spinner'
import { SiteBrowse } from './index'
import EmptyList from './EmptyList'


jest.mock('./EmptyList', () => () => <div />)

const server = 'test1.imfast.io'

const props = {
  location: { pathname: `/sites/${server}/browse`},
  match: { params: { server } },
  siteDetail: DetailData({
    state: REQUEST_STATUS.SUCCESS,
    data: sites.get(0).set('server', server),
  }),
  rootDetails: DetailData(),
  currentPath: '/',
  content: ListData(),
  storageList: ListData({
    state: REQUEST_STATUS.SUCCESS,
    data: storages,
  }),
  storageDetail: DetailData({
    state: REQUEST_STATUS.SUCCESS,
    data: storageDetail,
  }),
  loadRootDetails: e => e,
  loadFolderContent: e => e,
  resetFolderContent: e => e,
  loadStorageList: e => e,
  flushCache: e => e,
  precache: e => e,
  manualSync: e => e,
}

it('renders initial loading state with api calls to load content', () => {
  const localProps = {
    ...props,
    loadFolderContent: jest.fn(),
  }
  const wrapper = mount(<MemoryRouter>
    <SiteBrowse {...localProps} />
  </MemoryRouter>)

  expect(wrapper.find(Spinner).length).not.toEqual(0)
  expect(wrapper.find(Breadcrumb).length).toEqual(1)
  expect(localProps.loadFolderContent).toHaveBeenCalled()
})

it('renders failed state with api calls to load content', () => {
  const localProps = {
    ...props,
    content: ListData({
      state: REQUEST_STATUS.FAIL
    }),
    loadFolderContent: jest.fn(),
  }
  const wrapper = mount(<MemoryRouter>
    <SiteBrowse {...localProps} />
  </MemoryRouter>)

  expect(wrapper.find(Spinner).length).not.toEqual(0)
  expect(localProps.loadFolderContent).toHaveBeenCalled()
})

it('renders loaded state', () => {
  const localProps = {
    ...props,
    content: ListData({
      state: REQUEST_STATUS.SUCCESS,
      data: List([
        folderRecord,
        fileRecord,
      ]),
      lastRequestPayload: Map({
        server: props.match.params.server,
        path: '/',
      }),
    }),
    loadFolderContent: jest.fn(),
  }

  const wrapper = mount(<MemoryRouter>
    <SiteBrowse {...localProps} />
  </MemoryRouter>, {
    attachTo: prepareRenderContainer()
  })

  expect(localProps.loadFolderContent).not.toHaveBeenCalled()

  const listWrapper = wrapper.find(ListGroup)
  expect(listWrapper.length).toEqual(1)
  expect(listWrapper.find(ListGroupItem).length).toEqual(localProps.content.data.size)
  expect(listWrapper.find(ListGroupItem).at(0).text()).toContain(localProps.content.data.get(0).name)
  expect(listWrapper.find(ListGroupItem).at(1).text()).toContain(localProps.content.data.get(1).name)
  expect(listWrapper.find(ListGroupItem).at(0).text()).toContain(
    `Synced: ${parseDate(localProps.content.data.get(0).cached).format('M/D/YY, h:mma')}`
  )
  expect(listWrapper.find(ListGroupItem).at(1).text()).toContain(
    `Modified: ${parseDate(localProps.content.data.get(1).modified).format('M/D/YY, h:mma')}`
  )
})

it('reloads folder content when path changes', () => {
  const TestComponent = props => <MemoryRouter>
    <SiteBrowse {...props} />
  </MemoryRouter>

  const localProps = {
    ...props,
    currentPath: '/',
    location: { pathname: `/sites/${server}/browse`},
    content: ListData({
      state: REQUEST_STATUS.SUCCESS,
      data: List(),
      lastRequestPayload: Map({
        server,
        path: '/',
      }),
    }),
    loadFolderContent: jest.fn(),
  }
  const wrapper = mount(<TestComponent {...localProps} />)

  expect(localProps.loadFolderContent).not.toHaveBeenCalled()

  // Path change
  localProps.loadFolderContent.mockReset()
  wrapper.setProps({
    ...localProps,
    location: { pathname: `/sites/${server}/browse/src`},
  })
  expect(localProps.loadFolderContent).toHaveBeenCalledWith({
    server,
    path: '/src'
  })
})

it('shows message for empty content', () => {
  const localProps = {
    ...props,
    content: ListData({
      state: REQUEST_STATUS.SUCCESS,
      data: List(),
    }),
    loadFolderContent: jest.fn(),
  }

  const wrapper = mount(<MemoryRouter>
    <SiteBrowse {...localProps} />
  </MemoryRouter>, {
    attachTo: prepareRenderContainer()
  })

  expect(wrapper.find(EmptyList).length).toEqual(1)
})

it('breadcrumb shows correct path', () => {
  const localProps = {
    ...props,
    location: { pathname: `/sites/${server}/browse/folder1/folder2`},
  }
  const wrapper = mount(<MemoryRouter>
    <SiteBrowse {...localProps} />
  </MemoryRouter>)

  expect(wrapper.find(BreadcrumbItem).length).toEqual(3)
  expect(wrapper.find(BreadcrumbItem).at(1).text()).toContain('folder1')
  expect(wrapper.find(BreadcrumbItem).at(2).text()).toContain('folder2')
})
