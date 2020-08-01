export const selectPlan = state => state.getIn(['billing', 'plan'])

export const selectStripeKey = state => state.getIn(['billing', 'stripeKey'])

export const selectAvailablePlanList = state => state.getIn(['billing', 'availablePlanList'])

export const selectSubscription = state => state.getIn(['billing', 'subscription'])

export const selectCreateSubscriptionState = state => state.getIn(['billing', 'createSubscriptionState'])

export const selectUpdateSubscriptionState = state => state.getIn(['billing', 'updateSubscriptionState'])

export const selectCancelSubscriptionState = state => state.getIn(['billing', 'cancelSubscriptionState'])

export const selectInvoiceList = state => state.getIn(['billing', 'invoiceList'])
