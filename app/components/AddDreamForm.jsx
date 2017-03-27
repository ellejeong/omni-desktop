import React from 'react';
import { TextField, RaisedButton, SelectField, Checkbox, MenuItem, TimePicker, DatePicker } from 'material-ui';



export default class AddDreamForm extends React.Component {
  constructor() {
    super();
    this.state = {
      title: '',
      content: '',
      timeStart: null,
      timeEnd: null,
      dreamType: null,
      isPublic: false,
      date: null
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handleCheckChange = this.handleCheckChange.bind(this);
  }

  handleChange (e, field, v) {
    this.setState({[field]: e.target.value || v})
  }

  handleCheckChange(e) {
    this.setState({isPublic: !this.state.isPublic})
  }

  handleTimeChange (e, date, time) {
    this.setState({[time]: date});
  }

render () {
  return (

  <div style={{width: '600px'}}>
    <h1>Add a Dream</h1>
    <DatePicker
      hintText="Dream Date"
      value={this.state.date}
      onChange={(e, date) => this.handleTimeChange(e,date,'date')}
      mode='landscape'
    />
    <TextField
      floatingLabelText="Title"
      fullWidth={true}
      onChange={(e) => this.handleChange(e, 'title')}
    /><br />

    <TextField
      floatingLabelText="Content"
      multiLine={true}
      fullWidth={true}
      rows={3}
      onChange={(e) => this.handleChange(e, 'content')}
    />
    <br />
    <SelectField
      floatingLabelText="Type of Dream"
      value={this.state.dreamType}
      onChange={(e, i, v) => this.handleChange(e, 'dreamType', v)}
    >
      <MenuItem value="Daydream" primaryText="Daydream" />
      <MenuItem value="Lucid Dream" primaryText="Lucid Dream" />
      <MenuItem value="Nightmare" primaryText="Nightmare" />
      <MenuItem value="Normal Dream" primaryText="Normal Dream" />
      <MenuItem value="Recurring Dream" primaryText="Recurring Dream" />
    </SelectField>
    <br />
    <TimePicker
      format="ampm"
      hintText="Sleep Start"
      onChange={(e, date) => this.handleTimeChange(e, date, 'timeStart')}
    />
    <br />
    <TimePicker
      format="ampm"
      hintText="Sleep End"
      onChange={(e, date) => this.handleTimeChange(e, date, 'timeEnd')}
    />
    <br />
    <Checkbox
      label="Make this public?"
      labelPosition="left"
      onCheck={this.handleCheckChange}
    />
    <br />
    <RaisedButton label="Save" primary={true} onTouchTap={() => this.props.handleSubmit(this.state)} />
  </div>

  )
}
}


