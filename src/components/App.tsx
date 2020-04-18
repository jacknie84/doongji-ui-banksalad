import React from 'react'
import { Container } from 'reactstrap'
import GlobalNavigation from './GlobalNavigation'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import Records from './records'
import Visualization from './Visualization'

function App() {
  return (
    <Container>
      <GlobalNavigation />
      <BrowserRouter>
        <Switch>
          <Redirect exact from="/" to="/records" />
          <Route path="/records">
            <Records />
          </Route>
          <Route path="/visualization">
            <Visualization />
          </Route>
        </Switch>
      </BrowserRouter>
    </Container>
  )
}

export default App
