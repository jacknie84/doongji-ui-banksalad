import React from 'react'
import { Row, Col } from 'reactstrap'
import RecordFilters from './filters'
import RecordContents from './contents'

function Records() {
  return (
    <Row>
      <Col lg="3">
        <RecordFilters />
      </Col>
      <Col>
        <RecordContents />
      </Col>
    </Row>
  )
}

export default Records
