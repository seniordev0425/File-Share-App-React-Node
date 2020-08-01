import React from 'react'
import { Button } from 'reactstrap'


function FlaggedAlert() {
  return <section className="px-sm-5 px-4 py-4">
    <div className="d-flex flex-wrap align-items-center py-3 px-4 rounded-lg bg-f-color6-light text-f-sm">
      <span className="mr-auto pr-4 py-2 text-f-color6">
        This site has been flagged by Virus Total as disabled for containing dangerous content.
      </span>
      <div className="w-100 d-sm-none d-block" />
      <Button
        color="danger"
        outline
        size="sm"
        className="text-nowrap my-2 text-f-sm"
        href="https://www.fast.io/support"
        target="_blank"
        rel="noopener noreferrer"
      >
        Contact Support
      </Button>
    </div>
  </section>
}

export default FlaggedAlert
