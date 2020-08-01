import immutableTransform from 'redux-persist-transform-immutable'

import {
  ListData, PaginatedListData, DetailData,
} from 'store/common/models'
import {
  AccountStatsRecord, AccountStats,
} from 'store/modules/accountStats/models'
import {
  AnalyticsProvider, AnalyticsProfile,
} from 'store/modules/analytics/models'
import {
  APIKey,
} from 'store/modules/auth/models'
import {
  Plan, StripeKey, InvoiceUsage, Invoice, SubscriptionPayment, Subscription,
} from 'store/modules/billing/models'
import {
  CDN,
} from 'store/modules/cdn/models'
import {
  FileOrFolder, PathDetails,
} from 'store/modules/siteContent/models'
import {
  SiteStatsRecord, SiteStats,
} from 'store/modules/siteStats/models'
import {
  Site, SitePreview,
} from 'store/modules/sites/models'
import {
  Storage, StorageDetail, OAuthLink, OAuthResult,
} from 'store/modules/storage/models'
import {
  SystemStatus,
} from 'store/modules/system/models'
import {
  TwoFactorPayload,
} from 'store/modules/twofactor/models'
import {
  User, PasswordCodeData,
} from 'store/modules/user/models'
import {
  PollResult,
} from 'store/modules/poll/models'
import {
  Domain,
} from 'store/modules/domains/models'
import {
  Log,
} from 'store/modules/log/models'
import {
  Event,
} from 'store/modules/events/models'
import {
  ChangeStatus, PrecacheJob, PrecacheStatus,
} from 'store/modules/siteUpdates/models'


export default immutableTransform({
  records: [
    ListData, PaginatedListData, DetailData,
    AccountStatsRecord, AccountStats,
    AnalyticsProvider, AnalyticsProfile,
    APIKey,
    Plan, StripeKey, InvoiceUsage, Invoice, SubscriptionPayment, Subscription,
    CDN,
    FileOrFolder, PathDetails,
    SiteStatsRecord, SiteStats,
    Site, SitePreview,
    Storage, StorageDetail, OAuthLink, OAuthResult,
    SystemStatus,
    TwoFactorPayload,
    User, PasswordCodeData,
    PollResult,
    Domain,
    Log,
    Event,
    ChangeStatus, PrecacheJob, PrecacheStatus,
  ],
})
