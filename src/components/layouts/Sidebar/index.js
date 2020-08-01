import React, { useState } from 'react'
import cx from 'classnames'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCog,
  faHome,
  faLifeRing,
  faPlus,
  faStar,
  faTimes
} from '@fortawesome/free-solid-svg-icons'
import { Button, ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from 'react-router-dom';

import PlatformStatusModal from 'components/common/PlatformStatusModal'
import Spinner from 'components/common/Spinner'
import { APP_VERSION } from 'constants/env'
import { hasSucceeded } from 'utils/state'
import {
  selectSiteList,
  loadSiteList,
  updateSiteDetail,
} from 'store/modules/sites'
import {
  loadUser,
  selectUser,
  selectUserTitle,
} from 'store/modules/user'
import { getSiteTitle } from 'utils/format'
import { useDataLoadEffect } from 'utils/hooks'

export const DEFAULT_VISIBLE_SITES_COUNT = 5

export function Sidebar({
  open,
  onClose,
  siteList,
  loadSiteList,
  loadUser,
  updateSiteDetail,
  user,
  userTitle,
  systemStatus,
}) {
  const [showMore, setShowMore] = useState(true)
  const [showPlatformStatusModal, setShowPlatformStatusModal] = useState(false)

  const handleToggleFavorite = (site) => (event) => {
    updateSiteDetail({
      server: site.server,
      data: {
        favorite: !site.favorite,
      },
    })
  }

  const handleShowMoreLess = (event) => {
    event.preventDefault()
    setShowMore(!showMore)
    onClose()
  }

  const handleClickVersion = (ev) => {
    ev.preventDefault()

    setShowPlatformStatusModal(true)
  }

  const handleClosePlatformStatusModal = () => setShowPlatformStatusModal(false)

  const sortedSiteList = siteList.data.sort(site => site.name)
  const mySiteList = showMore ? sortedSiteList.slice(0, DEFAULT_VISIBLE_SITES_COUNT) : sortedSiteList
  const favoriteSiteList = sortedSiteList.filter(site => site.favorite)

  useDataLoadEffect(siteList, loadSiteList)

  useDataLoadEffect(user, loadUser)

  return (
    <>
      <nav id="Sidebar" className={cx('d-flex', 'flex-column', 'text-f-md', { 'is-active': open })}>
        <div className="flex-grow-1 overflow-auto">
          <section className="d-flex align-items-start mb-3">
            <h1 className="h6 mb-0 p-4 text-white text-break">{userTitle}</h1>
            <button id="Sidebar-close" type="button" className="btn m-3 ml-auto text-white" onClick={onClose}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </section>
          <section className="mb-5">
            <ListGroup flush onClick={onClose}>
              <ListGroupItem>
                <Link to="/sites">
                  <FontAwesomeIcon icon={faHome} size="lg" className="mr-3" aria-hidden="true" />
                  Home
                </Link>
              </ListGroupItem>
              <ListGroupItem>
                <Link to="/account">
                  <FontAwesomeIcon icon={faCog} size="lg" className="mr-3" aria-hidden="true" />
                  Account Settings
                </Link>
              </ListGroupItem>
              <ListGroupItem>
                <Link to="/sites/create">
                  <FontAwesomeIcon icon={faPlus} size="lg" className="mr-3" aria-hidden="true" />
                  Create Site
                </Link>
              </ListGroupItem>
            </ListGroup>
          </section>
          {favoriteSiteList.size > 0 && (
            <section className="Sidebar-sites Sidebar__favorites mb-5">
              <h2 className="px-4">Favorites</h2>
              {
                hasSucceeded(siteList.state) ? (
                  <ListGroup flush>
                    {favoriteSiteList.map(site => (
                      <ListGroupItem key={site.server}>
                        <Link to={`/sites/${site.server}`} onClick={onClose}>
                          {getSiteTitle(site)}
                        </Link>
                        <button
                          type="button"
                          className="btn ml-auto rounded-0 Favorite"
                          onClick={handleToggleFavorite(site)}>
                          <FontAwesomeIcon icon={faStar} />
                        </button>
                      </ListGroupItem>
                    ))}
                  </ListGroup>
                ) : (
                  <Spinner />
                )
              }
            </section>
          )}
          <section className="Sidebar-sites Sidebar__yoursites mb-5">
            <h2 className="px-4">Your Sites</h2>
            {
              hasSucceeded(siteList.state) ? (
                <ListGroup flush>
                  {mySiteList.map(site => (
                    <ListGroupItem key={site.server}>
                      <Link to={`/sites/${site.server}`} onClick={onClose}>
                        {getSiteTitle(site)}
                      </Link>
                      <button
                        type="button"
                        className={cx('btn', 'ml-auto', 'rounded-0', 'Favorite', { 'active': site.favorite })}
                        onClick={handleToggleFavorite(site)}>
                        <FontAwesomeIcon icon={faStar} />
                      </button>
                    </ListGroupItem>
                  ))}
                  {DEFAULT_VISIBLE_SITES_COUNT < siteList.data.size && (
                    <ListGroupItem>
                      <a href="/" onClick={handleShowMoreLess}>
                        {showMore ? 'More' : 'Less'}...
                      </a>
                    </ListGroupItem>
                  )}
                </ListGroup>
              ) : (
                <Spinner />
              )
            }
          </section>
        </div>
        <div className="d-flex align-items-center">
          <a href="/" className="px-4 py-3 mr-auto text-white">
            <FontAwesomeIcon icon={faLifeRing} size="lg" className="mr-3" />Help
          </a>
          <Button
            size="sm"
            outline
            color="secondary"
            className="m-3 FastVersion"
            onClick={handleClickVersion}
          >
            v {APP_VERSION}
          </Button>
        </div>
      </nav>
      <div className="Overlay" onClick={onClose} />
      <PlatformStatusModal
        open={showPlatformStatusModal}
        onToggle={handleClosePlatformStatusModal}
        systemStatus={systemStatus}
        frontendVersion={APP_VERSION}
      />
    </>
  )
}

Sidebar.propTypes = {
  siteList: ImmutablePropTypes.record.isRequired,
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  loadSiteList: PropTypes.func.isRequired,
  loadUser: PropTypes.func.isRequired,
  updateSiteDetail: PropTypes.func.isRequired,
  user: ImmutablePropTypes.record.isRequired,
  systemStatus: ImmutablePropTypes.record.isRequired,
}

const selector = createStructuredSelector({
  siteList: selectSiteList,
  user: selectUser,
  userTitle: selectUserTitle,
})

const actions = {
  loadSiteList,
  loadUser,
  updateSiteDetail,
}

export default compose(
  connect(selector, actions),
)(Sidebar)
