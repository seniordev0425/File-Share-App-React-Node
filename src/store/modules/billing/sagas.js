import { takeLatest, call, put } from 'redux-saga/effects'

import { apiCallSaga } from 'utils/apiCall'
import { trackActivity } from 'utils/analytics'
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
  loadPlan, loadPlanSuccess, loadPlanFail,
  getStripeKeySuccess, getStripeKeyFail,
  loadPlanListSuccess, loadPlanListFail,
  loadSubscriptionSuccess, loadSubscriptionFail,
  createSubscriptionSuccess, createSubscriptionFail,
  updateSubscriptionSuccess, updateSubscriptionFail,
  cancelSubscriptionSuccess, cancelSubscriptionFail,
  loadInvoiceListSuccess, loadInvoiceListFail,
} from './reducer'


function* doLoadPlan(action) {
  yield call(apiCallSaga({
    method: 'get',
    route: '/billing/plan/details',
    successAction: loadPlanSuccess,
    failAction: loadPlanFail,
  }), action)
}

function* getStripeKey(action) {
  yield call(apiCallSaga({
    method: 'get',
    route: '/billing/keys',
    successAction: getStripeKeySuccess,
    failAction: getStripeKeyFail,
  }), action)
}

function* loadPlanList(action) {
  yield call(apiCallSaga({
    method: 'get',
    route: '/billing/plan/list',
    successAction: loadPlanListSuccess,
    failAction: loadPlanListFail,
  }), action)
}

function* loadSubscription(action) {
  yield call(apiCallSaga({
    method: 'get',
    route: '/billing/details',
    successAction: loadSubscriptionSuccess,
    failAction: loadSubscriptionFail,
  }), action)
}

function* createSubscription(action) {
  const { plan, token } = action.payload

  yield call(apiCallSaga({
    method: 'post',
    route: '/billing',
    data: {
      plan,
      payment_token: token,
    },
    successAction: createSubscriptionSuccess,
    failAction: createSubscriptionFail,
    beforeSuccessAction: function () {
      trackActivity('Create Subscription', {
        plan,
      })
    },
    afterSuccessAction: function* () {
      yield put(loadPlan())
    },
  }), action)
}

function* updateSubscription(action) {
  const { plan, token } = action.payload

  yield call(apiCallSaga({
    method: 'post',
    route: '/billing',
    data: {
      plan,
      payment_token: token,
    },
    successAction: updateSubscriptionSuccess,
    failAction: updateSubscriptionFail,
    beforeSuccessAction: function () {
      trackActivity('Update Subscription', {
        plan,
      })
    },
    afterSuccessAction: function* () {
      yield put(loadPlan())
    },
  }), action)
}

function* cancelSubscription(action) {
  yield call(apiCallSaga({
    method: 'delete',
    route: '/billing',
    successAction: cancelSubscriptionSuccess,
    failAction: cancelSubscriptionFail,
    beforeSuccessAction: function () {
      trackActivity('Cancel Subscription')
    },
    afterSuccessAction: function* () {
      yield put(loadPlan())
    },
  }), action)
}

function* loadInvoiceList(action) {
  yield call(apiCallSaga({
    method: 'get',
    route: '/billing/invoices/list',
    successAction: loadInvoiceListSuccess,
    failAction: loadInvoiceListFail,
  }), action)
}

export const saga = function* () {
  yield takeLatest(LOAD_PLAN, doLoadPlan)
  yield takeLatest(GET_STRIPE_KEY, getStripeKey)
  yield takeLatest(LOAD_PLAN_LIST, loadPlanList)
  yield takeLatest(LOAD_SUBSCRIPTION, loadSubscription)
  yield takeLatest(CREATE_SUBSCRIPTION, createSubscription)
  yield takeLatest(UPDATE_SUBSCRIPTION, updateSubscription)
  yield takeLatest(CANCEL_SUBSCRIPTION, cancelSubscription)
  yield takeLatest(LOAD_INVOICE_LIST, loadInvoiceList)
}
