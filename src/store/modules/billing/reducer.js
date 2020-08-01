import { handleActions } from 'redux-actions'
import { List } from 'immutable'

import {
  defineLoopActions,
  convertToListRecord,
  requestLoopHandlersForGet,
  requestLoopHandlersForUpdate,
} from 'utils/state'
import { createPersistenceHandlers } from 'store/persist'
import {
  LOAD_PLAN,
  GET_STRIPE_KEY,
  LOAD_PLAN_LIST,
  LOAD_SUBSCRIPTION,
  CREATE_SUBSCRIPTION,
  UPDATE_SUBSCRIPTION,
  CANCEL_SUBSCRIPTION,
  LOAD_INVOICE_LIST,
} from './constants'
import {
  Plan, StripeKey, Invoice, Subscription, State,
} from './models'


/* Initial state */

const initialState = new State()

/* Action creators */

export const {
  start: loadPlan,
  success: loadPlanSuccess,
  fail: loadPlanFail,
} = defineLoopActions(
  LOAD_PLAN,
  {
    failureMessage: 'Failed to load plan',
  }
)

export const {
  start: getStripeKey,
  success: getStripeKeySuccess,
  fail: getStripeKeyFail,
} = defineLoopActions(GET_STRIPE_KEY)

export const {
  start: loadPlanList,
  success: loadPlanListSuccess,
  fail: loadPlanListFail,
} = defineLoopActions(
  LOAD_PLAN_LIST,
  {
    failureMessage: 'Failed to load plan list',
  }
)

export const {
  start: loadSubscription,
  success: loadSubscriptionSuccess,
  fail: loadSubscriptionFail,
} = defineLoopActions(
  LOAD_SUBSCRIPTION,
  {
    failureMessage: 'Failed to load subscription information',
  })

export const {
  start: createSubscription,
  success: createSubscriptionSuccess,
  fail: createSubscriptionFail,
} = defineLoopActions(
  CREATE_SUBSCRIPTION,
  {
    failureMessage: 'Failed to create a new subscription.',
    successMessage: 'A new subscription was successfully created.'
  }
)

export const {
  start: updateSubscription,
  success: updateSubscriptionSuccess,
  fail: updateSubscriptionFail,
} = defineLoopActions(
  UPDATE_SUBSCRIPTION,
  {
    failureMessage: 'Failed to update a subscription.',
    successMessage: 'Subscription was successfully updated.'
  }
)

export const {
  start: cancelSubscription,
  success: cancelSubscriptionSuccess,
  fail: cancelSubscriptionFail,
} = defineLoopActions(CANCEL_SUBSCRIPTION)

export const {
  start: loadInvoiceList,
  success: loadInvoiceListSuccess,
  fail: loadInvoiceListFail,
} = defineLoopActions(LOAD_INVOICE_LIST)

/* Reducer */

export const reducer = handleActions({

  /* Load plan */

  ...requestLoopHandlersForGet({
    action: LOAD_PLAN,
    dataField: 'plan',
    getDataFromPayload: payload => Plan(payload.plan),
  }),

  /* Get Stripe key */

  ...requestLoopHandlersForGet({
    action: GET_STRIPE_KEY,
    dataField: 'stripeKey',
    getDataFromPayload: payload => StripeKey(payload),
  }),

  /* Load available plans */

  ...requestLoopHandlersForGet({
    action: LOAD_PLAN_LIST,
    dataField: 'availablePlanList',
    initialValue: List(),
    getDataFromPayload: payload => convertToListRecord(payload.plans, Plan),
    usePagination: false,
  }),

  /* Load subscription */

  ...requestLoopHandlersForGet({
    action: LOAD_SUBSCRIPTION,
    dataField: 'subscription',
    getDataFromPayload: payload => Subscription(payload.subscription),
  }),

  /* Create subscription */

  ...requestLoopHandlersForUpdate({
    action: CREATE_SUBSCRIPTION,
    stateField: 'createSubscriptionState',
  }),

  /* Update subscription */

  ...requestLoopHandlersForUpdate({
    action: UPDATE_SUBSCRIPTION,
    stateField: 'updateSubscriptionState',
  }),

  /* Cancel subscription */

  ...requestLoopHandlersForUpdate({
    action: CANCEL_SUBSCRIPTION,
    stateField: 'cancelSubscriptionState',
  }),

  /* Load invoices */

  ...requestLoopHandlersForGet({
    action: LOAD_INVOICE_LIST,
    dataField: 'invoiceList',
    initialValue: List(),
    getDataFromPayload: payload => convertToListRecord(payload.invoices, Invoice),
    usePagination: false,
  }),

  /* Data caching and persistence */

  ...createPersistenceHandlers('billing'),

}, initialState)
