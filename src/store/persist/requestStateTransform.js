import { createTransform } from 'redux-persist'

import { REQUEST_STATUS } from 'constants/common'


export default createTransform(
  state => state,
  state => state.replace(REQUEST_STATUS.PENDING, REQUEST_STATUS.INITIAL),
)
