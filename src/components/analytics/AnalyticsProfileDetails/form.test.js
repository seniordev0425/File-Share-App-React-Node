import React from 'react'
import { mount } from 'enzyme'
import { Row, Col, Button } from 'reactstrap'

import { changeInputValue, changeCheckboxValue } from 'utils/testTools'
import { AnalyticsProvider, AnalyticsProfile } from 'store/modules/analytics'
import AnalyticsProfileDetailForm from './form'


const props = {
  provider: AnalyticsProvider({
    id: '10',
    name: 'googleanalytics',
    display: 'Google Analytics',
  }),
  profile: AnalyticsProfile({
    name: 'Test Analytics',
    provider: 'googleanalytics',
    token: 'UA-123123-1',
    event_name: 'Some Event',
    referrer: false,
    filter_mode: 1,
    filter: '/^.png$/i',
    filter_mode_country: 0,
    filter_country: '/^US$/i',
    updated: '2019-04-20 10:00:00 UTC',
  }),
  submitting: false,
  onSubmit: e => e,
}

it('renders initial data', () => {
  const localProps = {
    ...props,
    provider: null,
  }
  const wrapper = mount(<AnalyticsProfileDetailForm {...localProps} />)

  const profileInfoView = wrapper.find(Row).find('.Profile-settingsRow').children(Col).at(0)
  expect(profileInfoView.find(Row).at(0).text()).toContain(props.profile.name)
  expect(profileInfoView.find(Row).at(2).text()).toContain(props.profile.token)
  expect(profileInfoView.find(Row).at(3).text()).toContain('Apr 20, 2019')

  const profileCustomizationView = wrapper.find(Row).find('.Profile-settingsRow').children(Col).at(1)
  expect(profileCustomizationView.find(Row).at(0).text()).toContain(props.profile.event_name)
  expect(profileCustomizationView.find(Row).at(1).text()).toContain('Disabled')

  wrapper.setProps({
    ...localProps,
    provider: props.provider,
  })
  expect(profileInfoView.find(Row).at(1).text()).toContain(props.provider.display)
})

it('submits entered information when save changes is clicked', () => {
  const localProps = {
    ...props,
    editing: true,
    onSubmit: jest.fn(),
    onCancelEditing: jest.fn(),
  }
  const wrapper = mount(<AnalyticsProfileDetailForm {...localProps} />)
  const { name, ...initialValues } = props.profile.toJS()

  const editedData = {
    token: 'UA-100100-5',
    referrer: !props.profile.referrer,
  }
  wrapper.find('.js-token-col a').simulate('click')
  changeInputValue(wrapper.find({
    name: 'token'
  }).find('input'), editedData.token)
  wrapper.find('.js-token-col button').at(1).simulate('click')

  changeCheckboxValue(wrapper.find({
    name: 'referrer'
  }).find('input'), editedData.referrer)

  wrapper.find('form').simulate('submit')

  expect(localProps.onSubmit).toHaveBeenCalledWith({
    ...initialValues,
    ...editedData,
  })
})
