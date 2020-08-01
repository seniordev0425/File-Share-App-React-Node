import { createTransform } from 'redux-persist'
import { Map } from 'immutable'

import { blacklistedFields as accountStatsBlacklistedFields } from 'store/modules/accountStats/models'
import { blacklistedFields as analyticsBlacklistedFields } from 'store/modules/analytics/models'
import { blacklistedFields as authBlacklistedFields } from 'store/modules/auth/models'
import { blacklistedFields as billingBlacklistedFields } from 'store/modules/billing/models'
import { blacklistedFields as cdnBlacklistedFields } from 'store/modules/cdn/models'
import { blacklistedFields as pollBlacklistedFields } from 'store/modules/poll/models'
import { blacklistedFields as siteContentBlacklistedFields } from 'store/modules/siteContent/models'
import { blacklistedFields as siteStatsBlacklistedFields } from 'store/modules/siteStats/models'
import { blacklistedFields as sitesBlacklistedFields } from 'store/modules/sites/models'
import { blacklistedFields as storageBlacklistedFields } from 'store/modules/storage/models'
import { blacklistedFields as systemBlacklistedFields } from 'store/modules/system/models'
import { blacklistedFields as twofactorBlacklistedFields } from 'store/modules/twofactor/models'
import { blacklistedFields as userBlacklistedFields } from 'store/modules/user/models'
import { blacklistedFields as domainsBlacklistedFields } from 'store/modules/domains/models'
import { blacklistedFields as logBlacklistedFields } from 'store/modules/log/models'
import { blacklistedFields as eventsBlacklistedFields } from 'store/modules/events/models'
import { blacklistedFields as siteUpdatesBlacklistedFields } from 'store/modules/siteUpdates/models'


const blacklistFieldsMap = {
  accountStats: accountStatsBlacklistedFields,
  analytics: analyticsBlacklistedFields,
  auth: authBlacklistedFields,
  billing: billingBlacklistedFields,
  cdn: cdnBlacklistedFields,
  poll: pollBlacklistedFields,
  siteContent: siteContentBlacklistedFields,
  siteStats: siteStatsBlacklistedFields,
  sites: sitesBlacklistedFields,
  storage: storageBlacklistedFields,
  system: systemBlacklistedFields,
  twofactor: twofactorBlacklistedFields,
  user: userBlacklistedFields,
  domains: domainsBlacklistedFields,
  log: logBlacklistedFields,
  events: eventsBlacklistedFields,
  siteUpdates: siteUpdatesBlacklistedFields,
}

export default createTransform(
  (state, moduleName) => {
    let filteredState = new Map()
    const blacklistedFields = blacklistFieldsMap[moduleName]
    state.toSeq().forEach((field, fieldName) => {
      if (blacklistedFields.indexOf(fieldName) === -1) {
        filteredState = filteredState.set(fieldName, field)
      }
    })
    return filteredState
  },
)
