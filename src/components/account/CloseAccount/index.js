import React, { useState } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Alert, Button } from 'reactstrap'

import { needsLoading, isPending, hasSucceeded, hasFailed } from 'utils/state'
import {
  selectUser,
  selectCloseAccountState,
  closeAccount,
} from 'store/modules/user'
import Spinner from 'components/common/Spinner'
import TFAMark from 'components/common/TFAMark'
import CloseAccountEmailForm from '../CloseAccountEmailForm'


export function CloseAccount(props) {
  const { user, closeAccountState, closeAccount } = props
  const [openForm, setOpenForm] = useState(false)

  const handleOpenForm = () => setOpenForm(true)

  const handleCloseForm = () => setOpenForm(false)

  const handleCloseAccount = (data) => {
    closeAccount({
      email_address: data.email_address,
    })
  }

  return <div className="text-f-sm">
    {
      !openForm && <Button
        color="danger"
        className="mt-5 text-f-sm"
        onClick={handleOpenForm}
      >
        Close Account
        <TFAMark
          show={user.data['2factor']}
          style={{ verticalAlign: '5%' }}
        />
      </Button>
    }

    {
      openForm && <>
        <Alert color="danger" className="mb-3">
          Warning! Closing your account is a permanent change. Your account will not be deleted but it will be locked, all Servers disabled, and you will not be able to log back in!
        </Alert>

        {
          isPending(closeAccountState) && <Spinner />
        }

        {
          hasFailed(closeAccountState) && <Alert color="warning" className="mb-3">
            Failed to close account.
          </Alert>
        }

        {
          hasSucceeded(closeAccountState) && <Alert color="success" className="mb-3">
            Successfully closed account.
          </Alert>
        }

        {
          needsLoading(closeAccountState) && <CloseAccountEmailForm
            email={user.data.email_address}
            onSubmit={handleCloseAccount}
            onCancel={handleCloseForm}
          />
        }
      </>
    }
  </div>
}

CloseAccount.propTypes = {
  user: ImmutablePropTypes.record.isRequired,
  closeAccountState: PropTypes.string.isRequired,
  closeAccount: PropTypes.func.isRequired,
}

const selector = createStructuredSelector({
  user: selectUser,
  closeAccountState: selectCloseAccountState,
})

const actions = {
  closeAccount,
}

export default compose(
  connect(selector, actions),
)(CloseAccount)
