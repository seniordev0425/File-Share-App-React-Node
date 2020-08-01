import React from 'react'
import { CardElement } from 'react-stripe-elements'


export default ({ input, meta }) => <>
  <CardElement {...input} />

  {
    (meta && meta.touched && meta.error) && <span className="text-danger">{meta.error}</span>
  }
</>
