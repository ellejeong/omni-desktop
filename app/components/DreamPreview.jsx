import React from 'react';
import { Link } from 'react-router'
import { Grid, Row, Col } from 'react-bootstrap'

export default (props) => {
  const dream = props.dream
  const date = new Date(dream.date)
  const locale = "en-us"
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  return (
    <Link to={`/dreams/${dream.id}`}>
      <Col sm={12} md={6} className="dream-box" >
      <div className="dream-box-overlay">
        <h5>{date.toLocaleString(locale, options)}</h5>
        <p>{dream.content.slice(0,250)}...</p>
      </div>
          <h5>{date.toLocaleString(locale, options)}</h5>
          <h3>{dream.title}</h3>
          {/*<p>{dream.content.slice(0,140)}...</p>*/}
          <p className="dream-type">{dream.dreamType}</p>
      </Col>
    </Link>
  )
}
