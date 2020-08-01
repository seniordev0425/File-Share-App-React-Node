import { User } from 'store/modules/user'


export const user = User({
  id: '1',
  email_address: 'test@fast.io',
  country_code: 'US',
  tos_agree: true,
  first_name: 'Tester',
  last_name: 'Test',
  phone_country: '1',
  phone_number: '5551235556',
  '2factor': false,
  subscriber: true,
  valid_phone: true,
  valid_email: true,
  locked: false,
  suspended: false,
  updated: '',
  created: '',
})
