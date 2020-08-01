import React from 'react'
import { mount } from 'enzyme'
import { Field } from 'react-final-form'

import { changeInputValue, submitWizardStep } from 'utils/testTools'
import {
  composeValidators,
  required,
  isEmail,
} from 'utils/validation'
import FormInput from 'components/common/FormInput'
import WizardForm from './index'


const TestForm = ({ initialValues, onSubmit }) => (
  <WizardForm initialValues={initialValues} onSubmit={onSubmit}>
    <WizardForm.Step
      render={() => <>
        Username: <Field name="username" component={FormInput} validate={required('Username is required')} />
        Email: <Field name="email" component={FormInput} validate={composeValidators(
          required('Email is required'),
          isEmail('Should be email'),
        )} />
      </>}
    />
    <WizardForm.Step
      validate={values => (
        values.sitename === 'example-site' ?
        { sitename: 'Example name should not be used' } :
        {}
      )}
      render={() => <>
        Site name: <Field name="sitename" component={FormInput} validate={required('Sitename is required')} />
      </>}
    />
    {
      // Simulating a filtered-out step
      false && <div />
    }
    <WizardForm.Step
      render={() => <>
        URL: <Field name="url" component={FormInput} validate={required('URL is required')} />
      </>}
    />
  </WizardForm>
)

const testData = {
  username: 'Sandy',
  email: 'sandy@fast.io',
  sitename: 'My Site',
  url: 'https://my-site.fast.io',
}

const props = {
  initialValues: testData,
  onSubmit: e => e,
}

jest.useFakeTimers()

it('renders initial values', async () => {
  const wrapper = mount(<TestForm {...props} />)

  expect(wrapper.find({ name: 'username' }).find('input').prop('value')).toEqual(testData.username)
  expect(wrapper.find({ name: 'email' }).find('input').prop('value')).toEqual(testData.email)

  submitWizardStep(wrapper)
  expect(wrapper.find({ name: 'sitename' }).find('input').prop('value')).toEqual(testData.sitename)

  submitWizardStep(wrapper)
  expect(wrapper.find({ name: 'url' }).find('input').prop('value')).toEqual(testData.url)
})

it('validates values in each step and submits all entered values at the end', async () => {
  const localProps = {
    ...props,
    initialValues: null,
    onSubmit: jest.fn(),
  }
  const wrapper = mount(<TestForm {...localProps} />)

  // Step 1 cannot be passed without entering anything
  submitWizardStep(wrapper)
  expect(wrapper.find({ name: 'username' }).length).not.toEqual(0)

  // Step 1 cannot be passed without entering email
  changeInputValue(wrapper.find({ name: 'username' }).find('input'), testData.username)
  submitWizardStep(wrapper)
  expect(wrapper.find({ name: 'username' }).length).not.toEqual(0)

  // Step 1 cannot be passed without entering valid email
  changeInputValue(wrapper.find({ name: 'email' }).find('input'), 'invalid email')
  submitWizardStep(wrapper)
  expect(wrapper.find({ name: 'username' }).length).not.toEqual(0)

  // Step 1 pass
  changeInputValue(wrapper.find({ name: 'email' }).find('input'), testData.email)
  submitWizardStep(wrapper)
  expect(wrapper.find({ name: 'sitename' }).length).not.toEqual(0)

  // Step 2 cannot be passed without entering sitename
  submitWizardStep(wrapper)
  expect(wrapper.find({ name: 'sitename' }).length).not.toEqual(0)

  // Step 2 cannot be passed without passing validation
  changeInputValue(wrapper.find({ name: 'sitename' }).find('input'), 'example-site')
  submitWizardStep(wrapper)
  expect(wrapper.find({ name: 'sitename' }).length).not.toEqual(0)

  // Step 2 pass
  changeInputValue(wrapper.find({ name: 'sitename' }).find('input'), testData.sitename)
  submitWizardStep(wrapper)
  expect(wrapper.find({ name: 'url' }).length).not.toEqual(0)

  // Step 3 cannot be passed without entering url
  submitWizardStep(wrapper)
  expect(wrapper.find({ name: 'url' }).length).not.toEqual(0)

  // Step 3 pass
  changeInputValue(wrapper.find({ name: 'url' }).find('input'), testData.url)
  submitWizardStep(wrapper)

  expect(localProps.onSubmit).toHaveBeenCalledWith(testData)
})
