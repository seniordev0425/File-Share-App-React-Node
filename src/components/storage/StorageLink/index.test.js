import React from 'react'
import { mount } from 'enzyme'
import { Button } from 'reactstrap'

import { REQUEST_STATUS } from 'constants/common'
import { DetailData } from 'store/common/models'
import { OAuthResult } from 'store/modules/storage'
import { StorageLink } from './index'
import Spinner from 'components/common/Spinner'


const props = {
  history: { push: e => e },
  match: { params: { storage: 'googledrive' } },
  location: { search: '?state=oauth-returned-state&code=some-random-value-123' },
  isAuthenticated: false,
  oauthResult: DetailData(),
  processOAuthCode: e => e,
  processOAuthCodeReset: e => e,
  loadMyStorageListReset: e => e,
}

const data = {
  oauthResult: DetailData({
    state: REQUEST_STATUS.SUCCESS,
    data: OAuthResult({
      provider: 'googledrive',
      email: 'tester@fast.io',
      password: null,
    }),
  }),
}

it('renders initial state', () => {
  const localProps = {
    ...props,
    processOAuthCodeReset: jest.fn(),
    processOAuthCode: jest.fn(),
  }
  const wrapper = mount(<StorageLink {...localProps} />)

  expect(wrapper.find(Spinner).length).not.toEqual(0)
  expect(localProps.processOAuthCodeReset).toHaveBeenCalled()
  expect(localProps.processOAuthCode).toHaveBeenCalledWith({
    storage: localProps.match.params.storage,
    data: {
      state: 'oauth-returned-state',
      code: 'some-random-value-123',
    }
  })
})

it('redirects to account storage page when already logged in', () => {
  const localProps = {
    ...props,
    isAuthenticated: true,
    history: { push: jest.fn() },
    oauthResult: data.oauthResult,
  }
  mount(<StorageLink {...localProps} />)

  expect(localProps.history.push).toHaveBeenCalledWith('/account/storage')
})

it('redirects to set password page when password code exists', () => {
  const localProps = {
    ...props,
    history: { push: jest.fn() },
    oauthResult: data.oauthResult.setIn(['data', 'password'], '123456')
  }
  mount(<StorageLink {...localProps} />)

  expect(localProps.history.push).toHaveBeenCalledWith('/signup/setpassword')
})

it('redirects to welcome back login page when password code is null', () => {
  const localProps = {
    ...props,
    history: { push: jest.fn() },
    oauthResult: data.oauthResult,
    loadMyStorageListReset: jest.fn(),
  }
  mount(<StorageLink {...localProps} />)

  expect(localProps.loadMyStorageListReset).toHaveBeenCalled()
  expect(localProps.history.push).toHaveBeenCalledWith('/login/welcome-back')
})
