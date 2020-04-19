import React, { useState } from 'react'
import { Condition } from 'doongji-ui-banksalad'
import { Container, Row, Col } from 'react-bootstrap'
import GlobalNavigation from './GlobalNavigation'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import Filters from './filters'
import Records from './records'
import Visualization from './visualization'

function App() {
  const [condition, setCondition] = useState<Condition>({ predicates: [] })

  return (
    <Container fluid>
      <GlobalNavigation />
      <Row>
        <Col lg="3">
          <Filters onRetrieve={setCondition} />
        </Col>
        <Col>
          <BrowserRouter>
            <Switch>
              <Redirect exact from="/" to="/records" />
              <Route path="/records">
                <Records condition={condition} />
              </Route>
              <Route path="/visualization">
                <Visualization />
              </Route>
            </Switch>
          </BrowserRouter>
        </Col>
      </Row>
    </Container>
  )
}

export default App
