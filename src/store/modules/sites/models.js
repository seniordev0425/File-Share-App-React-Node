import { Record, Map } from 'immutable'

import { REQUEST_STATUS } from 'constants/common'
import {
  ListData,
  DetailData,
} from 'store/common/models'


export const Site = Record({
  analytics: null,
  autoupdate: true,
  cdn: '',
  created: '',
  deleted: null,
  desc: null,
  domain: '',
  email_obfs: false,
  enabled: true,
  error_url: null,
  error: null,
  expires: '',
  fancyindexing: false,
  favorite: false,
  filter_mode: 2,
  filter: "/(^.|^~|.*(\n|\r).*)|(^desktop.ini$|^thumbs.db|icon\r)/",
  image_mirage: false,
  image_polish: false,
  indexfiles: true,
  locked: false,
  minify_css: false,
  minify_html: false,
  minify_js: false,
  name: '',
  password: null,
  precache: true,
  precachedata: true,
  rocket_load: false,
  scrape_shield: false,
  search: true,
  server: '',
  storage: '',
  tags: [],
  team: null,
  updated: '',
}, 'Site')

export const SitePreview = Record({
  server: '',
  url: '',
  modified: 0,
}, 'SitePreview')

export const State = Record({
  siteList: ListData(),
  siteDetail: DetailData(),
  sitePreviewMap: Map(),
  createSiteState: REQUEST_STATUS.INITIAL,
  updateSiteDetailState: REQUEST_STATUS.INITIAL,
  deleteSiteDetailState: REQUEST_STATUS.INITIAL,
}, 'SitesState')

export const blacklistedFields = [
  'createSiteState',
  'updateSiteDetailState',
  'deleteSiteDetailState',
]
