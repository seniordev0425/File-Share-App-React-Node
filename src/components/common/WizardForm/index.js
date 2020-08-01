import React, { useState, useEffect } from 'react'
import {
  CSSTransition, TransitionGroup,
} from 'react-transition-group'
import { Form } from 'react-final-form'
import PropTypes from 'prop-types'

import './index.css'


export function Step(props) {
  const {
    initialValues, initialValueModifier,
    previousPage, nextPage,
    validate, validateOnBlur, submitting, onSubmit,
    render,
  } = props

  return <Form
    initialValues={initialValueModifier ? initialValueModifier(initialValues) : initialValues}
    validate={validate}
    validateOnBlur={validateOnBlur}
    onSubmit={onSubmit}
    render={({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        {render({ previousPage, nextPage, submitting })}
      </form>
    )}
  />
}

function WizardForm(props) {
  const {
    initialValues, useLastStepForConfirmation, submitting, submitted,
    onSubmit, children,
  } = props
  const filteredChildren = React.Children.toArray(children).filter(e => e)
  const pageCount = filteredChildren.length
  const [page, setPage] = useState(-1)
  const [values, setValues] = useState(initialValues)

  const previousPage = () => {
    setPage(-1)
    setTimeout(setPage.bind(this, Math.max(0, page - 1)), 250)
  }

  const nextPage = () => {
    setPage(-1)
    setTimeout(setPage.bind(this, Math.min(page + 1, pageCount - 1)), 250)
  }

  const handleSubmitDataFromStep = data => {
    const newValues = {
      ...values,
      ...data,
    }
    setValues(newValues)

    const lastPage = useLastStepForConfirmation ? pageCount - 2 : pageCount - 1
    if (page === lastPage) {
      onSubmit(newValues)
    } else {
      nextPage()
    }
  }

  const wizardSteps = filteredChildren.map(child => React.cloneElement(child, {
    page,
    initialValues: values,
    isLast: page === pageCount - 1,
    previousPage,
    nextPage,
    submitting,
    onSubmit: handleSubmitDataFromStep,
  }))

  useEffect(() => setPage(0), [])

  useEffect(() => {
    submitted && nextPage()
  }, [submitted])

  return <TransitionGroup>
    <CSSTransition
      key={page}
      in
      timeout={200}
      classNames="wizardStep"
    >
      <div>
        {page >= 0 && wizardSteps[page]}
      </div>
    </CSSTransition>
  </TransitionGroup>
}

WizardForm.Step = Step

WizardForm.propTypes = {
  initialValues: PropTypes.object,
  useLastStepForConfirmation: PropTypes.bool,
  submitting: PropTypes.bool,
  submitted: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
}

export default WizardForm
