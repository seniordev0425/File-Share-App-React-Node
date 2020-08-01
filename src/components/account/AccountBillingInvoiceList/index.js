import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {
  Table,
  UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import { hasSucceeded } from 'utils/state'
import { useDataLoadEffect } from 'utils/hooks'
import { formatCurrency } from 'utils/currency'
import { parseDate, formatSize } from 'utils/format'
import {
  selectInvoiceList,
  loadInvoiceList,
} from 'store/modules/billing'
import DetailBlock from 'components/common/DetailBlock'
import Spinner from 'components/common/Spinner'


export function AccountBillingInvoiceList(props) {
  const { invoiceList, loadInvoiceList } = props

  useDataLoadEffect(invoiceList, loadInvoiceList)

  return <div className="p-3">
    {
      !hasSucceeded(invoiceList.state) && <Spinner />
    }

    {
      hasSucceeded(invoiceList.state) && (
        <DetailBlock header="Billing History">
          <div className="TableScrollWrapper">
            <Table borderless className="Billing-history">
              <thead className="border-bottom border-f-gray13">
                <tr>
                  <th scope="col" className="pl-0 FilterMenu">
                    <button type="button" className="btn btn-link px-0" id="sortInvoice">
                      Invoice
                      {/* <i className="fas fa-sort-amount-up ml-2"></i> */}
                    </button>
                  </th>
                  <th scope="col" className="FilterMenu">
                    <button type="button" className="btn btn-link px-0" id="sortState">
                      State
                      {/* <i className="fas fa-sort-amount-up ml-2"></i> */}
                    </button>
                  </th>
                  <th scope="col" className="FilterMenu is-active">
                    <button type="button" className="btn btn-link px-0" id="sortPeriod">
                      Period
                      {/* <i className="fas fa-sort-amount-up ml-2"></i> */}
                    </button>
                  </th>
                  <th scope="col" className="FilterMenu">
                    <button type="button" className="btn btn-link px-0" id="sortUsage">
                      Usage
                      {/* <i className="fas fa-sort-amount-up ml-2"></i> */}
                    </button>
                  </th>
                  <th scope="col" className="FilterMenu">
                    <button type="button" className="btn btn-link px-0" id="sortCosts">
                      Costs
                      <i className="fas fa-sort-amount-up ml-2"></i>
                    </button>
                  </th>
                  <th scope="col" className="FilterMenu"></th>
                </tr>
              </thead>
              <tbody className="text-f-sm text-f-gray8">
                {
                  invoiceList.data.map(invoice => (
                    <tr key={invoice.id} className="border-bottom border-f-gray13">
                      <th scope="row" className="py-4 pl-0 font-weight-normal text-f-gray3">
                        {invoice.usage.plan.desc}
                      </th>
                      <td className="py-4">
                        <span
                          className={cx('px-3 py-1 rounded-pill text-uppercase font-weight-bold', {
                            'text-f-gray8 bg-f-gray13': !invoice.billed,
                            'bg-f-color2 text-white': invoice.billed,
                          })}
                          style={{ fontSize: '.63rem' }}
                        >
                          Pending
                        </span>
                      </td>
                      <td className="py-4">
                        {parseDate(invoice.period_start).format('MMM DD, YYYY')} - {parseDate(invoice.period_end).format('MMM DD, YYYY')}
                      </td>
                      <td className="py-4">
                        {formatSize(invoice.usage.units * invoice.usage.plan.unit)}
                      </td>
                      <td className="py-4">{formatCurrency(invoice.currency, invoice.amount_due)}</td>
                      <td className="py-3 pr-0">
                        <UncontrolledDropdown direction="down">
                          <DropdownToggle color="link" className="btn py-1 IconButton">
                            <FontAwesomeIcon icon={faEllipsisH} />
                          </DropdownToggle>
                          <DropdownMenu right>
                            <DropdownItem tag="a" href={invoice.invoice_pdf} download>
                              Download
                            </DropdownItem>
                            <DropdownItem tag="a" href={invoice.invoice_web} target="_blank">
                              View
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </Table>
          </div>
        </DetailBlock>
      )
    }
  </div>
}

AccountBillingInvoiceList.propTypes = {
  invoiceList: ImmutablePropTypes.record.isRequired,
  loadInvoiceList: PropTypes.func.isRequired,
}

const selector = createStructuredSelector({
  invoiceList: selectInvoiceList,
})

const actions = {
  loadInvoiceList,
}

export default compose(
  connect(selector, actions),
)(AccountBillingInvoiceList)
