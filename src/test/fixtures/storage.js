import { List } from 'immutable'
import { Storage } from 'store/modules/storage'

import {
  AUTOUPDATE_STATUS,
  StorageDetail,
} from 'store/modules/storage'


export const storages = List([
  Storage({
    "id": "1",
    "name": "googledrive",
    "display": "Google Drive",
    "enabled": true,
    "origin_url": "https://drive.google.com/"
  }),
  Storage({
    "id": "2",
    "name": "dropbox",
    "display": "Dropbox",
    "enabled": true,
    "origin_url": "https://www.dropbox.com/"
  }),
  Storage({
    "id": "3",
    "name": "box",
    "display": "Box",
    "enabled": true,
    "origin_url": "https://www.box.com/"
  }),
  Storage({
    "id": "4",
    "name": "onedrive",
    "display": "Microsoft OneDrive",
    "enabled": true,
    "origin_url": "https://onedrive.live.com/"
  }),
  Storage({
    "id": "5",
    "name": "mediafire",
    "display": "MediaFire",
    "enabled": true,
    "origin_url": "https://www.mediafire.com/"
  }),
])

export const storageDetail = StorageDetail({
  id: 1,
  name: 'googledrive',
  display: 'Google Drive',
  provider_id: '34609830',
  email: 'myemail@gmail.com',
  authenticated: true,
  expired: false,
  enabled: true,
  protected: false,
  autoupdate: AUTOUPDATE_STATUS.AVAILABLE,
  origin_url: 'https://drive.google.com/',
  error: null,
  updated: '2019-05-10 15:22:58 UTC',
})
