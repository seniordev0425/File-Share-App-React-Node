import { Record } from 'immutable'

import { ListData } from 'store/common/models'


export const Log = Record({
  entry_id: "",
  name: "",
  domain: "",
  server: "",
  cdn: "",
  client_uuid: "",
  client_referer: null,
  client_user_agent: "",
  client_ip: "",
  client_country: "",
  client_region: "",
  client_city: "",
  client_long: "",
  client_lat: "",
  client_asn: 0,
  content_type: "",
  content_lastmod: "",
  transfer_code: "",
  request_path: "",
  request_method: "",
  request_secure: "",
  request_proto: "",
  transfer_result: "",
  transfer_size: 0,
  transfer_size_total: 0,
  transfer_start: "",
  transfer_seconds: 0,
  request_url: ""
}, 'Log')

export const State = Record({
  logList: ListData(),
  reportingError: null,
})

export const blacklistedFields = [
  'reportingError',
]
