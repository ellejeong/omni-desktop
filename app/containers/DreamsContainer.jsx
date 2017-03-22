import React from 'react'
import { connect } from 'react-redux'
import { receiveDreamEntry } from '../reducers/dreams'
import {browserHistory} from 'react-router'


export default connect(
  (state) => {
    return {
      dreams: state.dreams
    }
  },
  (dispatch) => {
    return {
      handleSubmit: function(state) {
        const { title, content, timeStart, timeEnd, dreamType, isPublic, date } = state
        dispatch(receiveDreamEntry(title, content, timeStart, timeEnd, dreamType, isPublic, date))
        browserHistory.push('/dreams/all')
      }
    }
  }
)(function DreamsContainer(props) {
  const propsToPass = {
    handleSubmit: props.handleSubmit,
    dreams: props.dreams
  }

  return (
    <div>
      { props.children && React.cloneElement(props.children, propsToPass) }
    </div>
    )
})
