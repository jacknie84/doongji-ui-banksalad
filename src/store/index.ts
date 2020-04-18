import { configureStore, combineReducers } from '@reduxjs/toolkit'
import progress from './progress'

const reducer = combineReducers({ progress })
const devTools = true

export default configureStore({ reducer, devTools })
