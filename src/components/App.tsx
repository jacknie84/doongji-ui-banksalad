import React, { useState } from 'react'
import { Condition } from 'doongji-ui-banksalad'
import { Container, Row, Col } from 'react-bootstrap'
import GlobalNavigation from './GlobalNavigation'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import Filters from './filters'
import Records from './records'
import Visualization from './visualization'
import GlobalToasts from './GlobalToasts'
import UserContext from './UserContext'

function App() {
  const [condition, setCondition] = useState<Condition>({ predicates: [] })

  return (
    <Container fluid>
      <GlobalNavigation />
      <UserContext.Provider value={{ jacknie: '정 현기', starry: '손 현지' }}>
        <Row>
          <Col lg="2">
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
      </UserContext.Provider>
      <GlobalToasts />
    </Container>
  )
}

export default App
