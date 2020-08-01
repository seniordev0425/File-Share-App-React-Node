import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Row, Col, Button } from 'reactstrap'
import { REQUEST_STATUS } from 'constants/common'
import {
    resetPasswordInitial
} from 'store/modules/user'

export function ResetPasswordSuccess(props) {
    const { resetPasswordInitial } = props

    const resetForm = () => {
        resetPasswordInitial(REQUEST_STATUS.INITIAL)
    }

    return (
        <section className="mx-auto text-f-sm" style={{ maxWidth: '30rem' }}>
            <Row noGutters className="py-5 px-sm-5 px-4 DetailBlock text-md-left text-center">
                <Col md className="d-flex flex-column justify-content-center mb-md-0 mb-4">
                    <h5 className="mb-3 text-center">Password reset link sent.</h5>

                    <label className="text-center">
                        We sent you an email with a link to reset your Fast account. You should receive it shortly. Please check your email and click that link.
                    </label>

                    <div className="mt-5">
                        <Link to="/login">
                            <Button
                                type="button"
                                color="primary"
                                size="lg"
                                className="w-100 py-3 text-f-md"
                                onClick={resetForm}
                            >
                                Back to Log In
                            </Button>
                        </Link>
                    </div>
                </Col>
            </Row>
        </section>
    )
}

ResetPasswordSuccess.propTypes = {
    resetPasswordInitial: PropTypes.func.isRequired
}

const actions = {
    resetPasswordInitial
}

export default compose(
    connect(null , actions),
)(ResetPasswordSuccess)

