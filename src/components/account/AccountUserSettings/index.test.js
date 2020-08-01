import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter as Router } from 'react-router-dom'
import { ListGroup, ListGroupItem } from 'reactstrap'

import { REQUEST_STATUS } from 'constants/common'
import { DetailData } from 'store/common/models'
import { User } from 'store/modules/user'
import { AccountUserSettings } from './index'


jest.mock('components/common/DisabledLink', () => ({ children }) => <a>{children}</a>)
jest.mock('components/common/TwoFactorInputModal')
jest.mock('../CloseAccount')

const props = {
  user: DetailData({
    state: REQUEST_STATUS.SUCCESS,
    data: User({
      id: 1,
      email_address: 'user1@fast.io',
      first_name: 'Tester',
      last_name: 'Test',
      phone_country: '1',
      phone_number: '5555555556'
    }),
  }),
  userTitle: 'TT',
  updateUserState: REQUEST_STATUS.INITIAL,
  updateUserLastError: '',
  removeTwoFactorState: REQUEST_STATUS.INITIAL,
  closeAccountState: REQUEST_STATUS.INITIAL,
  loadUser: e => e,
  updateUser: e => e,
  resetTwoFactorAddingProcess: e => e,
  removeTwoFactor: e => e,
  closeAccount: e => e,
}

it('renders user-loaded state', () => {
  const wrapper = mount(<Router>
    <AccountUserSettings {...props} />
  </Router>)

  expect(wrapper.find('div.js-user-full-name').text()).toContain(
    `${props.user.data.first_name} ${props.user.data.last_name}`)
  expect(wrapper.find(ListGroup).length).not.toEqual(0)
  expect(wrapper.find(ListGroup).find(ListGroupItem).length).not.toEqual(0)
  expect(wrapper.find(ListGroup).find(ListGroupItem).at(0).text()).toContain(
    `+${props.user.data.phone_country} ${props.user.data.phone_number}`)
  expect(wrapper.find(ListGroup).find(ListGroupItem).at(1).text()).toContain(
    `${props.user.data.email_address}`)
})
