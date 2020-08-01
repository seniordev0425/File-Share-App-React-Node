import { Record } from 'immutable'

import { ListData, DetailData } from 'store/common/models'


export const FileOrFolder = Record({
  type: '',
  id: '',
  name: '',
  size: 0,
  path: '',
  mime: '',
  category: 0,
  url: '',
  origin_url: '',
  modified: '',
  cached: '',
  filtered: false,
  toobig: false,
}, 'FileOrFolder')

export const PathDetails = Record({
  type: '',
  name: '',
  domain: '',
  server: '',
  storage: '',
  details: FileOrFolder(),
}, 'PathDetails')

export const State = Record({
  pathDetails: DetailData(),
  rootDetails: DetailData(),
  currentPath: '',
  content: ListData(),
}, 'SiteContentState')

export const blacklistedFields = [
]
