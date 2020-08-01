import React from 'react'
import { mount } from 'enzyme'

import { REQUEST_STATUS } from 'constants/common'
import { oauthLink } from 'test/fixtures/oauth'
import { DetailData } from 'store/common/models'
import Spinner from 'components/common/Spinner'
import { ReconnectStorageModal } from './reconnectStorageModal'


const props = {
  open: false,
  oauthLink: DetailData(),
  storage: 'googledrive',
  loadOAuthLink: e => e,
  loadOAuthLinkReset: e => e,
}

const data = {
  oauthLink: DetailData({
    state: REQUEST_STATUS.SUCCESS,
    data: oauthLink,
  }),
}

it('renders loading state', () => {
  const localProps = {
    ...props,
    loadOAuthLink: jest.fn(),
    loadOAuthLinkReset: jest.fn(),
  }
  const wrapper = mount(<ReconnectStorageModal {...localProps} />)

  expect(wrapper.find(Spinner).length).toEqual(0)
  expect(localProps.loadOAuthLink).not.toHaveBeenCalled()
  expect(localProps.loadOAuthLinkReset).not.toHaveBeenCalled()
})

it('renders open state', () => {
  const localProps = {
    ...props,
    open: true,
    loadOAuthLink: jest.fn(),
    loadOAuthLinkReset: jest.fn(),
  }
  const wrapper = mount(<ReconnectStorageModal {...localProps} />)

  expect(wrapper.find(Spinner).length).not.toEqual(0)
  expect(localProps.loadOAuthLink).toHaveBeenCalled()
  expect(localProps.loadOAuthLinkReset).toHaveBeenCalled()
})

it('redirects when oauth url acquired', () => {
  const localProps = {
    ...props,
    open: true,
    oauthLink: DetailData({
      state: REQUEST_STATUS.PENDING,
    }),
    loadOAuthLink: jest.fn(),
    loadOAuthLinkReset: jest.fn(),
  }

  window.location.assign = jest.fn()

  const wrapper = mount(<ReconnectStorageModal {...localProps} />)

  wrapper.setProps({
    ...localProps,
    ...data,
  })

  expect(window.location.assign).toHaveBeenCalledWith(data.oauthLink.data.redirect_url)
})
