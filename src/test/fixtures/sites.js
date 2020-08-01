import { DetailData } from 'store/common/models'
import { List } from 'immutable'
import { REQUEST_STATUS } from 'constants/common'
import { Site, SitePreview } from 'store/modules/sites'


export const sites = List([
  Site({
    name: 'mysite',
    desc: 'My Site',
    analytics: null,
    server: 'mysite.imfastio.com',
    storage: 'googledrive',
    updated: '2019-04-20 05:30:00 UTC',
    enabled: true,
    filter: '/excludedfile.js$/',
  }),
  Site({
    name: 'sandysite',
    desc: 'Elle\'s Site',
    analytics: null,
    server: 'sandysite.imfastio.com',
    storage: 'dropbox',
    updated: '2019-04-21 01:10:00 UTC',
    enabled: true,
    filter: '/excludedfile.js$/',
  }),
  Site({
    name: 'newsite',
    desc: 'New Site',
    analytics: null,
    server: 'newsite.imfastio.com',
    storage: 'mediafire',
    updated: '2019-04-10 05:10:00 UTC',
    enabled: false,
    filter: '/excludedfile.js$/',
  }),
])

export const sitePreviewDetail = DetailData({
  state: REQUEST_STATUS.SUCCESS,
  data: SitePreview({
    server: 'test-server.imfast.io',
    url: 'https://test-server.imfast.io/images/dummy.png',
  })
})
