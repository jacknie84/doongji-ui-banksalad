import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Toast } from 'react-bootstrap'
import { ToastsState, ToastState, remove } from '../store/toasts'

const closeDelay = 3000

function GlobalToasts() {
  const dispatch = useDispatch()
  const toasts = useSelector<{ toasts: ToastsState }>(state => state.toasts) as ToastsState
  const onCloseToast = (id: string) => dispatch(remove(id))

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: 'relative',
        zIndex: 1000,
      }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
        }}>
        {toasts.map(toast => (
          <GlobalToast {...toast} key={toast.id} onClose={() => onCloseToast(toast.id)} />
        ))}
      </div>
    </div>
  )
}

export default GlobalToasts

function GlobalToast(props: GlobalToastProps) {
  return (
    <Toast onClose={props.onClose} show={props.show} delay={closeDelay} autohide animation>
      {props.title && (
        <Toast.Header className="bg-info">
          <strong className="mr-auto text-light">{props.title}</strong>
          <small>just now</small>
        </Toast.Header>
      )}
      <Toast.Body>{props.content}</Toast.Body>
    </Toast>
  )
}

interface GlobalToastProps extends ToastState {
  onClose?: () => void
}
