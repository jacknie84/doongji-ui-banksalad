import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import * as serviceWorker from './serviceWorker'
import 'bootstrap/dist/css/bootstrap.min.css'
import initialize from './initialize'
import { Provider } from 'react-redux'
import store from './store'
import Numeral from 'numeral'

Numeral.register('locale', 'kr', {
  currency: { symbol: '￦' },
  delimiters: { decimal: '.', thousands: ',' },
  abbreviations: { thousand: '천', million: '백만', billion: '십억', trillion: '조' },
  ordinal: (value: number) => '',
})
Numeral.locale('kr')

initialize().then(() =>
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
    document.getElementById('root'),
  ),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
