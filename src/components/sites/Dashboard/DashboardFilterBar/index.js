import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {
  Row, Col,
  UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap'

import Spinner from 'components/common/Spinner'


export const SORT_MODES = {
  mostRecent: 'Most recent',
  lastUpdated: 'Last updated',
  name: 'Name',
  enabled: 'Enabled',
  storage: 'Storage provider',
}

export default function DashboardFilterBar(props) {
  const {
    storageList, storageFilter, sort,
    onChangeStorageFilter, onChangeSort,
  } = props

  return <section className="px-5 pt-2">
    <Row className="align-items-center">
      <Col lg="12">
        <div className="d-flex border-bottom pb-2 border-f-gray13">
          {/* Team filter (disabled for now) */}
          {/* <UncontrolledDropdown className="mr-auto FilterMenu" style={{ marginLeft: '-.75rem' }}>
            <DropdownToggle caret tag="a" className="btn" href="#">
              All teams
            </DropdownToggle>
            <DropdownMenu>

            </DropdownMenu>
          </UncontrolledDropdown> */}
          <span className="mr-auto" />

          {/* Storage provider filter */}
          <UncontrolledDropdown className="d-md-block d-none FilterMenu">
            <DropdownToggle caret tag="a" className="btn" href="#">
              {
                storageFilter ?
                `${storageFilter.display} only` :
                'All storage providers'
              }
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem
                onClick={() => onChangeStorageFilter(null)}
              >
                All storage providers
              </DropdownItem>
              {
                storageList ?
                storageList.map(storage => (
                  <DropdownItem
                    key={storage.name}
                    onClick={() => onChangeStorageFilter(storage)}
                  >
                    {storage.display} only
                  </DropdownItem>
                )) :
                <Spinner />
              }
            </DropdownMenu>
          </UncontrolledDropdown>

          {/* Recent filter */}
          <UncontrolledDropdown className="ml-3 FilterMenu" style={{ marginRight: '-.75rem' }}>
            <DropdownToggle caret tag="a" className="btn" href="#">
              {SORT_MODES[sort]}
            </DropdownToggle>
            <DropdownMenu right>
              {
                Object.keys(SORT_MODES).map(sort => (
                  <DropdownItem
                    key={sort}
                    onClick={() => onChangeSort(sort)}
                  >
                    {SORT_MODES[sort]}
                  </DropdownItem>
                ))
              }
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      </Col>
    </Row>
  </section>
}

DashboardFilterBar.propTypes = {
  storageList: ImmutablePropTypes.list,
  storageFilter: ImmutablePropTypes.record,
  onChangeStorageFilter: PropTypes.func.isRequired,
  sort: PropTypes.string.isRequired,
  onChangeSort: PropTypes.func.isRequired,
}