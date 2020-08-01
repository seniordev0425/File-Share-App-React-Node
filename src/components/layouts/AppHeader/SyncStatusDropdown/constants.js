import {
  faSyncAlt, faCheckCircle, faCloudUploadAlt, faExclamationTriangle, faTimesCircle,
} from '@fortawesome/free-solid-svg-icons'


export const ICONS = {
  syncing: faSyncAlt,
  pushing: faCloudUploadAlt,
  complete: faCheckCircle,
  warning: faExclamationTriangle,
  stale: faTimesCircle,
}

export const ICON_COLOR_CLASSES = {
  syncing: 'text-f-color3',
  pushing: 'text-f-color7',
  complete: 'text-f-color2',
  warning: 'text-f-color4',
  stale: 'text-f-color6',
}

export const ITEM_CLASSES = {
  syncing: 'is-syncing',
  pushing: 'is-pushing',
  complete: 'is-complete',
  warning: 'is-warning',
  stale: 'is-warning',
}
