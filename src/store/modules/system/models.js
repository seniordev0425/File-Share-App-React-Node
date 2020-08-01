import { Record } from 'immutable'

import { APP_VERSION } from 'constants/env'
import { DetailData } from 'store/common/models'


export const SystemStatus = Record({
  app: '',
  api: '',
  cdn: '',
  analytics: '',
  version: '',
  frontEndVersion: '',
}, 'SystemStatus')

export const State = Record({
  systemStatusData: DetailData(),
  cachedVersion: APP_VERSION,
}, 'SystemState')

export const blacklistedFields = [
  'systemStatusData',
]
