import { List } from 'immutable'
import { ChangeStatus, PrecacheJob, PrecacheStatus } from 'store/modules/siteUpdates'


export const changeStatuses = List([
  ChangeStatus({
    "name": "mydropboxserver",
    "domain": "imfast.io",
    "server": "ryan01.imfastdev2.com",
    "waited": 12,
    "remaining": 0,
    "extensions": 5,
    "changes": [
        "/"
    ],
    "complete": false,
    "stale": false,
    "started": "2019-04-24 01:14:38 UTC",
    "last": "2019-04-24 01:14:45 UTC",
    "updated": "2019-04-24 01:14:50 UTC"
  }),
  ChangeStatus({
    "name": "mydropboxserver",
    "domain": "imfast.io",
    "server": "ryans-website2.imfast.io",
    "waited": 12,
    "remaining": 0,
    "extensions": 5,
    "changes": [
        "/"
    ],
    "complete": false,
    "stale": false,
    "started": "2019-04-24 01:14:38 UTC",
    "last": "2019-04-24 01:14:45 UTC",
    "updated": "2019-04-24 01:14:50 UTC"
  }),
  ChangeStatus({
    "name": "mydropboxserver",
    "domain": "imfast.io",
    "server": "ryan01.imfastdev2.com",
    "waited": 12,
    "remaining": 0,
    "extensions": 5,
    "changes": [
        "/"
    ],
    "complete": false,
    "stale": false,
    "started": "2019-04-24 01:14:38 UTC",
    "last": "2019-04-24 01:14:45 UTC",
    "updated": "2019-04-24 01:14:50 UTC"
  }),
  ChangeStatus({
    "name": "mydropboxserver",
    "domain": "imfast.io",
    "server": "ryan01.imfastdev2.com",
    "waited": 12,
    "remaining": 0,
    "extensions": 5,
    "changes": [
        "/"
    ],
    "complete": false,
    "stale": false,
    "started": "2019-04-24 01:14:38 UTC",
    "last": "2019-04-24 01:14:45 UTC",
    "updated": "2019-04-24 01:14:50 UTC"
  }),
  ChangeStatus({
    "name": "mydropboxserver",
    "domain": "imfast.io",
    "server": "ryans-website2.imfast.io",
    "waited": 12,
    "remaining": 0,
    "extensions": 5,
    "changes": [
        "/"
    ],
    "complete": false,
    "stale": false,
    "started": "2019-04-24 01:14:38 UTC",
    "last": "2019-04-24 01:14:45 UTC",
    "updated": "2019-04-24 01:14:50 UTC"
  }),
])

export const precacheStatuses = List([
  PrecacheStatus({
    key: '23423423',
    server: 'ryans-website2.imfast.io',
    status: 'running',
    stale: false,
    current: PrecacheJob(),
    started: '2019-05-14 00:46:09 UTC',
    ended: '2019-05-14 00:46:09 UTC'
  }),
  PrecacheStatus({
    key: '23423423',
    server: 'ryan01.imfastdev2.com',
    status: 'running',
    stale: false,
    current: PrecacheJob(),
    started: '2019-05-14 00:46:09 UTC',
    ended: '2019-05-14 00:46:09 UTC'
  })
])
