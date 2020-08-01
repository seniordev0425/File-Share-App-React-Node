import React, { useMemo } from 'react'
import { List } from 'immutable'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Link, withRouter } from 'react-router-dom'
import { Button, ListGroupItem } from 'reactstrap'
import cx from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faStar, faExternalLinkAlt, faAngleRight,
} from '@fortawesome/free-solid-svg-icons'
import _get from 'lodash/get'

import {
  selectSitePreviewMap,
  loadSitePreview,
  updateSiteDetail,
} from 'store/modules/sites'
import {
  selectSiteMiniGraphStatsMap,
  loadSiteMiniGraphStats,
} from 'store/modules/siteStats'
import { getIconForStorage } from 'utils/icons'
import { groupStats } from 'utils/data'
import { getSiteTitle, parseDate } from 'utils/format'
import { useDataLoadEffect } from 'utils/hooks'
import StatsMiniChart from 'components/common/StatsMiniChart'
import SitePreview from 'components/sites/SitePreview'


export function SiteListItem(props) {
  const {
    history, site, siteMiniGraphStatsMap, sitePreviewMap,
    loadSiteMiniGraphStats, loadSitePreview, updateSiteDetail,
  } = props
  const server = site.server
  const siteStats = siteMiniGraphStatsMap.get(server)
  const sitePreview = sitePreviewMap.get(server)

  const handleStopPropagation = event => {
    event.stopPropagation();
  }

  const handleToggleFavourite = ev => {
    ev.preventDefault()
    ev.stopPropagation()

    if (site.enabled) {
      updateSiteDetail({
        server: site.server,
        data: {
          favorite: !site.favorite,
        },
      })
    }
  }

  useDataLoadEffect(
    sitePreview,
    loadSitePreview,
    () => ({
      server,
    }),
    needsLoading => (
      needsLoading &&
      site.enabled
    ),
    [site]
  )

  useDataLoadEffect(siteStats, loadSiteMiniGraphStats, () => ({
    server,
  }))

  const groupedStats = useMemo(
    () => List(groupStats(siteStats && siteStats.getIn(['data', 'transfers']))),
    [siteStats]
  )

  return <ListGroupItem
    className="d-flex flex-wrap align-items-center py-2 px-0 Site"
    style={{ cursor: 'pointer' }}
    onClick={() => history.push(`/sites/${site.server}`)}
  >
    <div
      className={cx('position-absolute rounded-circle align-self-md-center align-self-start mt-md-0 mt-2 ml-n3 Site-status', {
        'is-active': site.enabled,
      })}
    />
    <div className="my-2 mr-md-4 mr-2 rounded Site-preview">
      <SitePreview imageUrl={_get(sitePreview, 'data.url')} />
      <Button
        className={cx('Favorite', {
          'active': site.favorite,
        })}
        onClick={handleToggleFavourite}
      >
        <FontAwesomeIcon icon={faStar} />
      </Button>
    </div>
    <div className="my-2 mr-auto">
      <h2 className="mb-1 text-f-md">{getSiteTitle(site)}</h2>
      <div className="Site-details">
        <a
          href={`https://${site.server}`}
          onClick={handleStopPropagation}
          className="d-sm-inline d-none"
          target="_blank"
          rel="noreferrer noopener"
        >
          https://{site.server}
          <FontAwesomeIcon className="ml-1" size="xs" icon={faExternalLinkAlt} />
        </a>
        <span className="ml-3 pl-3 border-left d-lg-inline d-none border-f-gray13">
          Updated: {parseDate(site.updated).format('MMM D, YYYY')}
        </span>
      </div>
    </div>
    <div className="rounded d-lg-block d-none Site-graphMini" style={{ cursor: 'pointer' }}>
      <StatsMiniChart listData={groupedStats} />
    </div>
    {/*
    <div className="ml-4 rounded-circle d-md-block d-none Site-owner text-center" style={{ paddingTop: 7 }}>
      {userTitle}
    </div>*/}
    <Link
      to={`/sites/${site.server}/browse`}
      onClick={handleStopPropagation}
      className="ml-4 text-center d-md-block d-none Site-storage"
    >
      <FontAwesomeIcon icon={getIconForStorage(site.storage)} size="lg" />
    </Link>
    {/* TODO: This link may have to be new-tab-opening link to site url but will leave as is for testing */}
    <Link
      to={`/sites/${site.server}`}
      className="btn ml-md-5 ml-auto IconButton"
      onClick={handleStopPropagation}
    >
      <FontAwesomeIcon icon={faAngleRight} />
    </Link>
  </ListGroupItem>
}

SiteListItem.propTypes = {
  userTitle: PropTypes.string.isRequired,
  site: ImmutablePropTypes.record.isRequired,
  sitePreviewMap: ImmutablePropTypes.map.isRequired,
  siteMiniGraphStatsMap: ImmutablePropTypes.map.isRequired,
  loadSitePreview: PropTypes.func.isRequired,
  loadSiteMiniGraphStats: PropTypes.func.isRequired,
  updateSiteDetail: PropTypes.func.isRequired,
}

const selector = createStructuredSelector({
  sitePreviewMap: selectSitePreviewMap,
  siteMiniGraphStatsMap: selectSiteMiniGraphStatsMap,
})

const actions = {
  loadSitePreview,
  loadSiteMiniGraphStats,
  updateSiteDetail,
}

export default compose(
  withRouter,
  connect(selector, actions),
)(SiteListItem)
