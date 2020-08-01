import React, { useState, useMemo } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {
  Table, Button,
  UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus, faSortAmountUp, faSortAmountDown, faKey, faEllipsisH,
} from '@fortawesome/free-solid-svg-icons'

import { hasSucceeded } from 'utils/state'
import { useDataLoadEffect } from 'utils/hooks'
import { parseDate } from 'utils/format'
import {
  selectAPIKeyList,
  selectCreateKeyState,
  selectDeleteKeyState,
  loadKeyList,
  createKey,
  deleteKey,
} from 'store/modules/auth'
import Spinner from 'components/common/Spinner'
import APIKeyModal from '../APIKeyModal'
import APIKeyDisplayModal from '../APIKeyDisplayModal'


export function AccountAPIAccess(props) {
  const { apiKeyList, loadKeyList, createKey, deleteKey } = props
  const [openAPIKeyModal, setOpenAPIKeyModal] = useState(false)
  const [showCreatedKey, setShowCreatedKey] = useState(false)
  const [createdKey, setCreatedKey] = useState('')
  const [sortMode, setSortMode] = useState('desc')
  const sortedApiKeyList = useMemo(
    () => {
      let keyList = apiKeyList.data.sortBy(apiKey => apiKey.created)
      if (sortMode === 'desc') {
        keyList = keyList.reverse()
      }
      return keyList
    },
    [apiKeyList, sortMode]
  )

  const handleToggleAPIKeyModal = () => setOpenAPIKeyModal(value => !value)

  const handleToggleAPIKeyDisplayModal = () => setShowCreatedKey(value => !value)

  const handleCreateAPIKey = (data) => {
    handleToggleAPIKeyModal()

    createKey({
      data,
      onSuccess: key => {
        setCreatedKey(key)
        setShowCreatedKey(true)
      }
    })
  }

  const handleDeleteAPIKey = (id) => {
    deleteKey({
      id,
    })
  }

  const handleChangeSort = (ev) => {
    ev.preventDefault()
    setSortMode(value => value === 'desc' ? 'asc' : 'desc')
  }

  useDataLoadEffect(apiKeyList, loadKeyList)

  return <div className="pt-3 pb-5 px-sm-5 px-4">
    <div className="d-flex flex-wrap align-items-center pb-3">
      <h2 className="h6 mr-auto my-3 pr-4">API Access</h2>
      <div>
        <Button
          color="primary"
          onClick={handleToggleAPIKeyModal}
          className="my-2 text-f-md"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Create API Key
        </Button>
      </div>
    </div>

    {
      !hasSucceeded(apiKeyList.state) && <Spinner />
    }

    {
      hasSucceeded(apiKeyList.state) && !apiKeyList.data.size && <div className="text-f-sm">
        No API keys created.
      </div>
    }

    {
      hasSucceeded(apiKeyList.state) && apiKeyList.data.size > 0 && <div className="TableScrollWrapper">
        <Table borderless className="API-keyList">
          <thead className="border-bottom border-f-gray13">
            <tr>
              <th className="pl-0 FilterMenu">
                <Button color="link" className="px-0">
                  API Key
                </Button>
              </th>
              <th className="FilterMenu">
                <Button color="link" className="px-0">
                  Description
                </Button>
              </th>
              <th className="FilterMenu is-active">
                <Button color="link" className="px-0">
                  Created
                  <a href="/" onClick={handleChangeSort}>
                    {
                      sortMode === 'desc' ?
                      <FontAwesomeIcon icon={faSortAmountDown} className="ml-2" /> :
                      <FontAwesomeIcon icon={faSortAmountUp} className="ml-2" />
                    }
                  </a>
                </Button>
              </th>
              <th className="FilterMenu"></th>
            </tr>
          </thead>
          <tbody className="text-f-sm text-f-gray8">
            {
              sortedApiKeyList.map(apiKey => (
                <tr key={apiKey.api_key} className="border-bottom border-f-gray13">
                  <th className="py-4 pl-0 font-weight-normal text-f-gray3 text-f-md">
                    <FontAwesomeIcon icon={faKey} className="mr-3 text-f-color4" />
                    •••••••••••••••••••••••••{apiKey.api_key.substr(-4, 4)}
                  </th>
                  <td className="py-4">
                    {apiKey.memo}
                  </td>
                  <td className="py-4">
                    {parseDate(apiKey.created).fromNow()}
                  </td>
                  <td className="py-3 pr-0">
                    <UncontrolledDropdown direction="down">
                      <DropdownToggle color="link" className="btn py-1 IconButton">
                        <FontAwesomeIcon icon={faEllipsisH} />
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem onClick={handleDeleteAPIKey.bind(this, apiKey.id)}>
                          Revoke
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </Table>
      </div>
    }

    <APIKeyModal
      open={openAPIKeyModal}
      onToggle={handleToggleAPIKeyModal}
      onSubmit={handleCreateAPIKey}
    />

    <APIKeyDisplayModal
      open={showCreatedKey}
      onToggle={handleToggleAPIKeyDisplayModal}
      apiKey={createdKey}
    />
  </div>
}

AccountAPIAccess.propTypes = {
  apiKeyList: ImmutablePropTypes.record.isRequired,
  createKeyState: PropTypes.string.isRequired,
  deleteKeyState: PropTypes.string.isRequired,
  loadKeyList: PropTypes.func.isRequired,
  createKey: PropTypes.func.isRequired,
  deleteKey: PropTypes.func.isRequired,
}

const selector = createStructuredSelector({
  apiKeyList: selectAPIKeyList,
  createKeyState: selectCreateKeyState,
  deleteKeyState: selectDeleteKeyState,
})

const actions = {
  loadKeyList,
  createKey,
  deleteKey,
}

export default compose(
  connect(selector, actions),
)(AccountAPIAccess)
