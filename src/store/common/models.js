import { List, Record } from 'immutable'

import {
  REQUEST_STATUS,
  EXPIRATION_STATUS,
  DEFAULT_PAGE_SIZE,
} from 'constants/common'


export const ListData = Record({
  data: List(),
  state: REQUEST_STATUS.INITIAL,
  statusCode: -1,
  expirationStatus: EXPIRATION_STATUS.NOT_EXPIRED,
  lastRequestPayload: null,
}, 'ListData')

export const PaginatedListData = Record({
  data: List(),
  state: REQUEST_STATUS.INITIAL,
  statusCode: -1,
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  count: 0,
  expirationStatus: EXPIRATION_STATUS.NOT_EXPIRED,
  lastRequestPayload: null,
}, 'PaginatedListData')

export const DetailData = Record({
  data: null,
  state: REQUEST_STATUS.INITIAL,
  statusCode: -1,
  expirationStatus: EXPIRATION_STATUS.NOT_EXPIRED,
  lastRequestPayload: null,
}, 'DetailData')
