import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Link } from 'react-router-dom'
import {
  ListGroupItem, Row, Col, UncontrolledTooltip,
  UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap'
import cx from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFolder, faFileImage, faEllipsisH,
  faExternalLinkAlt, faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons'

import { BACK_END_LANGUAGE_EXTENSIONS } from 'constants/common'
import { formatSize, parseDate } from 'utils/format'


export default function FileItem(props) {
  const {
    pathGenerator, record, storageName,
    onSyncWithStorage, onPushToCDN,
  } = props

  const handleCopyUrl = () => navigator.clipboard.writeText(record.url)

  const actionMenuAvailable = !(
    record.filtered ||
    record.toobig
  )

  const filenameParts = record.name.split('.').map(p => p.trim()).filter(p => !!p)
  const isNotExecutable = (
    filenameParts.length > 1 &&
    BACK_END_LANGUAGE_EXTENSIONS.indexOf(filenameParts[filenameParts.length - 1]) >= 0
  )

  let tooltipText = ''
  if (record.filtered) {
    tooltipText = 'This file is blocked by a filter. Go to your site settings to change filter settings.'
  } else if (record.toobig) {
    tooltipText = 'This file is over 500MB and is not supported by Fast.io. Only files under 500MB are supported.'
  }
  const tooltipId = 'tooltip-' + record.name.replace(/[^A-Za-z0-9]/g, '-')

  let warningTooltipText = ''
  if (isNotExecutable) {
    warningTooltipText = (
      'This file appears to be backend code designed to run on a web server. ' +
      'Fast.io can not run backend code. You can link to this file, but it will not execute.'
    )
  }
  const warningTooltipId = tooltipId + '-warning'

  const fileName = <>
    <FontAwesomeIcon
      icon={record.type === 'folder' ? faFolder : faFileImage}
      className={cx('mr-2', {
        'text-f-color1': record.type === 'folder',
        'text-f-gray6': (
          record.type !== 'folder' &&
          !record.filtered &&
          !record.toobig &&
          !isNotExecutable
        ),
      })}
      size="lg"
    />
    {record.name}
  </>

  return <ListGroupItem
    className={cx('px-0', {
      'file-filter-excluded': record.filtered,
      'file-filter-too-large': record.toobig,
      'file-type-warning': warningTooltipText,
    })}
  >
    <Row className="align-items-center px-3">
      <Col lg="5" md="8" xs="auto" className="py-2 text-truncate">
        {
          record.type === 'folder' ?
          <Link to={pathGenerator(record.path)} style={{ color: 'inherit' }}>
            {fileName}
          </Link> :
          <a href={record.url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
            {fileName}
          </a>
        }

        {
          /* eslint-disable jsx-a11y/anchor-is-valid */
          warningTooltipText && <a className="btn">
            <FontAwesomeIcon
              id={warningTooltipId}
              icon={faExclamationTriangle}
            />
            <UncontrolledTooltip
              placement="top"
              target={warningTooltipId}
            >
              {warningTooltipText}
            </UncontrolledTooltip>
          </a>
        }
      </Col>
      <Col xs="3" className="d-lg-block d-none py-2 text-right">
        {record.type === 'folder'
          ? `Synced: ${parseDate(record.cached).format('M/D/YY, h:mma')}`
          : `Modified: ${parseDate(record.modified).format('M/D/YY, h:mma')}`
        }
      </Col>
      <Col xs="2" className="d-md-block d-none py-2 text-right">
        {
          record.type === 'folder' ?
          <span dangerouslySetInnerHTML={{ __html: '&mdash;' }} />
          :
          formatSize(record.size, true, 2)
        }
      </Col>
      <Col md="2" xs className="text-right">
        {
          actionMenuAvailable && <UncontrolledDropdown>
            <DropdownToggle tag="a" className="btn IconButton">
              <FontAwesomeIcon icon={faEllipsisH} />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem onClick={onSyncWithStorage}>
                Sync with cloud storage
              </DropdownItem>
              <DropdownItem onClick={onPushToCDN}>
                Push to CDN
              </DropdownItem>
              <DropdownItem
                tag="a"
                href={record.origin_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                View in {storageName}
                <FontAwesomeIcon icon={faExternalLinkAlt} size="sm" className="ml-2" />
              </DropdownItem>
              <DropdownItem
                tag="a"
                href={record.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                View hosted
                <FontAwesomeIcon icon={faExternalLinkAlt} size="sm" className="ml-2" />
              </DropdownItem>
              <DropdownItem
                onClick={handleCopyUrl}
              >
                Copy link
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        }

        {
          /* eslint-disable jsx-a11y/anchor-is-valid */
          tooltipText && <a className="btn IconButton">
            <FontAwesomeIcon
              id={tooltipId}
              icon={faExclamationTriangle}
            />
            <UncontrolledTooltip
              placement="top"
              target={tooltipId}
            >
              {tooltipText}
            </UncontrolledTooltip>
          </a>
        }
      </Col>
    </Row>
  </ListGroupItem>
}

FileItem.propTypes = {
  pathGenerator: PropTypes.func.isRequired,
  record: ImmutablePropTypes.record.isRequired,
  storageName: PropTypes.string.isRequired,
  onSyncWithStorage: PropTypes.func.isRequired,
  onPushToCDN: PropTypes.func.isRequired,
}
