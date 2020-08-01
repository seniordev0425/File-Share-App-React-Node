import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faAngleLeft } from '@fortawesome/free-solid-svg-icons'


export function AnalyticsProfileDeleted(props) {
  const { match } = props
  const profileName = match.params.name

  return <>
    <Button
      outline
      color="primary"
      className="border-0 mt-3 ml-3 BackButton text-f-md"
      tag={Link}
      to="/account/analytics"
    >
      <FontAwesomeIcon icon={faAngleLeft} className="mr-2" />
      Back to Analytics
    </Button>

    <section className="p-5 Profile-deleted">
      <div className="d-flex flex-column text-center mx-auto" style={{ maxWidth: '45rem' }}>
        <h1 className="h4 mb-4">
          <FontAwesomeIcon icon={faCheckCircle} className="text-f-color2 mr-2" />
          Successfully deleted {profileName}
        </h1>
        <p className="mb-5">
          The Google Analytics profile “{profileName}” was successfully deleted and has been removed
          from all websites using it as an assigned profile.
        </p>
        <Button
          color="primary"
          className="ml-auto"
          tag={Link}
          to="/account/analytics"
        >
          Done
        </Button>
      </div>
    </section>
  </>
}

AnalyticsProfileDeleted.propTypes = {
  match: PropTypes.object.isRequired,
}

export default AnalyticsProfileDeleted
