import React from 'react'
import cx from 'classnames'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Row, Col, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faExternalLinkAlt, faCog } from '@fortawesome/free-solid-svg-icons'

import { getIconForStorage } from 'utils/icons'
import SitePreview from 'components/sites/SitePreview'


export default function SiteTitle(props) {
  const { site, previewUrl, updateSiteDetail } = props

  const handleToggleFavorite = () => {
    updateSiteDetail({
      server: site.server,
      data: {
        favorite: !site.favorite
      }
    })
  }

  return <section className="px-5 pt-5 pb-1">
    <Row>
      <Col lg="12">
        <div className="d-md-flex flex-wrap align-items-start">
          <div className="d-inline-block mr-md-4 mr-3 mb-4 rounded Site-preview align-top">
            <SitePreview imageUrl={previewUrl} />
          </div>
          <div className="d-inline-block mb-4">
            <h1 className="d-flex my-1 h4 align-items-center">
              {site.desc}
              <button
                className={cx("btn py-0 px-1 ml-1 Favorite", {
                  active: site.favorite
                })}
                aria-label="Toggle site as favorite"
                onClick={handleToggleFavorite}
              >
                <FontAwesomeIcon icon={faStar} />
              </button>
            </h1>
            <div className="Site-details">
              <a href={`https://${site.server}`} className="align-bottom" target="_blank" rel="noopener noreferrer">
                https://{site.server}
                <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" className="ml-1" />
              </a>
            </div>
          </div>
          <div className="d-flex align-items-center ml-md-auto mb-4">
            <div className="ml-auto rounded-circle d-none d-md-block Site-owner"></div>
            <div className="ml-4 text-center d-none d-md-block Site-storage">
              <FontAwesomeIcon icon={getIconForStorage(site.storage)} size="lg" />
            </div>
            <Button
              color="primary"
              className="ml-0 ml-md-4"
              to={`/sites/${site.server}/settings`}
              tag={Link}
            >
              <FontAwesomeIcon icon={faCog} className="mr-2" />
              Site Settings
            </Button>
          </div>
        </div>
      </Col>
    </Row>
  </section>
}

SiteTitle.propTypes = {
  site: ImmutablePropTypes.record.isRequired,
  previewUrl: PropTypes.string,
  updateSiteDetail: PropTypes.func.isRequired,
}
