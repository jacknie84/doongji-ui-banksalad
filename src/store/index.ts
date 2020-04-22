import { configureStore, combineReducers } from '@reduxjs/toolkit'
import progress from './progress'
import toasts from './toasts'

const reducer = combineReducers({ progress, toasts })
const devTools = true

export default configureStore({ reducer, devTools })
