import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Row, Col, Button } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus,
} from '@fortawesome/free-solid-svg-icons'

// import { isPending, hasFailed, hasSucceeded } from 'utils/state'
import { useDataLoadEffect } from 'utils/hooks'
import {
  selectDomainList,
  loadDomainList,
} from 'store/modules/domains'


export function AccountDomains(props) {
  const { domainList, loadDomainList } = props

  useDataLoadEffect(domainList, loadDomainList)

  return <div className="pt-3 pb-5 px-sm-5 px-4">
    <div className="pb-5" style={{ maxWidth: '75rem' }}>
      <Row className="align-items-start">
        <div className="col-md mr-auto" style={{ maxWidth: '50rem' }}>
          <h2 className="h6 mt-3 mb-5">Domains</h2>
          <p className="mb-5 text-f-md">
            This is a list of custom domains you have assigned to your Fast.io sites.
          </p>
        </div>
        <Col className="flex-grow-0 mt-2 mb-5">
          <Button color="primary" className="text-nowrap text-f-md">
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add a Domain
          </Button>
        </Col>
      </Row>

      <div className="d-flex flex-wrap align-items-center rounded-lg py-3 px-4 mb-3 text-f-md bg-f-gray15">
        <h3 className="my-3 text-f-md">tomswebsite.com</h3>
        <div className="w-100 border-bottom mt-3 mb-3 d-sm-none d-block border-f-gray12" />
        <div className="ml-auto">
          <div
            className="d-inline-block px-3 py-1 my-2 mr-3 rounded-pill text-white font-weight-bold bg-f-color3"
            style={{ fontSize: '.63rem' }}
          >
            Fast.io DNS
          </div>
          <Button outline color="primary" className="my-2 text-f-md">
            View Details
          </Button>
        </div>
      </div>
      <div className="d-flex flex-wrap align-items-center rounded-lg py-3 px-4 mb-3 text-f-md bg-f-gray15">
        <h3 className="my-3 text-f-md">finnthehuman.com</h3>
        <div className="w-100 border-bottom mt-3 mb-3 d-sm-none d-block border-f-gray12" />
        <div className="ml-auto">
          <div
            className="d-inline-block px-3 py-1 my-2 mr-3 rounded-pill text-white font-weight-bold bg-f-color4"
            style={{ fontSize: '.63rem' }}
          >
            External DNS
          </div>
          <Button outline color="primary" className="btn btn-outline-primary my-2 text-f-md">
            View Details
          </Button>
        </div>
      </div>
    </div>
  </div>
}

AccountDomains.propTypes = {
  domainList: ImmutablePropTypes.record.isRequired,
  loadDomainList: PropTypes.func.isRequired,
}

const selector = createStructuredSelector({
  domainList: selectDomainList,
})

const actions = {
  loadDomainList,
}

export default compose(
  connect(selector, actions),
)(AccountDomains)
