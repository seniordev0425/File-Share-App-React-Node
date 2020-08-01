import React, { useState, useMemo } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Link } from 'react-router-dom'
import { Row, Col, Button, ListGroup } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPlusSquare } from '@fortawesome/free-solid-svg-icons'

import Spinner from 'components/common/Spinner'
import { hasSucceeded } from 'utils/state'
import { compareValues } from 'utils/format'
import { useDataLoadEffect } from 'utils/hooks'
import { selectUserTitle } from 'store/modules/user'
import {
  selectSiteList,
  loadSiteList,
} from 'store/modules/sites'
import {
  selectStorageList,
  loadStorageList,
} from 'store/modules/storage'
import SiteListItem from '../SiteListItem'
import DashboardFilterBar, { SORT_MODES } from './DashboardFilterBar'


const SORT_FIELD_MAP = {
  mostRecent: 'created',
  lastUpdated: 'updated',
  name: 'desc',
  enabled: 'enabled',
  storage: 'storage',
}

export function Dashboard(props) {
  const {
    userTitle, siteList, loadSiteList,
    storageList, loadStorageList,
  } = props
  const [storageFilter, setStorageFilter] = useState(null)
  const [ascending, setAscending] = useState(false)
  const [sort, setSort] = useState(Object.keys(SORT_MODES)[0])

  useDataLoadEffect(siteList, loadSiteList)

  useDataLoadEffect(storageList, loadStorageList)

  const handleChangeSort = newSort => {
    if (sort === newSort) {
      setAscending(value => !value)
    } else {
      setSort(newSort)
      if (['name', 'storage'].indexOf(newSort) >= 0) {
        setAscending(true)
      } else {
        setAscending(false)
      }
    }
  }

  const siteListToShow = useMemo(() => {
    if (!siteList.data) {
      return null
    }

    // Filter by storage
    let modifiedSiteList = siteList.data
    if (storageFilter) {
      modifiedSiteList = modifiedSiteList.filter(site => (
        !storageFilter ||
        site.storage === storageFilter.name
      ))
    }

    // Sort
    const field = SORT_FIELD_MAP[sort]
    /// Sort by name first
    modifiedSiteList = modifiedSiteList.sort((site1, site2) => {
      let site1Name, site2Name
      if (site1.desc && site2.desc) {
        site1Name = site1.desc
        site2Name = site2.desc
      } else {
        site1Name = site1.name
        site2Name = site2.name
      }
      let ascendingToApply = ascending
      if (['name', 'storage'].indexOf(sort) === -1) {
        ascendingToApply = !ascendingToApply
      }
      return compareValues(site1Name, site2Name, ascendingToApply)
    })
    /// Now do sort by selected field
    if (field !== 'name') {
      modifiedSiteList = modifiedSiteList.sort((site1, site2) =>
        compareValues(site1[field], site2[field], ascending)
      )
    }

    return modifiedSiteList
  }, [siteList, storageFilter, sort, ascending])

  return <div>
    <section className="px-5 pt-5 pb-4">
      <Row>
        <Col lg="12">
          <div className="d-flex flex-wrap align-items-start">
            <h1 className="mt-1 mb-3 mr-auto h3">Sites</h1>
            {/* <Button tag="a" color="link" className="mr-auto IconButton" href="#">
              <FontAwesomeIcon icon={faSearch} />
            </Button> */}
            <Button tag={Link} to="/sites/create" color="primary">
              <FontAwesomeIcon icon={faPlus} />
              {' '}
              <span className="d-md-inline d-none ml-2">New Site</span>
            </Button>
          </div>
        </Col>
      </Row>
    </section>

    <DashboardFilterBar
      storageList={storageList.data}
      storageFilter={storageFilter}
      onChangeStorageFilter={setStorageFilter}
      sort={sort}
      onChangeSort={handleChangeSort}
    />

    {
      !hasSucceeded(siteList.state) && <Spinner />
    }

    {
      hasSucceeded(siteList.state) && <section className="px-5">
        <Row>
          <Col lg="12">
            <ListGroup flush>
              {
                siteListToShow.map(site => (
                  <SiteListItem
                    key={site.server}
                    site={site}
                    userTitle={userTitle}
                  />
                ))
              }
            </ListGroup>

            {/* New site */}
            <Link
              to="/sites/create"
              className="d-flex align-items-center justify-content-center border border-top-0 Site-addNew"
            >
              <FontAwesomeIcon icon={faPlusSquare} className="mr-2" />
              Add New Site
            </Link>
          </Col>
        </Row>
      </section>
    }
  </div>
}

Dashboard.propTypes = {
  userTitle: PropTypes.string.isRequired,
  siteList: ImmutablePropTypes.record.isRequired,
  storageList: ImmutablePropTypes.record.isRequired,
  loadSiteList: PropTypes.func.isRequired,
  loadStorageList: PropTypes.func.isRequired,
}

const selector = createStructuredSelector({
  userTitle: selectUserTitle,
  siteList: selectSiteList,
  storageList: selectStorageList,
})

const actions = {
  loadSiteList,
  loadStorageList,
}

export default compose(
  connect(selector, actions),
)(Dashboard)
