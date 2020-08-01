import React, { useEffect, useRef, useState, Suspense } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {
  Modal, ModalHeader, ModalBody, Input,
} from 'reactstrap'

import { needsLoading, hasSucceeded } from 'utils/state'
import { useDataLoadEffect } from 'utils/hooks'
import {
  selectStripeKey,
  selectAvailablePlanList,
  getStripeKey,
  loadPlanList,
} from 'store/modules/billing'
import Spinner from 'components/common/Spinner'

/* Lazy-loaded components */
const CardForm = React.lazy(() => import('components/common/CardForm'))


export function SubscriptionModal(props) {
  const {
    availablePlanList, open, stripeKey, getStripeKey,
    onToggle, onSubmit, loadPlanList
  } = props
  const [selectedPlan, setSelectedPlan] = useState('')

  const handleChangePlan = (ev) => setSelectedPlan(ev.target.value)

  const handleSubmitCard = (data) => {
    if (!selectedPlan) {
      return
    }

    onSubmit({
      ...data,
      plan: selectedPlan,
    })
  }

  useDataLoadEffect(availablePlanList, loadPlanList)

  const prevPropsRef = useRef()
  useEffect(() => {
    if (
      prevPropsRef.current &&
      !prevPropsRef.current.open &&
      open && needsLoading(stripeKey.state)
    ) {
      getStripeKey()
    }
    prevPropsRef.current = props
  }, [props])

  return <Modal isOpen={open} toggle={onToggle}>
    <ModalHeader tag="h6">
      Add Subscription
    </ModalHeader>
    <ModalBody className="text-f-sm">
      <div className="mb-3">
        {
          !hasSucceeded(availablePlanList.state) && <Spinner />
        }

        {
          hasSucceeded(availablePlanList.state) && <Input
            type="select"
            className="text-f-sm"
            value={selectedPlan}
            onChange={handleChangePlan}
          >
            <option value="">- Select a plan -</option>
            {
              availablePlanList.data.filter(plan => !!plan.price_meter).map(plan => (
                <option key={plan.name} value={plan.name}>{plan.desc}</option>
              ))
            }
          </Input>
        }
      </div>

      <div className="mb-3">
        {
          !hasSucceeded(stripeKey.state) && <Spinner />
        }

        {
          hasSucceeded(stripeKey.state) && <Suspense fallback={<Spinner />}>
            <CardForm
              apiKey={stripeKey.data.payment_token_key}
              onSubmit={handleSubmitCard}
            />
          </Suspense>
        }
      </div>
    </ModalBody>
  </Modal>
}

SubscriptionModal.propTypes = {
  open: PropTypes.bool,
  onToggle: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  stripeKey: ImmutablePropTypes.record.isRequired,
  availablePlanList: ImmutablePropTypes.record.isRequired,
  getStripeKey: PropTypes.func.isRequired,
  loadPlanList: PropTypes.func.isRequired,
}

const selector = createStructuredSelector({
  stripeKey: selectStripeKey,
  availablePlanList: selectAvailablePlanList,
})

const actions = {
  getStripeKey,
  loadPlanList,
}

export default compose(
  connect(selector, actions),
)(SubscriptionModal)
