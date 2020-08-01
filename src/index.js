import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router/immutable'
import axios from 'axios'
import Cookies from 'js-cookie'
import 'bootstrap/dist/css/bootstrap.min.css'

import './assets/css/app.css'

import store, { history } from './store'
import { selectAuthToken } from './store/modules/auth'
import Routes from './routes'
import { randomString } from './utils/data'

import * as serviceWorker from './serviceWorker'



/* Set up axios request interceptor for adding authorization header */
axios.interceptors.request.use((config) => {
  const token = selectAuthToken(store.getState())
  if (token) {
    config.headers['Authorization'] = token
  }
  return config
})

/* Set up fst_br_key cookie */
const fstBrKey = Cookies.get('fst_br_key')
if (!fstBrKey) {
  Cookies.set('fst_br_key', randomString(32), {
    path: '/',
    secure: true,
    expires: 3650,
  })
}

/* Mount React app into DOM */
ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Routes />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
