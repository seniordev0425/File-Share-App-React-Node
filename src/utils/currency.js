import { CURRENCY_MAP } from 'constants/common'


export const formatCurrency = (currency, amount, digits = 2) => `${CURRENCY_MAP[currency]}${amount.toFixed(digits)}`
