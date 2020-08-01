import React, { useState, useEffect, useRef } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {
  ListGroup, ListGroupItem,
  Row, Col,
} from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus, faUser,
} from '@fortawesome/free-solid-svg-icons'

import { isPending, hasSucceeded } from 'utils/state'
import {
  selectUser,
  selectUserTitle,
  selectUpdateUserState,
  selectUpdateUserLastError,
  updateUser,
} from 'store/modules/user'
import {
  selectRemoveTwoFactorState,
  removeTwoFactor,
} from 'store/modules/twofactor'

import Spinner from 'components/common/Spinner'
import DisabledLink from 'components/common/DisabledLink'
import TFAMark from 'components/common/TFAMark'
import AccountUserFullNameForm from '../AccountUserFullNameForm'
import AccountUserEmailForm from '../AccountUserEmailForm'
import AccountUserPasswordForm from '../AccountUserPasswordForm'
import AccountUserPhoneForm from '../AccountUserPhoneForm'
import CloseAccount from '../CloseAccount'
import { handleUpdateAccountUserSettingsError } from 'utils/formErrors'

export function AccountUserSettings(props) {
  const {
    user, userTitle, updateUserState, removeTwoFactorState,
    updateUser, removeTwoFactor
  } = props

  const [openNameForm, setOpenNameForm] = useState(false)
  const [openPhoneForm, setOpenPhoneForm] = useState(false)
  const [openEmailForm, setOpenEmailForm] = useState(false)
  const [openPasswordForm, setOpenPasswordForm] = useState(false)

  const handleToggleEditingName = (ev) => {
    ev.preventDefault()
    setOpenNameForm(value => !value)
  }

  const handleToggleEditingPhone = (ev) => {
    ev.preventDefault()
    setOpenPhoneForm(value => !value)
  }

  const handleToggleEditingEmail = (ev) => {
    ev.preventDefault()
    setOpenEmailForm(value => !value)
  }

  const handleToggleEditingPassword = (ev) => {
    ev.preventDefault()
    setOpenPasswordForm(value => !value)
  }

  const handleUpdateUser = (data, form, formCallback) => {
    updateUser({
      data,
      meta: {
        form: {
          callback: (error) => {
            if (!error) {
              // In case nothing to update error with code `10030`
              closeForms()
            }
            formCallback && formCallback(error)
          },
          errorHandler: handleUpdateAccountUserSettingsError
        }
      }
    })
  }

  const handleDisable2FA = (event) => {
    event.preventDefault()
    removeTwoFactor()
  }

  const closeForms = () => {
    setOpenNameForm(false)
    setOpenEmailForm(false)
    setOpenPhoneForm(false)
    setOpenPasswordForm(false)
  }

  const updateUserStateRef = useRef()
  useEffect(() => {
    if (
      updateUserStateRef.current &&
      isPending(updateUserStateRef.current) &&
      hasSucceeded(updateUserState)
    ) {
      closeForms()
    }
    updateUserStateRef.current = updateUserState
  }, [updateUserState])

  return (
    <div>
      {
        !hasSucceeded(user.state) && <Spinner />
      }

      {
        hasSucceeded(user.state) && <div className="pt-3 pb-5 px-sm-5 px-4" style={{ maxWidth: '65rem' }}>
          <div className="d-flex flex-wrap align-items-center pb-3">
            <div className="rounded-circle d-flex mr-4 my-2 Account-avatar">
              <span className="m-auto">{userTitle}</span>
              <FontAwesomeIcon icon={faUser} className="m-auto d-none" size="lg" />
            </div>
            {openNameForm ? (
              <AccountUserFullNameForm
                initialValues={{
                  first_name: user.data.first_name,
                  last_name: user.data.last_name
                }}
                submitting={isPending(updateUserState)}
                onSubmit={handleUpdateUser}
                onCancel={handleToggleEditingName}
              />
            ) : (
              <div className="my-2 js-user-full-name">
                {user.data.first_name && user.data.last_name ? <>
                  <h2 className="h5 mb-1">{user.data.first_name} {user.data.last_name}</h2>
                  <a className="p-0 text-f-sm" href="/" onClick={handleToggleEditingName}>
                    Edit Name
                    <TFAMark show={user.data['2factor']} />
                  </a>
                </> : <>
                  <a className="p-0 text-f-sm" href="/" onClick={handleToggleEditingName}>Add your Name</a>
                </>}
              </div>
            )}
          </div>

          <ListGroup flush className="Account-details text-f-sm text-f-gray3">
            <ListGroupItem className="px-0 py-3">
              <Row className="align-items-center">
                <Col md="3" className="py-2">
                  <h3 className="m-0 py-1">Phone Number:</h3>
                </Col>
                {
                  openPhoneForm ?
                  <AccountUserPhoneForm
                    className="col py-1"
                    initialValues={{
                      phone_country: user.data.phone_country,
                      phone_number: user.data.phone_number,
                    }}
                    submitting={isPending(updateUserState)}
                    onSubmit={handleUpdateUser}
                    onCancel={handleToggleEditingPhone}
                  />
                  :
                  <>
                    <Col sm className="py-2">
                      {
                        user.data.phone_country && user.data.phone_number ?
                        <span>
                          +{user.data.phone_country} {user.data.phone_number}
                        </span> :
                        <a href="/" onClick={handleToggleEditingPhone}>
                          <FontAwesomeIcon icon={faPlus} className="mr-2" />
                          Add phone number
                        </a>
                      }
                    </Col>
                    <Col className="py-2 text-sm-right">
                      {
                        user.data.phone_country && user.data.phone_number ?
                        <a href="/" onClick={handleToggleEditingPhone}>
                          Change phone number
                          <TFAMark show={user.data['2factor']} />
                        </a> :
                        <em className="text-f-gray8">For security and verification</em>
                      }
                    </Col>
                  </>
                }
              </Row>
            </ListGroupItem>
            <ListGroupItem className="px-0 py-3">
              <Row className="align-items-center">
                <Col md="3" className="py-2">
                  <h3 className="m-0 py-1">Email:</h3>
                </Col>
                {
                  openEmailForm ?
                  <AccountUserEmailForm
                    className="col py-1"
                    initialValues={{ email_address: user.data.email_address }}
                    submitting={isPending(updateUserState)}
                    onSubmit={handleUpdateUser}
                    onCancel={handleToggleEditingEmail}
                  />
                  :
                  <>
                    <Col sm className="py-2">
                      {user.data.email_address}
                    </Col>
                    <Col className="py-2 text-sm-right">
                      <a href="/" onClick={handleToggleEditingEmail}>
                        Change email
                        <TFAMark show={user.data['2factor']} />
                      </a>
                    </Col>
                  </>
                }
              </Row>
            </ListGroupItem>
            <ListGroupItem className="px-0 py-3">
              <Row className="align-items-center">
                <Col md="3" className="py-2">
                  <h3 className="m-0 py-1">Password:</h3>
                </Col>
                {
                  openPasswordForm ?
                  <Col>
                    <AccountUserPasswordForm
                      submitting={isPending(updateUserState)}
                      onSubmit={handleUpdateUser}
                      onCancel={handleToggleEditingPassword}
                    />
                  </Col> :
                  <>
                    <Col sm className="py-2 text-f-md">
                      •••••••••••••
                    </Col>
                    <Col className="py-2 text-sm-right">
                      <a href="/" onClick={handleToggleEditingPassword}>
                        Change password
                        <TFAMark show={user.data['2factor']} />
                      </a>
                    </Col>
                  </>
                }
              </Row>
            </ListGroupItem>
            <ListGroupItem className="px-0 py-3">
              <Row className="align-items-center">
                <Col md="3" className="py-2">
                  <h3 className="m-0 py-1">2-Factor Auth:</h3>
                </Col>
                {
                  user.data['2factor'] ? <>
                    <Col sm className="py-2">
                      Enabled
                    </Col>
                    <Col className="py-2 text-sm-right">
                      {
                        isPending(removeTwoFactorState) ?
                        <DisabledLink>Disabling...</DisabledLink> :
                        <a className="text-danger" href="/" onClick={handleDisable2FA}>
                          Disable
                          <TFAMark show={user.data['2factor']} />
                        </a>
                      }
                    </Col>
                  </> :
                  <>
                    <Col sm className="py-2">
                      Disabled
                    </Col>
                    <Col className="py-2 text-sm-right">
                      <Link to="/twofactor/addphone">
                        Enable
                      </Link>
                    </Col>
                  </>
                }
              </Row>
              <Row>
                <Col md="9" className="ml-md-auto pt-2 pb-3 text-f-gray6">
                  Fast uses Authy for 2-Factor authentication. They have apps for mobile, desktop, and browser plugins.
                  To setup 2-Factor, first add a telephone number to your account. Once you add a phone number, you will be able to configure Authy.
                </Col>
              </Row>
            </ListGroupItem>
          </ListGroup>

          <CloseAccount />
        </div>
      }
    </div>
  )
}

AccountUserSettings.propTypes = {
  user: ImmutablePropTypes.record.isRequired,
  userTitle: PropTypes.string.isRequired,
  updateUserState: PropTypes.string,
  updateUserLastError: PropTypes.string,
  removeTwoFactorState: PropTypes.string.isRequired,
  updateUser: PropTypes.func.isRequired,
  removeTwoFactor: PropTypes.func.isRequired,
}

const selector = createStructuredSelector({
  user: selectUser,
  userTitle: selectUserTitle,
  updateUserState: selectUpdateUserState,
  updateUserLastError: selectUpdateUserLastError,
  removeTwoFactorState: selectRemoveTwoFactorState,
})

const actions = {
  updateUser,
  removeTwoFactor,
}

export default compose(
  connect(selector, actions),
)(AccountUserSettings)
