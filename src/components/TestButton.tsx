import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button } from 'react-bootstrap'
import { push } from '../store/toasts'

function TestButton() {
  const disPatch = useDispatch()
  const [count, setCount] = useState<number>(0)
  const onClick = () => {
    disPatch(push({ title: 'Test Notification', content: `Hello Woald!!! Test Message. TestTest(${count})` }))
    setCount(count + 1)
  }
  return (
    <Button variant="warning" size="sm" onClick={onClick}>
      TEST
    </Button>
  )
}

export default TestButton
