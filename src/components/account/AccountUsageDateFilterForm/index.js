import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Field } from 'react-final-form'
import {
  Button, Form as BootstrapForm, FormGroup, Label,
  UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap'
import moment from 'moment'

import FormInput from 'components/common/FormInput'


export default class AccountUsageDateFilterForm extends Component {

  static propTypes = {
    submitting: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
  }

  state = {
    initialValues: null,
  }

  rangeForThisHour = () => {
    const end = new Date()
    end.setSeconds(0)
    end.setMilliseconds(0)
    const start = new Date(end)
    start.setHours(0)
    start.setMinutes(0)

    return { start, end }
  }

  filterForLastMonth = () => {
    const { start, end } = this.rangeForThisHour()
    start.setMonth(start.getMonth() - 1)

    this.setFormInitialValues({ start, end })
  }

  filterForLast2Months = () => {
    const { start, end } = this.rangeForThisHour()
    start.setMonth(start.getMonth() - 2)

    this.setFormInitialValues({ start, end })
  }

  filterForLast3Months = () => {
    const { start, end } = this.rangeForThisHour()
    start.setMonth(start.getMonth() - 3)

    this.setFormInitialValues({ start, end })
  }

  filterForLast2Weeks = () => {
    const { start, end } = this.rangeForThisHour()
    start.setDate(start.getDate() - 14)

    this.setFormInitialValues({ start, end })
  }

  filterForLastWeek = () => {
    const { start, end } = this.rangeForThisHour()
    start.setDate(start.getDate() - 7)

    this.setFormInitialValues({ start, end })
  }

  setFormInitialValues = (data) => {
    this.setState({
      initialValues: {
        start: moment(data.start).format('YYYY-MM-DD'),
        end: moment(data.end).format('YYYY-MM-DD'),
      },
    }, () => {
      this.props.onSubmit(data)
    })
  }

  validate = (values) => {
    const errors = {}

    if (values.start && values.end && values.start >= values.end) {
      errors.end = 'End date should not be equal or earlier than start date'
    }

    return errors
  }

  handleSubmit = (data) => {
    this.props.onSubmit({
      start: data.start ? new Date(`${data.start} 00:00:00`) : null,
      end: data.end ? new Date(`${data.end} 00:00:00`) : null,
    })
  }

  render() {
    const { submitting } = this.props
    const { initialValues } = this.state

    return <Form
      initialValues={initialValues}
      onSubmit={this.handleSubmit}
      validate={this.validate}
      render={({ handleSubmit }) => (
        <BootstrapForm inline onSubmit={handleSubmit}>
          <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
            <Label for="startInput" className="mr-sm-2">Start</Label>
            <Field id="startInput" name="start" type="date" component={FormInput} />
          </FormGroup>
          <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
            <Label for="endInput" className="mr-sm-2">End</Label>
            <Field id="endInput" name="end" type="date" component={FormInput} />
          </FormGroup>
          <UncontrolledDropdown className="mr-2">
            <DropdownToggle caret>
              Apply Preset
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={this.filterForLastMonth}>Last month</DropdownItem>
              <DropdownItem onClick={this.filterForLast2Months}>Last 2 months</DropdownItem>
              <DropdownItem onClick={this.filterForLast3Months}>Last 3 months</DropdownItem>
              <DropdownItem onClick={this.filterForLast2Weeks}>Last 2 weeks</DropdownItem>
              <DropdownItem onClick={this.filterForLastWeek}>Last week</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <Button type="submit" color="primary" disabled={submitting}>Refresh</Button>
        </BootstrapForm>
      )}
    />
  }
}
