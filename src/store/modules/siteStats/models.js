import { Record, List, Map } from 'immutable'


export const SiteStatsRecord = Record({
  transfers: 0,
  bytes: 0,
  start: '',
  end: '',
}, 'SiteStatsRecord')

export const SiteStats = Record({
  server: '',
  results: 0,
  interval: 0,
  transfers: List(),
}, 'SiteStats')

export const State = Record({
  recentSiteStatsMap: Map(),  // This map will have records with key => server, value => DetailData
                              // where each record is for one site and detail data type is SiteStats
  siteStatsMap: Map(),        // This map will have records with key => server, value => DetailData
                              // where each record is for one site and detail data type is SiteStats
  siteMiniGraphStatsMap: Map(), // This map will have records with key => server, value => DetailData
                                // where each record is for one site and detail data type is SiteStats
}, 'SiteStatsState')

export const blacklistedFields = []
