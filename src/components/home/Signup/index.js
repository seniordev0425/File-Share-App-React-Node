import React from 'react'
import PropTypes from 'prop-types'
import { withRouter, Link } from 'react-router-dom'
import { Row, Col, Button } from 'reactstrap'
import { FontAwesomeIcon, } from '@fortawesome/react-fontawesome'
import { faAngleRight, faArrowRight } from '@fortawesome/free-solid-svg-icons'


function Signup(props) {
  const { history } = props

  return <section className="mx-auto" style={{ maxWidth: '48rem' }}>
    <Row noGutters className="py-5 px-sm-5 px-4 DetailBlock text-md-left text-center">
      <Col md className="d-flex flex-column justify-content-center mb-md-0 mb-4">
        <h1 className="h5 mb-4 font-weight-bold">Welcome to Fast.io</h1>
        <p className="text-f-md text-f-gray3">
          Start by signing in to your preferred cloud storage. This is where we will keep all of your website files.
        </p>
        <p className="text-f-md text-f-gray3">
          Already have an account?
          <Link
            to="/login"
            className="text-nowrap ml-1"
          >
            Log in
            <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
          </Link>
        </p>
      </Col>
      <Col xs="2" className="d-md-flex d-none align-items-center justify-content-center">
        <div className="position-absolute h-100 border-right border-f-gray13"></div>
        <div
          className="
            d-flex
            position-relative
            align-items-center
            justify-content-center
            rounded-circle border
            bg-f-gray15
            border-f-gray13"
          style={{ width: '3rem', height: '3rem' }}>
          <FontAwesomeIcon icon={faAngleRight} className="text-f-gray8" />
        </div>
      </Col>
      <Col md className="d-flex flex-column SignUp-storage">
        <Button
          color="link"
          className="mb-1 py-3 bg-f-gray15 text-f-sm SignUp-dropbox"
          onClick={() => history.push('/storage/continue/dropbox')}
        >
          Dropbox
        </Button>
        <Button
          color="link"
          className="my-1 py-3 bg-f-gray15 text-f-sm SignUp-googledrive"
          onClick={() => history.push('/storage/continue/googledrive')}
        >
          Google Drive
        </Button>
        <Button
          color="link"
          className="my-1 py-3 bg-f-gray15 text-f-sm SignUp-box"
          onClick={() => history.push('/storage/continue/box')}
        >
          Box
        </Button>
        <Button
          color="link"
          className="my-1 py-3 bg-f-gray15 text-f-sm SignUp-mediafire"
          onClick={() => history.push('/storage/continue/mediafire')}
        >
          MediaFire
        </Button>
        <Button
          color="link"
          className="mt-1 py-3 bg-f-gray15 text-f-sm SignUp-onedrive"
          onClick={() => history.push('/storage/continue/onedrive')}
        >
          OneDrive
        </Button>
      </Col>
    </Row>
    <p className="py-5 px-md-5 px-0 text-center text-f-sm">
      By creating an account, you agree to our <a href="/terms/" target="_blank" rel="noopener noreferrer">Terms of Service</a>, <a href="/privacy-policy/" target="_blank" rel="noopener noreferrer">Privacy Policy</a>, and use of cookies
      for functional, debug, and analytical purposes.
    </p>
  </section>
}

Signup.propTypes = {
  history: PropTypes.object.isRequired,
}

export default withRouter(Signup)
