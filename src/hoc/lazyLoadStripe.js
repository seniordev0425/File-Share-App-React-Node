import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { STRIPE_JS_URL } from 'constants/env'
import Spinner from 'components/common/Spinner'


class LazyLoadStripeHOC extends Component {

  static propTypes = {
    apiKey: PropTypes.string.isRequired,
    componentClass: PropTypes.elementType.isRequired,
  }

  state = {
    stripe: null
  }

  loadStripe = () => {
    const { apiKey } = this.props

    if (window.Stripe) {
      this.setState({
        stripe: window.Stripe(apiKey)
      })
    } else {
      const scriptTagId = 'stripe-js'
      let scriptTag = document.getElementById(scriptTagId)
      if (!scriptTag) {
        const heads = document.getElementsByTagName("head")
        if (!heads && !heads.length) {
          return false
        }
        const head = heads[0]
        scriptTag = document.createElement('script')
        scriptTag.setAttribute('src', STRIPE_JS_URL)
        scriptTag.setAttribute('type', 'text/javascript')
        scriptTag.setAttribute('id', scriptTagId)
        head.appendChild(scriptTag)
      }

      scriptTag.addEventListener('load', () => {
        // Create Stripe instance once Stripe.js loads
        this.setState({
          stripe: window.Stripe(apiKey)
        })
      })
    }
    return true
  }

  componentDidMount() {
    this.loadStripe()
  }

  render() {
    const { componentClass: ComponentClass } = this.props
    const { stripe } = this.state

    return stripe ?
      <ComponentClass stripe={stripe} {...this.props} /> :
      <Spinner />
  }

}

export default componentClass => props => (
  <LazyLoadStripeHOC
    {...props}
    componentClass={componentClass}
  />
)
