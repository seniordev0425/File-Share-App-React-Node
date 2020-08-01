import React, { useState } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Button, Row, Col, ListGroup, ListGroupItem } from 'reactstrap'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCcAmex } from '@fortawesome/free-brands-svg-icons'
import { faScroll, faEdit } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'

import { IS_DEBUG_MODE } from 'constants/env'
import { isLoading, isPending } from 'utils/state'
import { useDataLoadEffect } from 'utils/hooks'
import { parseDate } from 'utils/format'
import {
  selectPlan,
  selectSubscription,
  selectCreateSubscriptionState,
  selectUpdateSubscriptionState,
  selectCancelSubscriptionState,
  loadSubscription,
  createSubscription,
  updateSubscription,
  cancelSubscription,
} from 'store/modules/billing'
import Spinner from 'components/common/Spinner'
import ConfirmationModal from 'components/common/ConfirmationModal'
import SubscriptionModal from '../SubscriptionModal'
import AccountBillingCurrentPlanInfo from '../AccountBillingCurrentPlanInfo'
import DetailBlock from 'components/common/DetailBlock'


export function AccountBillingSubscription(props) {
  const {
    plan, subscription,
    createSubscriptionState, updateSubscriptionState, cancelSubscriptionState,
    loadSubscription, createSubscription, cancelSubscription,
  } = props
  const [openSubscriptionModal, setOpenSubscriptionModal] = useState(false)
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false)

  const handleToggleSubscriptionModal = () => setOpenSubscriptionModal(value => !value)

  const handleToggleConfirmationModal = () => setOpenConfirmationModal(value => !value)

  const handleCreateSubscription = (data) => {
    handleToggleSubscriptionModal()
    createSubscription(data)
  }

  const handleCancelSubscription = () => {
    handleToggleConfirmationModal()
    cancelSubscription()
  }

  useDataLoadEffect(subscription, loadSubscription)

  const isOperationPending = (
    isPending(createSubscriptionState) ||
    isPending(updateSubscriptionState) ||
    isPending(cancelSubscriptionState)
  )
  

  return <div className="mb-4 text-f-sm">
    {
      (isLoading(subscription.state) || isOperationPending) && <Spinner />
    }

    {
      !(isLoading(subscription.state) || isOperationPending) && <div className="mb-2">
        <div className="p-3" style={{ maxWidth: '75rem' }}>
          <AccountBillingCurrentPlanInfo
            planData={plan.data}
            subscriptionData={subscription.data}
            onUpdateSubscription={handleToggleSubscriptionModal}
            onCancelSubscription={handleToggleConfirmationModal}
          />
          {
            IS_DEBUG_MODE && <Button
              color="danger"
              className="text-f-sm my-2"
              onClick={() => axios.post('http://localhost:8810/api/v1.x/billing/reset')}
            >
              Reset Subscription
            </Button>
          }

          {plan.data.name.toLowerCase() !== 'freetier' && subscription.data && <>
            <h1 className="my-4 mr-3 BlockSeparatorHeading">
              <span>Subscription Overview<FontAwesomeIcon icon={faScroll} className="ml-2" /></span>
            </h1>
            <Row noGutters>
              <Col md="6" className="pr-md-3 pb-md-0 pb-3">
                <DetailBlock header="Subscription" className="h-100 text-f-sm text-f-gray8">
                  <ListGroup flush className="Billing-details text-f-sm text-f-gray3">
                    <ListGroupItem className="px-0 py-2">
                      <Row className="align-items-center">
                        <Col lg="5" className="py-2">
                          <h3 className="m-0 py-1">Subscriber Since:</h3>
                        </Col>
                        <Col sm className="py-2">
                          {parseDate(subscription.data.created).format('MMM DD, YYYY')}
                        </Col>
                      </Row>
                    </ListGroupItem>
                    <ListGroupItem className="px-0 py-2">
                      <Row className="align-items-center">
                        <Col lg="5" className="py-2">
                          <h3 className="m-0 py-1">Billing Period:</h3>
                        </Col>
                        <Col sm className="py-2">
                          {parseDate(subscription.data.current_period_start).format('MMM DD')} - {parseDate(subscription.data.current_period_end).format('MMM DD')}
                        </Col>
                      </Row>
                    </ListGroupItem>
                    <ListGroupItem className="px-0 py-2">
                      <Row className="align-items-center">
                        <Col lg="5" className="py-2">
                          <h3 className="m-0 py-1">Plan Name:</h3>
                        </Col>
                        <Col sm className="py-2">{plan.data.name}</Col>
                      </Row>
                    </ListGroupItem>
                    <ListGroupItem className="px-0 py-2">
                      <Row>
                        <Col lg="5" className="py-2">
                          <h3 className="m-0 py-1">Plan Description:</h3>
                        </Col>
                        <Col sm className="py-2">
                          {plan.data.desc}
                        </Col>
                      </Row>
                    </ListGroupItem>
                  </ListGroup>
                </DetailBlock>
              </Col>

              <Col md="6" className="pl-md-3 pt-md-0 pt-3">
                <DetailBlock
                  header={<>
                    <span className="mr-auto my-sm-0 my-1 pr-3">Payment Info</span>
                    <Button
                      onClick={handleToggleSubscriptionModal}
                      color="link"
                      className="p-0 my-sm-0 my-1 border-0 text-f-sm">
                      <FontAwesomeIcon icon={faEdit} />Update Details
                    </Button>
                  </>}
                  className="h-100 text-f-sm text-f-gray8"
                >
                  <ListGroup flush className="Billing-details text-f-sm text-f-gray3">
                    <ListGroupItem className="px-0 py-2">
                      <Row className="align-items-center">
                        <Col lg="5" className="py-2">
                          <h3 className="m-0 py-1">Payment Type:</h3>
                        </Col>
                        <Col sm className="py-2">
                          <FontAwesomeIcon icon={faCcAmex} size="lg" className="mr-2" color="#006fcf" />
                          American Express
                        </Col>
                      </Row>
                    </ListGroupItem>
                    <ListGroupItem className="px-0 py-2">
                      <Row className="align-items-center">
                        <Col lg="5" className="py-2">
                          <h3 className="m-0 py-1">Payment Exp.:</h3>
                        </Col>
                        <Col sm className="py-2">
                          {moment(new Date(
                            subscription.data.payment.exp_year,
                            subscription.data.payment.exp_month
                          )).format('MMM, YYYY')}
                        </Col>
                      </Row>
                    </ListGroupItem>
                    <ListGroupItem className="px-0 py-2">
                      <Row className="align-items-center">
                        <Col lg="5" className="py-2">
                          <h3 className="m-0 py-1">Payment Last 4:</h3>
                        </Col>
                        <Col sm className="py-2">{subscription.data.payment.last4}</Col>
                      </Row>
                    </ListGroupItem>
                  </ListGroup>
                </DetailBlock>
              </Col>
            </Row>
          </>}
        </div>
      </div>
    }

    <SubscriptionModal
      open={openSubscriptionModal}
      onToggle={handleToggleSubscriptionModal}
      onSubmit={handleCreateSubscription}
    />

    <ConfirmationModal
      open={openConfirmationModal}
      message="Are you sure to cancel subscription?"
      onConfirm={handleCancelSubscription}
      onClose={handleToggleConfirmationModal}
    />
  </div>
}

AccountBillingSubscription.propTypes = {
  plan: ImmutablePropTypes.record.isRequired,
  subscription: ImmutablePropTypes.record.isRequired,
  createSubscriptionState: PropTypes.string.isRequired,
  updateSubscriptionState: PropTypes.string.isRequired,
  cancelSubscriptionState: PropTypes.string.isRequired,
  loadSubscription: PropTypes.func.isRequired,
  createSubscription: PropTypes.func.isRequired,
  updateSubscription: PropTypes.func.isRequired,
  cancelSubscription: PropTypes.func.isRequired,
}

const selector = createStructuredSelector({
  plan: selectPlan,
  subscription: selectSubscription,
  createSubscriptionState: selectCreateSubscriptionState,
  updateSubscriptionState: selectUpdateSubscriptionState,
  cancelSubscriptionState: selectCancelSubscriptionState,
})

const actions = {
  loadSubscription,
  createSubscription,
  updateSubscription,
  cancelSubscription,
}

export default compose(
  connect(selector, actions),
)(AccountBillingSubscription)
