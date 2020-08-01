import { State } from './models'
import {
  reducer,
  loginSuccess,
  loginFail,
} from './reducer'

it('handles LOGIN action success', async () => {
  const dummyToken = 'somedummyauthtokenhere'
  const state = State()
  const newState = reducer(state, loginSuccess({
    auth_token: dummyToken
  }))
  expect(newState.token).toEqual(dummyToken)
})

it('handles LOGIN action fail', async () => {
  const dummyToken = 'somedummyauthtokenhere'
  const state = State()
  const newState = reducer(state, loginFail())
  expect(newState.token).toEqual('')
})
