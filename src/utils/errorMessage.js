import get from 'lodash/get'

export const getErrorMessage = (error, fallbackMessage) => {
  switch (get(error, 'code')) {
    case 500:
      return 'An unknown error occurred that not recoverable.'
    case 3004:
      return 'An invalid password code was provided.'
    case 601:
      return 'The Server you tried to access was not found or is not in your account.'
    case 602:
      return 'Server was already deleted.'
    case 603:
      return 'Server is locked.'
    case 604:
      return 'Server or file/folder path not found.'
    case 605:
      return 'Server name is not valid.'
    case 606:
      return 'Path on the server is not valid.'
    case 609:
      return 'Server FQDN is not valid.'
    case 610:
      return 'Error loading list of storage providers.'
    case 611:
      return 'Error loading list of linked storage providers.'
    case 612:
      return 'Selected storage provider is not linked.'
    case 620:
      return 'Error loading list of CDN providers.'
    case 630:
      return 'Error loading list of analytics profiles.'
    case 631:
      return 'Analytics not found.'
    case 635:
      return 'Analytics name is not valid.'
    case 641:
      return 'Invalid user email address.'
    case 643:
      return 'Account is locked.'
    case 650:
      return 'Error loading list of analytics profile providers.'
    case 670:
      return 'Error loading account statistics.'
    case 671:
      return 'Too many requests made. Enhance your calm.'
    case 740:
      return 'It looks like your request is taking an unusually long time to load and may have timed-out. Please go back and try your request again.'
    case 2318:
      return 'There as an internal error storing Storage credentials.'
    case 3027:
      return 'Account is Closed.'
    case 3005:
      return 'Code is expired, request a new code.'
    case 3028:
      return 'Account is Locked.'
    case 3029:
      return 'Account is Suspended.'
    case 3030:
      return 'Account is Suspended for Abuse.'
    case 3031:
      return 'Account is Unavailable.'
    case 3011:
      return 'Cookie Error, make sure you have cookies enabled.'
    case 10184:
      return 'The current user is not a subscriber or the subscription was not found.'
    case 10053:
      return 'The Analytics Profile was not found. Please check the name.'
    case 46197:
      return 'Our application has rejected your request because there have been too many requests made in too short of a period of time. Please try your request again later.'
    case 2530:
    case 2430:
    case 2135:
    case 2230:
    case 2330:
      return 'Access denied because the scope of your credentials are not sufficient to access the requested resource. If you feel this is incorrect, try clearing your cookies.'
    // newly added
    case 3000:
      return 'Site preview is not available because the server is not enabled.'
    case 90211:
      return 'There was an internal error processing your API request, please try again and if the problem persists, contact support.'
    default:
      return fallbackMessage || get(error, 'text') || 'API request has no response returned.'
  }
}

export const getResponseErrorCode = (errorResponse) =>
  get(errorResponse, 'data.error.code')

export const getResponseErrorMessage = (errorResponse, fallbackMessage) =>
  getErrorMessage(get(errorResponse, 'data.error'), fallbackMessage)
