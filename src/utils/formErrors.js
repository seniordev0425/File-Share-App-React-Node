import { getResponseErrorCode } from 'utils/errorMessage'

export const handleLoginFormFieldError = (error) => {
  const code = getResponseErrorCode(error.response)
  switch (code) {
    case 10004:
    case 10006:
      return { username: 'The username was not found.' }
    case 10005:
    case 10008:
      return { password: 'The password you entered was incorrect.' }
    default:
      return null
  }
}

export const handleUpdateAccountUserSettingsError = (error) => {
  const code = getResponseErrorCode(error.response)
  switch (code) {
    case 10030:
      return true
    case 10165:
      return { intl_phone_data: 'An invalid phone number or country code was supplied.' }
    case 10029:
      return { intl_phone_data: 'An invalid phone number was supplied.' }
    case 10025:
      return { email_address: 'The email you specified is not available.' }
    default:
      return null
  }
}
