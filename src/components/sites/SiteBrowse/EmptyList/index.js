import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Button } from 'reactstrap'

import { hasSucceeded } from 'utils/state'
import { useDataLoadEffect } from 'utils/hooks'
import {
  selectPathDetails,
  loadPathDetails,
} from 'store/modules/siteContent'
import Spinner from 'components/common/Spinner'


export function EmptyList(props) {
  const {
    server, path, storage,
    pathDetails, loadPathDetails,
  } = props

  useDataLoadEffect(
    pathDetails,
    loadPathDetails,
    () => ({
      server,
      path,
    })
  )

  const loading = !storage || !hasSucceeded(pathDetails.state)

  if (loading) {
    return <Spinner />
  }

  return <div className="py-5 text-center border-bottom text-f-md border-f-gray13">
    <p className="mb-4">
      There are no files in this folder. To add files or folders, please go to your {storage.display} folder.
    </p>
    <Button
      color="primary"
      className="text-f-md"
      tag="a"
      href={pathDetails.data.details.origin_url}
      target="_blank"
      rel="noopener noreferrer"
    >
      Open this folder in {storage.display}
    </Button>
  </div>
}

EmptyList.propTypes = {
  server: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  storage: ImmutablePropTypes.record,
  pathDetails: ImmutablePropTypes.record.isRequired,
  loadPathDetails: PropTypes.func.isRequired,
}

const selector = createStructuredSelector({
  pathDetails: selectPathDetails,
})

const actions = {
  loadPathDetails,
}

export default compose(
  connect(selector, actions),
)(EmptyList)
