import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {
  Button, Table, UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem
} from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSortAmountUp, faToggleOn, faToggleOff, faEllipsisH,
} from '@fortawesome/free-solid-svg-icons'

// import { isPending, hasFailed, hasSucceeded } from 'utils/state'
import { useDataLoadEffect } from 'utils/hooks'
import {
  selectDomainList,
  loadDomainList,
} from 'store/modules/domains'
import DetailBlock from 'components/common/DetailBlock'


export function AccountBillingDomains(props) {
  const { domainList, loadDomainList } = props

  useDataLoadEffect(domainList, loadDomainList)

  return (
    <div className="p-3" style={{ maxWidth: '75rem' }}>
      <DetailBlock header="Domains">
        <div className="TableScrollWrapper">
          <Table borderless className="mb-0 Billing-domains">
            <thead>
              <tr>
                <th scope="col" className="pl-0 FilterMenu">
                  <Button type="button" color="link" className="px-0" id="sortInvoice">
                    Domain
                    <FontAwesomeIcon icon={faSortAmountUp} className="ml-2" />
                  </Button>
                </th>
                <th scope="col" className="FilterMenu">
                  <Button type="button" color="link" className="px-0" id="sortState">
                    Expiration
                    <FontAwesomeIcon icon={faSortAmountUp} className="ml-2" />
                  </Button>
                </th>
                <th scope="col" className="FilterMenu is-active">
                  <Button type="button" color="link" className="px-0" id="sortPeriod">
                    Auto-renew
                    <FontAwesomeIcon icon={faSortAmountUp} className="ml-2" />
                  </Button>
                </th>
                <th scope="col" className="FilterMenu"></th>
              </tr>
            </thead>
            <tbody className="text-f-sm text-f-gray8">
              <tr className="border-top border-f-gray13">
                <th scope="row" className="py-4 pl-0 font-weight-normal text-f-gray3">tomswebsite.com</th>
                <td className="py-4">Feb 10, 2020</td>
                <td className="py-4">
                  <span className="text-f-color2">
                    <FontAwesomeIcon icon={faToggleOn} className="mr-2" />On
                  </span>
                </td>
                <td className="py-3 pr-0">
                  <UncontrolledDropdown direction="down">
                    <DropdownToggle color="link" className="btn py-1 IconButton">
                      <FontAwesomeIcon icon={faEllipsisH} />
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem>Manage</DropdownItem>
                      <DropdownItem>Disable auto-renew</DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </td>
              </tr>
              <tr className="border-top border-f-gray13">
                <th scope="row" className="py-4 pl-0 font-weight-normal text-f-gray3">mranderson.com</th>
                <td className="py-4">Feb 10, 2020</td>
                <td className="py-4">
                  <span>
                    <FontAwesomeIcon icon={faToggleOff} className="mr-2" />Off
                  </span>
                </td>
                <td className="py-3 pr-0">
                  <UncontrolledDropdown direction="down">
                    <DropdownToggle color="link" className="btn py-1 IconButton">
                      <FontAwesomeIcon icon={faEllipsisH} />
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem>Manage</DropdownItem>
                      <DropdownItem>Disable auto-renew</DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </DetailBlock>
    </div>
  )
}

AccountBillingDomains.propTypes = {
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
)(AccountBillingDomains)
