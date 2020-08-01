import React from 'react'
import { mount } from 'enzyme'
import { List, Map } from 'immutable'
import { Col } from 'reactstrap'

import { REQUEST_STATUS } from 'constants/common'
import { DetailData, ListData } from 'store/common/models'
import { Storage } from 'store/modules/storage'
import Spinner from 'components/common/Spinner'
import { AccountStorage } from './index'


const props = {
  user: DetailData(),
  storageList: ListData(),
  myStorageList: ListData(),
  storageDetailMap: Map(),
  unlinkStorageState: REQUEST_STATUS.INITIAL,
  loadStorageList: e => e,
  loadMyStorageList: e => e,
  loadStorageDetailToMap: e => e,
  unlinkStorage: e => e,
}

jest.mock('react-router-dom', () => ({
  Link: () => <a />
}))

jest.mock('./reconnectStorageModal', () => () => <div />)

it('renders loading state', () => {
  const localProps = {
    ...props,
    loadStorageList: jest.fn(),
    loadMyStorageList: jest.fn(),
  }
  const wrapper = mount(<AccountStorage {...localProps} />)

  expect(wrapper.find(Spinner).length).not.toEqual(0)
  expect(localProps.loadStorageList).toHaveBeenCalled()
  expect(localProps.loadMyStorageList).toHaveBeenCalled()
})

it('renders loaded state', () => {
  const localProps = {
    ...props,
    storageList: ListData({
      state: REQUEST_STATUS.SUCCESS,
      data: List([
        Storage({
          "id": "1",
          "name": "googledrive",
          "display": "Google Drive",
          "enabled": true,
          "protected": false,
          "url": "https://drive.google.com/"
        }),
        Storage({
          "id": "2",
          "name": "dropbox",
          "display": "Dropbox",
          "enabled": true,
          "protected": false,
          "url": "https://www.dropbox.com/"
        }),
        Storage({
          "id": "3",
          "name": "onedrive",
          "display": "Microsoft OneDrive",
          "enabled": true,
          "protected": false,
          "url": "https://onedrive.live.com/"
        }),
      ])
    }),
    myStorageList: ListData({
      state: REQUEST_STATUS.SUCCESS,
      data: List([
        Storage({
          "id": "1",
          "name": "googledrive",
          "display": "Google Drive",
          "enabled": true,
          "protected": false,
          "url": "https://drive.google.com/"
        }),
      ])
    })
  }
  const wrapper = mount(<AccountStorage {...localProps} />)

  const linkedStorageWrappers = wrapper.find('.linkedStorages').children('div')
  expect(linkedStorageWrappers.length).toEqual(localProps.myStorageList.data.size)

  const unlinkedStorageWrappers = wrapper.find('.unlinkedStorages').find(Col)
  expect(unlinkedStorageWrappers.length).toEqual(localProps.storageList.data.size - localProps.myStorageList.data.size)
})
