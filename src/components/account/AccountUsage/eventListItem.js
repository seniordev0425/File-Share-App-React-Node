import React from 'react'
import { ListGroupItem, Row, Col } from 'reactstrap'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { formatCurrency } from 'utils/currency'
import { parseDate } from 'utils/format'


function EventListItem(props) {
  const { statsData, plan, subscription } = props
  const cost = statsData.bytes / plan.unit * plan.price_meter

  return <ListGroupItem className="p-3">
    <Row className="align-items-center">
      <Col xs="6">
        {parseDate(statsData.start).format('MMMM DD, YYYY')}
        <span> - </span>
        {parseDate(statsData.end).format('MMMM DD, YYYY')}
      </Col>
      <Col xs="2" className="text-right">{statsData.transfers}</Col>
      <Col xs="2" className="text-right">{statsData.bytes} B</Col>
      <Col xs="2" className="text-right">{formatCurrency(subscription.currency, cost, 3)}</Col>
    </Row>
  </ListGroupItem>
}

EventListItem.propTypes = {
  statsData: ImmutablePropTypes.record.isRequired,
  plan: ImmutablePropTypes.record.isRequired,
  subscription: ImmutablePropTypes.record.isRequired,
}

export default EventListItem
