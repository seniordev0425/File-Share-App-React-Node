import React from 'react'
import { Button } from 'reactstrap'
import { injectStripe, CardElement } from 'react-stripe-elements'
import PropTypes from 'prop-types'


function InnerCardForm(props) {
  const { stripe, onSubmit } = props

  const handleSubmit = (ev) => {
    ev.preventDefault()

    stripe.createToken().then(data => {
      if (data.token && data.token.id) {
        onSubmit({ token: data.token.id })
      } else {
        console.error(data.error || 'Failed to get card token from Stripe.')
      }
    })
  }

  return <form onSubmit={handleSubmit}>
    <div className="mb-3">
      <CardElement />
    </div>

    <Button type="submit" className="js-btn-submit text-f-sm">Confirm Code</Button>
  </form>
}

InnerCardForm.propTypes = {
  stripe: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default injectStripe(InnerCardForm)
