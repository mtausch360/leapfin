import React, { Component } from 'react'

import { startCase, isEmpty } from 'lodash'
import moment from 'moment'

import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import DatePicker from 'material-ui/DatePicker'
import CircularProgress from 'material-ui/CircularProgress'
import RaisedButton from 'material-ui/RaisedButton'
import Paper from 'material-ui/Paper'

const isRequired = {
  first_name: true,
  last_name: true,
  address_line_1: true,
  city: true,
  state: true,
  zip: true,
  birthdate: true
}

// finding max and min date relative to current date
const minD = new Date()
minD.setFullYear(minD.getFullYear() - 110)
minD.setHours(0, 0, 0, 0)
const minDate = moment(minD).format('YYYY-MM-DD')

const maxD = new Date()
maxD.setFullYear(maxD.getFullYear() - 13)
maxD.setHours(0, 0, 0, 0)
const maxDate = moment(maxD).format('YYYY-MM-DD')

const labelTransform = (prop) => `${startCase(prop)} ${isRequired[prop] ? '*' : ''}`

export default class Form extends Component {

  constructor(props) {
    super(props)
    this.state = {
      ip: null,
      form: {
        first_name: '',
        last_name: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        zip: '',
        phone_number: '',
        birthdate: '',
        gender: ''
      },
      errors: {},
      loading: true,
      pending: false,
    }
  }

  componentDidMount = () => {
    fetch('/api/v0/form')
      .then(res => res.json())
      .then((json) => {
        const { ip, form } = json
        this.setState({ loading: false, ip })
        if (!isEmpty(form)) {
          this.setState({ form })
        }
      })
  }

  formError = () => {
    const errors = {}
    let isError = false
    for(let prop in isRequired) {
      if(!this.state.form[prop]){
        errors[prop] = "This field is required"
        isError = true
      }
    }

    if (isError) {
      this.setState({ errors })
    }

    return isError
  }

  submit = () => {
    if (this.formError()) {
      return
    }

    this.setState({ pending: true })

    fetch('/api/v0/form', {
      method: "PUT",
      headers: new Headers({ "Content-Type": "application/json"}),
      body: JSON.stringify({ form: this.state.form })
    })
      .then(res => {
        if(res.ok) {
          this.setState({ pending: false, errors: {} })
        } else {
          res.json().then(res => {
            this.setState({ errors: res, pending: false })
          })
        }
      })
  }

  renderForm = () => {
    const { form, errors } = this.state
    const props = Object.keys(form)
    const els = []

    for(let prop of props) {
      let el
      switch(prop) {

        case 'gender':
          el = (
            <SelectField
              name={ prop }
              floatingLabelText={ labelTransform(prop) }
              value={ form[prop] }
              onChange={ (e, i, v) => this.setState({ form: Object.assign({}, form, { [prop]: v })}) }
              fullWidth
            >
              <MenuItem value={ null } primaryText="" />
              <MenuItem value={'M'} primaryText="Male" />
              <MenuItem value={'F'} primaryText="Female" />
            </SelectField>
          )
          break

        case 'birthdate':
          el = (
            <TextField
              name={ prop }
              floatingLabelText={ labelTransform(prop) }
              value={ form[prop] }
              onChange={ (e, v) => this.setState({ form: Object.assign({}, form, { [prop]: v })}) }
              errorText={ errors[prop] }
              min={ minDate }
              max={ maxDate }
              type={ 'date' }
              fullWidth
            />
          )
          break

        default:
          el = (
            <TextField
              name={ prop }
              floatingLabelText={ labelTransform(prop) }
              value={ form[prop] }
              onChange={ (e, v) => this.setState({ form: Object.assign({}, form, { [prop]: v })}) }
              errorText={ errors[prop] }
              fullWidth
            />
          )
      }

      els.push(
        <div key={ prop } style={ { width: "80%", margin: "0 auto" } } >
          { el }
        </div>
      )
    }

    return els
  }

  renderAvatar = () => {
    const { ip } = this.state
    const style = {
      height: 215,
      width: 215,
      margin: '0 auto',
      textAlign: 'center',
      display: 'block',
    }
    return (
      <Paper style={ style } circle >
        <img
          style={ { borderRadius: 100, margin: '0 auto', display: 'block', width: 200, height: 200 } }
          src={ `https://robohash.org/${ ip }` }
        />
      </Paper>
    )
  }

  render = () => {
    const style = {
      maxWidth: '800px',
      margin: '0 auto'
    }
    const { loading, pending } = this.state
    return (
      <div style={ style }>
        { loading &&
            <div>
              <CircularProgress style={ { margin: '0 auto', width: 40, display: 'block' } } />
            </div>
        }
        { !loading && this.renderAvatar() }
        { !loading && this.renderForm() }
        { !loading &&
          <RaisedButton
            onClick={ this.submit }
            style={{ marginTop: 20 }}
            fullWidth
          >
            { pending ? <CircularProgress /> : "Submit" }
          </RaisedButton>
        }
      </div>
    )
  }
}