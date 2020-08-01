import {
  faDropbox, faGoogleDrive,
} from '@fortawesome/free-brands-svg-icons'
import {
  faCloud,
  faExclamationTriangle, faTimesCircle, faInfoCircle, faCheckCircle,
} from '@fortawesome/free-solid-svg-icons'


export const STORAGE_ICONS = {
  googledrive: faGoogleDrive,
  dropbox: faDropbox,
}

export const DEFAULT_STORAGE_ICON = faCloud

export const getIconForStorage = storage => STORAGE_ICONS[storage] || DEFAULT_STORAGE_ICON

export const NOTIFICATION_ICONS = {
  notice: faInfoCircle,
  info: faInfoCircle,
  warning: faExclamationTriangle,
  success: faCheckCircle,
  error: faTimesCircle,
  danger: faTimesCircle,
}

export const getIconForNotificationType = type => NOTIFICATION_ICONS[type] || NOTIFICATION_ICONS.info
