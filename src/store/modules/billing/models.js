import { Record } from 'immutable'

import { REQUEST_STATUS } from 'constants/common'
import { ListData, DetailData } from 'store/common/models'


export const Plan = Record({
  name: '',
  desc: '',
  price_base: 0,
  price_meter: 0.00,
  unit: 0,
  billed: '',
  free: false,
  free_units: 50,
  free_days: 0,
  discount: null,
  available: true,
}, 'Plan')

export const StripeKey = Record({
  mode: 'test',
  payment_token_key: '',
}, 'StripeKey')

export const InvoiceUsage = Record({
  amount: 0.0,
  units: 0,
  plan: Plan(),
}, 'InvoiceUsage')

export const Invoice = Record({
  id: '',
  total: 0.0,
  currency: '',
  starting_balance: 0.0,
  subtotal: 0.0,
  tax: 0.0,
  amount_paid: 0.0,
  amount_due: 0.0,
  usage: InvoiceUsage(),
  invoice_web: '',
  invoice_pdf: '',
  period_start: '',
  period_end: '',
  next_payment_attempt: null,
  created: ''
}, 'Invoice')

export const SubscriptionPayment = Record({
  type: '',
  brand: '',
  last4: '',
  exp_month: 0,
  exp_year: 0,
  zip: ''
}, 'SubscriptionPayment')

export const Subscription = Record({
  active: false,
  account_balance: 0.0,
  currency: '',
  delinquent: false,
  plan: Plan(),
  canceled_at: null,
  payment: SubscriptionPayment(),
  current_period_start: '',
  current_period_end: '',
  created: ''
}, 'Subscription')

export const State = Record({
  plan: DetailData(),
  stripeKey: DetailData(),
  availablePlanList: ListData(),
  subscription: DetailData(),
  createSubscriptionState: REQUEST_STATUS.INITIAL,
  updateSubscriptionState: REQUEST_STATUS.INITIAL,
  cancelSubscriptionState: REQUEST_STATUS.INITIAL,
  invoiceList: ListData(),
}, 'BillingState')

export const blacklistedFields = [
  'createSubscriptionState',
  'updateSubscriptionState',
  'cancelSubscriptionState',
]
