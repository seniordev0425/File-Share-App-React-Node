import { List } from 'immutable'
import { AnalyticsProvider, AnalyticsProfile } from 'store/modules/analytics'


export const providers = List([
  AnalyticsProvider({
    id: '1',
    name: 'googleanalytics',
    display: 'Google Analytics',
  }),
  AnalyticsProvider({
    id: '2',
    name: 'dropbox',
    display: 'Dropbox',
  }),
  AnalyticsProvider({
    id: '3',
    name: 'mediafire',
    display: 'Mediafire',
  }),
])

export const profiles = List([
  AnalyticsProfile({
    name: 'Test Analytics',
    provider: 'googleanalytics',
    token: 'UA-123123-1',
    event_name: 'Some Event',
    referrer: false,
    filter_mode: 1,
    filter: '/^.png$/i',
    filter_mode_country: 0,
    filter_country: '/^US$/i',
    updated: '2019-04-20 10:00:00 UTC',
  }),
  AnalyticsProfile({
    name: 'My Statistics',
    provider: 'mixpanel',
    token: 'mx123456',
    event_name: 'Track',
    referrer: false,
    filter_mode: 1,
    filter: '/^.png$/i',
    filter_mode_country: 0,
    filter_country: '/^US$/i',
    updated: '2019-04-21 05:10:00 UTC',
  })
])
