import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { hasSucceeded } from 'utils/state'
import { useDataLoadEffect } from 'utils/hooks'
import {
  selectPlan,
  loadPlan,
} from 'store/modules/billing'
import Spinner from 'components/common/Spinner'
import AccountBillingDomains from '../AccountBillingDomains'
import AccountBillingInvoiceList from '../AccountBillingInvoiceList'
import AccountBillingSubscription from '../AccountBillingSubscription'

export function AccountBilling(props) {
  const { plan, loadPlan } = props

  useDataLoadEffect(plan, loadPlan)
  return <div className="pt-3 pb-5 px-sm-3 px-0 bg-f-gray15">
    {
      !hasSucceeded(plan.state) && <Spinner />
    }

    {
      hasSucceeded(plan.state) && <>
        <AccountBillingSubscription />
        <AccountBillingDomains />

        {
          plan.data.name.toLowerCase() !== 'freetier' && <AccountBillingInvoiceList />
        }
      </>
    }
  </div>
}

AccountBilling.propTypes = {
  plan: ImmutablePropTypes.record.isRequired,
  loadPlan: PropTypes.func.isRequired,
}

const selector = createStructuredSelector({
  plan: selectPlan,
})

const actions = {
  loadPlan,
}

export default compose(
  connect(selector, actions),
)(AccountBilling)
