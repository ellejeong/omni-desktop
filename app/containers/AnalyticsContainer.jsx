import React from 'react'
import { connect } from 'react-redux'
import { Grid, Row } from 'react-bootstrap'

import WordCloud from '../components/Analytics/wordCloud';
import WeekHoursSleptChart from '../components/Analytics/weekHoursSlept';
import AverageHoursSlept from '../components/Analytics/averageHoursSlept';
import DreamTypesPie from '../components/Analytics/dreamTypesPie'
import SleepDebt from '../components/Analytics/sleepDebt';
import EmotionAverages from '../components/Analytics/emotionAverages'



export default connect(
  (state) => {
    return {
      weekDreams: state.analytics.week,
      user: state.analytics.user,
      dreams: state.dreams.list
    }
  }
)(function(props) {
  console.log('hi', props)
  return (
    <div>
      <h1>Dream and Sleep Stats</h1>
      <Grid className="dream-grid">
        {props.user && props.user.dreams &&
        <Row className="show-grid">
            <WeekHoursSleptChart weekDreams={props.weekDreams} />
            <AverageHoursSlept user={props.user} />
            <DreamTypesPie dreams={props.dreams}/>
            <SleepDebt user={props.user} />
            <EmotionAverages dreams={props.dreams} />
            <WordCloud dreams={props.user.dreams} />
        </Row>
            }
      </Grid>
    </div>
  )
})
