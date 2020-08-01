import React from 'react'
import { mount } from 'enzyme'
import { Button } from 'reactstrap'

import { REQUEST_STATUS } from 'constants/common'
import { DetailData } from 'store/common/models'
import { OAuthLink } from 'store/modules/storage'
import { StorageContinue } from './index'


const props = {
  match: { params: { storage: 'googledrive' } },
  oauthLink: DetailData(),
  loadOAuthLink: e => e,
}

const data = {
  oauthLink: DetailData({
    state: REQUEST_STATUS.SUCCESS,
    data: OAuthLink({
      provider: 'googledrive',
      redirect_url: 'https://accounts.google.com/oauth-login/',   // mock url
      return_url: 'https://dev.fast.io/storage/link',             // mock url
    }),
  }),
}

it('renders initial state', () => {
  const localProps = {
    ...props,
    loadOAuthLink: jest.fn(),
  }
  const wrapper = mount(<StorageContinue {...localProps} />)

  expect(wrapper.find(Button).length).toEqual(1)
  expect(wrapper.find(Button).prop('disabled')).toBeTruthy()
  expect(localProps.loadOAuthLink).toHaveBeenCalledWith({
    storage: localProps.match.params.storage,
  })
})

it('renders state with oauth link loaded and redirects when button clicked', () => {
  const localProps = {
    ...props,
    ...data,
    loadOAuthLink: jest.fn(),
  }

  window.location.assign = jest.fn()

  const wrapper = mount(<StorageContinue {...localProps} />)

  expect(wrapper.find(Button).length).toEqual(1)
  const continueButton = wrapper.find(Button)
  expect(continueButton.prop('disabled')).toBeFalsy()

  continueButton.simulate('click')

  expect(window.location.assign).toHaveBeenCalledWith(localProps.oauthLink.data.redirect_url)
})
