import React, { useMemo } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {
  UncontrolledDropdown, DropdownToggle, DropdownMenu,
} from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons'

import { JOB_STATES } from 'constants/common'
import { isPending } from 'utils/state'
import { useDataLoadEffect } from 'utils/hooks'
import {
  selectChangeStatusList,
  selectPrecacheStatusList,
  loadAllChangesStatusList,
  loadPrecacheStatusList,
  runStaleChanges,
} from 'store/modules/siteUpdates'
import Spinner from 'components/common/Spinner'
import ChangeItem from './ChangeItem'
import WarningItem from './WarningItem'


export function SyncStatusDropdown(props) {
  const {
    changeStatusList, loadAllChangesStatusList,
    precacheStatusList, loadPrecacheStatusList,
    runStaleChanges,
  } = props

  const handleClickComplete = server => runStaleChanges({
    server,
  })

  useDataLoadEffect(changeStatusList, loadAllChangesStatusList)

  useDataLoadEffect(precacheStatusList, loadPrecacheStatusList)

  const serversWithJobs = useMemo(() => {
    const servers = []

    changeStatusList.data.forEach(change => {
      if (servers.indexOf(change.server) === -1) {
        servers.push(change.server)
      }
    })

    precacheStatusList.data.forEach(precache => {
      if (servers.indexOf(precache.server) === -1) {
        servers.push(precache.server)
      }
    })

    return servers
  }, [changeStatusList, precacheStatusList])

  const serverStatusMap = useMemo(() => {
    const statusMap = {}

    serversWithJobs.forEach(server => {
      statusMap[server] = {
        datetime: '',
        state: JOB_STATES.complete,
        syncCount: 0,
        warning: false,
        stale: false,
      }
    })

    changeStatusList.data.forEach(change => {
      statusMap[change.server].datetime = (
        statusMap[change.server].datetime && statusMap[change.server].datetime >= change.updated ?
        statusMap[change.server].datetime :
        change.updated
      )
      if (!change.complete) {
        statusMap[change.server].state = JOB_STATES.syncing
      }
      statusMap[change.server].syncCount += 1
      statusMap[change.server].stale = statusMap[change.server].stale || change.stale
    })

    precacheStatusList.data.forEach(precache => {
      statusMap[precache.server].datetime = (
        statusMap[precache.server].datetime && statusMap[precache.server].datetime >= precache.current.updated ?
        statusMap[precache.server].datetime :
        precache.current.updated
      )
      if (precache.status !== 'completed') {
        statusMap[precache.server].state = JOB_STATES.pushing
      }
      statusMap[precache.server].stale = statusMap[precache.server].stale || precache.stale
      if (precache.status === 'unknown') {
        statusMap[precache.server].warning = true
      }
    })

    return statusMap
  }, [changeStatusList, precacheStatusList, serversWithJobs])

  const jobCountInProgress = useMemo(() => {
    let count = 0

    Object.keys(serverStatusMap).forEach(server => {
      if (serverStatusMap[server].state !== JOB_STATES.complete) {
        count += 1
      }
    })

    return count
  }, [serverStatusMap])

  const pendingChangesExist = useMemo(() => {
    return changeStatusList.data.findIndex(change => !change.complete && !change.stale) >= 0
  }, [changeStatusList])

  const pending = isPending(changeStatusList.state) || isPending(precacheStatusList.state)

  return <UncontrolledDropdown
    className="ml-2 UpdatesMenu"
  >
    <div className="position-absolute rounded-circle UpdatesMenu-status" />
    <DropdownToggle nav className="btn IconButton">
      <FontAwesomeIcon icon={faSyncAlt} spin={jobCountInProgress > 0} />
    </DropdownToggle>
    <DropdownMenu right>
      {
        pendingChangesExist && <div
          className="small float-right mt-2 mr-3 text-white"
          style={{ float: 'right' }}
        >
          Pending Changes &#8226;
        </div>
      }

      <h1 className="mb-0 mt-n2 p-3 text-white rounded-top border-bottom border-f-gray13 bg-f-gray3 text-f-md">
        Site Updates <span className="text-f-gray8">({serversWithJobs.length})</span>
      </h1>

      <div style={{ maxHeight: 'calc(100vh - 150px)', overflowY: 'auto' }}>
        {
          pending && <Spinner />
        }

        {
          !pending && !serversWithJobs.length && <span
            className="d-block pt-4 px-4 pb-3 text-center"
          >
            No changes in progress
          </span>
        }

        {
          !pending && !!serversWithJobs.length && <div>
            {
              serversWithJobs.filter(
                server => !serverStatusMap[server].warning && !serverStatusMap[server].stale
              ).map((server, index) => <ChangeItem
                key={`${server}_${index}`}
                server={server}
                datetime={serverStatusMap[server].datetime}
                state={serverStatusMap[server].state}
                syncCount={serverStatusMap[server].syncCount}
              />)
            }

            {
              serversWithJobs.filter(
                server => serverStatusMap[server].warning && !serverStatusMap[server].stale
              ).map((server, index) => <WarningItem
                key={`${server}_${index}`}
                server={server}
                datetime={serverStatusMap[server].datetime}
                stale={false}
              />)
            }

            {
              serversWithJobs.filter(
                server => serverStatusMap[server].stale
              ).map((server, index) => <WarningItem
                key={`${server}_${index}`}
                server={server}
                datetime={serverStatusMap[server].datetime}
                stale
                onClickComplete={handleClickComplete}
              />)
            }
          </div>
        }
      </div>
    </DropdownMenu>
  </UncontrolledDropdown>
}

SyncStatusDropdown.propTypes = {
  changeStatusList: ImmutablePropTypes.record.isRequired,
  precacheStatusList: ImmutablePropTypes.record.isRequired,
  loadAllChangesStatusList: PropTypes.func.isRequired,
  loadPrecacheStatusList: PropTypes.func.isRequired,
  runStaleChanges: PropTypes.func.isRequired,
}

const selector = createStructuredSelector({
  changeStatusList: selectChangeStatusList,
  precacheStatusList: selectPrecacheStatusList,
})

const actions = {
  loadAllChangesStatusList,
  loadPrecacheStatusList,
  runStaleChanges,
}

export default compose(
  connect(selector, actions),
)(SyncStatusDropdown)
