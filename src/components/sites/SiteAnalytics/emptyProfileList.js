import React from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Button } from 'reactstrap'


function EmptyProfileList(props) {
  return <Row className="flex-md-row flex-column pt-2">
    <Col xs="auto">
      <div className="mt-2 mr-4 mb-4 GAgraphic"></div>
    </Col>
    <Col style={{ maxWidth: '40rem' }}>
      <h2 className="h5 mb-5 pt-2">
        Connect Google Analytics
      </h2>
      <p>
        Google Analytics can only track web pages. Fast can track everything including files and images.
        You can still use Google Analytics by adding their Javascript directly to your codebase or
        you can set up Fast's Google Analytics integration.
      </p>
      <p className="mb-5">
        Fast can send data to Google Analytics from the actual activity on your site,
        no Javascript tags required. Fast sends actual transfer data insuring you get the most accurate reporting
        from your site and feeds that data directly into Google Analytics for you.
      </p>
      <Button color="primary" tag={Link} to="/analytics/create">
        Add Google Analytics
      </Button>
    </Col>
  </Row>
}

export default EmptyProfileList
