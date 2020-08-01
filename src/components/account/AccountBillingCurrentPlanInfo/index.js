import React from 'react'
import { Button, Col, Row } from 'reactstrap'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'

export const AccountBillingCurrentPlanInfo = ({
  planData,
  subscriptionData,
  onUpdateSubscription,
  onCancelSubscription,
}) => {
  const isFreetier = planData.name.toLowerCase() === 'freetier' || !subscriptionData
  return <div className="overflow-hidden DetailBlock Billing-plan">
    <Row noGutters className="align-items-center">
      <Col lg="auto" className="d-flex align-items-center align-self-stretch px-5 py-4 mr-lg-5 Billing-planBadge">
        <div className="pr-4 py-1 mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 64 64">
            <path d="M54.7 26.5h-17l2-7.4h21.4L64 8H2.4C0 8-1 11.7 1.4 11.7h32.8c2.4 0 1.4 3.7-1 3.7H20.3c-2.4 0-3.4 3.7-1 3.7h4.8c2.4 0 1.4 3.7-1 3.7h-12c-2.4 0-3.4 3.7-1 3.7h12c2.4 0 1.4 3.7-1 3.7h-4c-2.4 0-3.4 3.7-1 3.7h6.7c2.4 0 1.4 3.7-1 3.7h-2.7c-2.3 8.6-3 11.2-4.9 18.5h15.6l4.9-18.3h17l3-11.3zm-43.8 3.7c2.4 0 1.4 3.7-1 3.7H6.5c-2.4 0-1.4-3.7 1-3.7h3.4zm2.8-14.8c2.4 0 1.4 3.7-1 3.7H3.4c-2.4 0-1.4-3.7 1-3.7h9.3z"></path>
          </svg>
        </div>
        <div>
          <h2 className="pb-0 mt-1">Current Plan</h2>
          <div>{planData.name}</div>
        </div>
      </Col>
      <Col xs className="py-md-4 py-5 pr-5 pl-lg-0 pl-5 mr-auto mb-0 text-f-sm text-f-gray3" style={{ maxMidth: '45rem' }}>
        {isFreetier ? <>
          <p>Your currently using our Free Tier of service! We hope you have enjoyed your experience, please let us know how were doing.</p>
          Ready To upgrade? You can add our Pay As You Go subscription now!
        </> : <>
          Fast.io Premium is the ideal plan for startups and small teams. Just a reminder, you can create up to 25 sites with files as large as 10 GB.
          You also get a free 100 GB of transfers per month. (revise copy)
        </>}
      </Col>
      <Col md="auto" className="d-flex flex-column pt-md-4 pr-md-4 pr-5 pb-md-4 pb-5 pl-md-0 pl-5">
        <Button
          color="secondary"
          className="py-md-2 py-3 my-md-1 my-2 text-f-sm"
          onClick={onUpdateSubscription}
        >
          {isFreetier ? 'Add Subscription' : 'Upgrade to Business'}
        </Button>
        {!isFreetier && (
          <Button
            color="secondary"
            outline className="py-md-2 py-3 my-md-1 my-2 text-f-sm"
            onClick={onCancelSubscription}
            style={{ opacity: 0.5 }}
          >
            Cancel Subscription
          </Button>
        )}
      </Col>
    </Row>
  </div>
}

AccountBillingCurrentPlanInfo.propTypes = {
  planData: ImmutablePropTypes.record.isRequired,
  subscriptionData: ImmutablePropTypes.record.isRequired,
  onUpdateSubscription: PropTypes.func.isRequired,
  onCancelSubscription: PropTypes.func.isRequired,
}

export default AccountBillingCurrentPlanInfo
