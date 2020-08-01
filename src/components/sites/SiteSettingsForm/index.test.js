import React from 'react'
import { mount } from 'enzyme'

import { DEFAULT_EXCLUDE_FILTER_REGEX } from 'constants/common'
import {
  changeInputValue,
  changeCheckboxValue,
  timeoutPromise,
} from 'utils/testTools'
import { storages } from 'test/fixtures/storage'
import { Plan } from 'store/modules/billing'
import { cleanupRegex } from 'utils/regex'
import SiteSettingsForm from './index'


const initialValues = {
  desc: 'Sample site',
  storage: 'googledrive',
  fancyindexing: false,
  indexfiles: true,
  search: true,
  autoupdate: false,
  password: '',
  precache: true,
  precachedata: false,
  expires: 0,
  minify_html: false,
  minify_js: false,
  minify_css: false,
  rocket_load: false,
  image_mirage: false,
  image_polish: false,
  email_obfs: false,
  scrape_shield: false,
  filter: '/^.*.git/',
  filter_mode: 1,
}

const props = {
  initialValues,
  plan: Plan({
    free: false
  }),
  storageList: storages,
  onSubmit: e => e,
  onToggleDisable: e => e,
  onPermanentlyDelete: e => e,
}

const nonCheckboxFields = ['desc', 'password', 'storage', 'expires', 'filter', 'filter_mode']

it('renders initial state', () => {
  const wrapper = mount(<SiteSettingsForm {...props} />)

  expect(wrapper.find('form').length).not.toEqual(0)
})

it('renders initial state from initial values', () => {
  const localProps = {
    ...props,
    initialValues,
  }

  const wrapper = mount(<SiteSettingsForm {...localProps} />)

  Object.keys(localProps.initialValues).forEach(field => {
    if (nonCheckboxFields.includes(field)) {
      if (field === 'filter') {
        expect(wrapper.text()).toContain(cleanupRegex('*.git'))
      } else if (field !== 'filter_mode') {
        expect(wrapper.text()).toContain(localProps.initialValues[field])
      }
    } else {
      expect(wrapper.find({
        type: 'checkbox',
        name: field,
      }).find('input').props().value).toEqual(localProps.initialValues[field])
    }
  })
})

it('does not submit form data when no value is changed', async () => {
  const localProps = {
    ...props,
    onSubmit: jest.fn(),
  }

  const wrapper = mount(<SiteSettingsForm {...localProps} />)

  Object.keys(initialValues).forEach(field => {
    if (!nonCheckboxFields.includes(field)) {
      changeCheckboxValue(wrapper.find({
        type: 'checkbox',
        name: field,
      }).find('input'), initialValues[field])
    }
  })

  wrapper.find('form').simulate('submit')

  await timeoutPromise(0)

  expect(localProps.onSubmit).not.toHaveBeenCalled()
})

it('submits correct form data with only updated fields', async () => {
  const localProps = {
    ...props,
    onSubmit: jest.fn(),
  }

  const wrapper = mount(<SiteSettingsForm {...localProps} />)

  const updatedData = {
    fancyindexing: true,
    autoupdate: true,
    filter: DEFAULT_EXCLUDE_FILTER_REGEX,
    filter_mode: 2,
  }

  changeCheckboxValue(wrapper.find({
    name: 'fancyindexing'
  }).find('input'), updatedData.fancyindexing)
  changeCheckboxValue(wrapper.find({
    name: 'autoupdate'
  }).find('input'), updatedData.autoupdate)
  changeInputValue(wrapper.find({
    name: 'filter_mode'
  }).find('select'), updatedData.filter_mode)

  wrapper.find('form').simulate('submit')

  await timeoutPromise(0)

  expect(localProps.onSubmit).toHaveBeenCalled()
  expect(localProps.onSubmit.mock.calls[0][0]).toEqual(updatedData)
})

it('calls onToggleDisable callback when disable button clicked', () => {
  const localProps = {
    ...props,
    onToggleDisable: jest.fn()
  }

  const wrapper = mount(<SiteSettingsForm {...localProps} />)

  wrapper.find('button.js-disable').simulate('click')

  expect(localProps.onToggleDisable).toHaveBeenCalled()
})

it('calls onPermanentlyDelete callback when disable button clicked', () => {
  const localProps = {
    ...props,
    onPermanentlyDelete: jest.fn()
  }

  const wrapper = mount(<SiteSettingsForm {...localProps} />)

  wrapper.find('button.js-permanently-delete').simulate('click')

  expect(localProps.onPermanentlyDelete).toHaveBeenCalled()
})

it('renders `Apply Changes` green bar only when user actually made any changes', () => {
  const wrapper = mount(<SiteSettingsForm {...props} />)
  expect(wrapper.find('.js-green-bar').length).toBe(0)
  wrapper.find('input[name="fancyindexing"]').simulate('change', { target: { checked: true } })
  expect(wrapper.find('.js-green-bar').length).toBe(1)
})
