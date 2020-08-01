import { DetailData } from 'store/common/models'
import { Plan } from 'store/modules/billing'
import { REQUEST_STATUS } from 'constants/common'

export const planDetail = DetailData({
  state: REQUEST_STATUS.SUCCESS,
  data: Plan({
    free: false
  }),
})
