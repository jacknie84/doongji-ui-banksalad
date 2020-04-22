import React from 'react'
import { Button, ButtonProps, Spinner } from 'react-bootstrap'

function ProgressButton(props: ProgressButtonProps) {
  const { loading, progressText = 'Loading...', children, disabled = false } = props

  return (
    <Button {...props} disabled={disabled || loading}>
      {loading && <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />}
      {loading ? progressText : children}
    </Button>
  )
}

export default ProgressButton

interface ProgressButtonProps extends ButtonProps {
  loading: boolean
  progressText?: string
  disabled?: boolean
  children?: string
  onClick?: () => void
  onComplete?: () => void
}
