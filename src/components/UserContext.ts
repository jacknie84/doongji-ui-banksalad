import React from 'react'

export default React.createContext<UserContext>({})

interface UserContext {
  [key: string]: string
}
