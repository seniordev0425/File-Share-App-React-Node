import React from 'react'
import { Container, Button } from 'reactstrap'
import { Link } from 'react-router-dom'


export default function ErrorReportDone() {
  return <Container>
    <div className="mt-5 mx-auto text-center text-f-sm" style={{ maxWidth: '29rem' }}>
      <h5 className="mb-4">Thank you for submitting an error report.</h5>

      <div className="mb-5">
        Thank you for submitting your error report. Your report will help us figure out what went wrong and improve Fast.io for you and all of our other users.
      </div>

      <Button
        color="primary"
        tag={Link}
        to="/"
        className="text-f-sm px-4 py-2"
      >
        Return to your Dashboard
      </Button>
    </div>
  </Container>
}
