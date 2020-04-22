import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Toast } from 'react-bootstrap'
import { ToastsState, ToastPayload, empty } from '../store/toasts'
import { isEmpty } from 'lodash'
import { v4 as uuid } from 'uuid'

const closeDelay = 3000

function GlobalToasts() {
  const dispatch = useDispatch()
  const messages = useSelector<{ toasts: ToastsState }>(state => state.toasts) as ToastsState
  const [toasts, setToasts] = useState<GlobalToastsState>([])

  useEffect(() => {
    if (!isEmpty(messages)) {
      const shown = toasts.filter(({ show }) => show)
      setToasts([...shown, ...messages.map(message => ({ ...message, show: true, id: uuid() }))])
      dispatch(empty())
    }
  }, [dispatch, toasts, messages])

  const onCloseToast = (index: number) => {
    toasts[index].show = false
    setToasts([...toasts])
  }

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: 'relative',
        minHeight: '200px',
      }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
        }}>
        {toasts.map((toast, index) => (
          <GlobalToast {...toast} key={toast.id} onClose={() => onCloseToast(index)} />
        ))}
      </div>
    </div>
  )
}

export default GlobalToasts

type GlobalToastsState = GlobalToastState[]

interface GlobalToastState extends ToastPayload {
  id: string
  show: boolean
}

function GlobalToast(props: GlobalToastProps) {
  return (
    <Toast onClose={props.onClose} show={props.show} delay={closeDelay} autohide>
      {props.title && (
        <Toast.Header>
          <strong className="mr-auto">{props.title}</strong>
          <small>just now</small>
        </Toast.Header>
      )}
      <Toast.Body>{props.content}</Toast.Body>
    </Toast>
  )
}

interface GlobalToastProps extends GlobalToastState {
  onClose: () => void
}
