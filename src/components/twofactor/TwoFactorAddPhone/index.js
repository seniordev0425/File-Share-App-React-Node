import React, { useState, useEffect } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { isPending, hasSucceeded } from 'utils/state'
import { usePreviousValue } from 'utils/hooks'
import {
  selectUser,
  selectUpdateUserState,
  updateUser,
} from 'store/modules/user'
import PhoneNumberForm from './form'


export function TwoFactorAddPhone(props) {
  const {
    history, match, user,
    updateUserState, updateUser,
  } = props
  const [submittedData, setSubmittedData] = useState(null)
  const reset = (match.params && !!match.params.reset)

  const handleSubmit = data => {
    const { call, ...phoneData } = data
    setSubmittedData(data)
    updateUser({
      data: phoneData,
    })
  }

  useEffect(() => {
    if (!reset && user.data.phone_country && user.data.phone_number) {
      history.push('/twofactor/enable')
    }
  }, [])

  usePreviousValue(updateUserState, prev => {
    if (isPending(prev) && hasSucceeded(updateUserState) && submittedData) {
      // Phone number is now set!
      const method = submittedData.call ? 'call' : 'sms'
      history.push(`/twofactor/enable/${method}`)
    }
  })

  return <section className="p-5">
    <div className="mx-auto" style={{ maxWidth: '30rem' }}>
      <h6 className="mb-4">Add a phone number to verify</h6>
      <div className="mb-2 text-f-sm">
        Enter your phone number and we'll send you a verification code.
      </div>
      <PhoneNumberForm
        submitting={isPending(updateUserState)}
        onSubmit={handleSubmit}
      />
    </div>
  </section>
}

TwoFactorAddPhone.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  user: ImmutablePropTypes.record.isRequired,
  updateUserState: PropTypes.string.isRequired,
  updateUser: PropTypes.func.isRequired,
}

const selector = createStructuredSelector({
  user: selectUser,
  updateUserState: selectUpdateUserState,
})

const actions = {
  updateUser,
}

export default compose(
  withRouter,
  connect(selector, actions),
)(TwoFactorAddPhone)
