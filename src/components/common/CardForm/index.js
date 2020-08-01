import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Elements, StripeProvider } from 'react-stripe-elements'

import lazyLoadStripe from 'hoc/lazyLoadStripe'
import InnerCardForm from './form'


export class CardForm extends Component {

  static propTypes = {
    stripe: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
  }

  render() {
    const { stripe, onSubmit } = this.props

    return <StripeProvider stripe={stripe}>
      <Elements>
        <InnerCardForm onSubmit={onSubmit} />
      </Elements>
    </StripeProvider>
  }
}

export default lazyLoadStripe(CardForm)
