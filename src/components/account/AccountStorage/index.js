import React, { useEffect, useState } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {
  Row, Col, Button,
  UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus, faLink, faEllipsisH,
} from '@fortawesome/free-solid-svg-icons'

import { isPending, hasSucceeded } from 'utils/state'
import { useDataLoadEffect, usePreviousValue } from 'utils/hooks'
import {
  selectUser,
} from 'store/modules/user'
import {
  selectStorageList,
  selectMyStorageList,
  selectStorageDetailMap,
  selectUnlinkStorageState,
  loadStorageList,
  loadMyStorageList,
  loadStorageDetailToMap,
  unlinkStorage,
} from 'store/modules/storage'
import Spinner from 'components/common/Spinner'
import TFAMark from 'components/common/TFAMark'
import ReconnectStorageModal from './reconnectStorageModal'


export function AccountStorage(props) {
  const {
    user,
    storageList, loadStorageList,
    myStorageList, loadMyStorageList,
    storageDetailMap, loadStorageDetailToMap,
    unlinkStorageState, unlinkStorage,
  } = props
  const [reconnecting, setReconnecting] = useState(false)
  const [reconnectingStorage, setReconnectingStorage] = useState('')
  const [loadStorageDetailTimer, setLoadStorageDetailTimer] = useState(null)

  const handleUnlinkStorage = storageName => unlinkStorage({
    storage: storageName,
  })

  const handleClickReauthorize = storageName => {
    setReconnecting(true)
    setReconnectingStorage(storageName)
  }

  const loadMyStorageDetails = () => {
    const timer = setTimeout(() => {
      myStorageList.data.forEach(storageRecord => {
        loadStorageDetailToMap({
          storage: storageRecord.name,
        })
      })
    }, 2000)
    setLoadStorageDetailTimer(timer)
  }

  useDataLoadEffect(storageList, loadStorageList)

  useDataLoadEffect(myStorageList, loadMyStorageList)

  usePreviousValue(myStorageList, prev => {
    if (
      hasSucceeded(myStorageList.state) &&
      !hasSucceeded(prev.state)
    ) {
      loadMyStorageDetails()
    }
  })

  useEffect(() => {
    if (hasSucceeded(myStorageList.state)) {
      loadMyStorageDetails()
    }

    return () => {
      if (loadStorageDetailTimer) {
        clearTimeout(loadStorageDetailTimer)
      }
    }
  }, [])

  const loaded = hasSucceeded(storageList.state) && hasSucceeded(myStorageList.state)

  let unlinkedStorageList
  if (loaded) {
    unlinkedStorageList = storageList.data.filter(storage => !myStorageList.data.find(
      myStorage => myStorage.name === storage.name
    ))
  }

  return <div>
    {
      !loaded && <Spinner />
    }

    {
      loaded && <div className="pt-3 pb-5 px-sm-5 px-4">
        <div className="linkedStorages pb-5" style={{ maxWidth: '50rem' }}>
          <h2 className="h6 pt-3 pb-4 mr-auto">Cloud Storage</h2>
          {
            myStorageList.data.map(storage => (
              <div
                key={storage.name}
                className="d-flex flex-wrap align-items-center rounded-lg py-2 px-3 mb-3 text-f-md text-f-gray8 bg-f-gray15"
              >
                <div className={`my-2 mr-3 shadow-sm rounded-circle bg-white Storage-${storage.name}`} />
                <div className="my-2 pr-3">
                  <h3 className="my-1 text-f-md">{storage.display}</h3>
                  <div className="my-1 text-f-sm">
                    {
                      storageDetailMap.getIn([storage.name, 'data', 'email'], '')
                    }
                  </div>
                </div>
                <div className="w-100 border-bottom mt-2 mb-1 d-sm-none d-block border-f-gray12"></div>
                <div className="ml-auto">
                  <div
                    className="d-inline-block px-3 py-1 my-2 mr-2 rounded-pill text-white text-uppercase font-weight-bold bg-f-color2"
                    style={{ fontSize: '.5rem' }}
                  >
                    <FontAwesomeIcon icon={faLink} className="mr-1" />
                    Connected
                  </div>
                  <UncontrolledDropdown className="d-inline-block my-2">
                    <DropdownToggle tag="button" className="btn IconButton">
                      <FontAwesomeIcon icon={faEllipsisH} />
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem
                        onClick={() => handleUnlinkStorage(storage.name)}
                        disabled={isPending(unlinkStorageState)}
                      >
                        Disconnect
                        <TFAMark
                          show={user.data && user.data['2factor']}
                          style={{ verticalAlign: '5%' }}
                        />
                      </DropdownItem>
                      <DropdownItem
                        onClick={() => handleClickReauthorize(storage.name)}
                      >
                        Re-authorize
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div>
              </div>
            ))
          }
        </div>

        <div className="unlinkedStorages pb-5" style={{ maxWidth: '75rem' }}>
          <h2 className="h6 pt-3 pb-4 mr-auto">Add Cloud Storage</h2>
          <Row noGutters>
            {
              unlinkedStorageList.map(storage => (
                <Col key={storage.name} sm="3" style={{ minWidth: '13rem' }}>
                  <div className="d-flex flex-wrap flex-sm-column align-items-center rounded-lg py-2 px-3 mb-3 mr-sm-3 bg-f-gray15">
                    <div className={`my-2 mr-sm-0 mr-3 shadow-sm rounded-circle bg-white Storage-${storage.name}`}></div>
                    <div className="my-2 mx-sm-2 ml-0 mr-auto">
                      <h3 className="m-0 text-f-md">{storage.display}</h3>
                    </div>
                    <div className="w-100 border-bottom mt-2 mb-1 d-sm-block border-f-gray12"></div>
                    <Button
                      color="link"
                      className="my-1 ml-sm-0 ml-auto px-0 text-f-sm"
                      tag={Link}
                      to={`/storage/continue/${storage.name}`}
                    >
                      <FontAwesomeIcon icon={faPlus} className="mr-2" />
                      Connect
                    </Button>
                  </div>
                </Col>
              ))
            }
          </Row>
        </div>

        <ReconnectStorageModal
          open={reconnecting}
          storage={reconnectingStorage}
        />
      </div>
    }
  </div>
}

AccountStorage.propTypes = {
  user: ImmutablePropTypes.record.isRequired,
  storageList: ImmutablePropTypes.record.isRequired,
  myStorageList: ImmutablePropTypes.record.isRequired,
  storageDetailMap: ImmutablePropTypes.map.isRequired,
  unlinkStorageState: PropTypes.string.isRequired,
  loadStorageList: PropTypes.func.isRequired,
  loadMyStorageList: PropTypes.func.isRequired,
  loadStorageDetailToMap: PropTypes.func.isRequired,
  unlinkStorage: PropTypes.func.isRequired,
}

const selector = createStructuredSelector({
  user: selectUser,
  storageList: selectStorageList,
  myStorageList: selectMyStorageList,
  storageDetailMap: selectStorageDetailMap,
  unlinkStorageState: selectUnlinkStorageState,
})

const actions = {
  loadStorageList,
  loadMyStorageList,
  loadStorageDetailToMap,
  unlinkStorage,
}

export default compose(
  connect(selector, actions),
)(AccountStorage)
