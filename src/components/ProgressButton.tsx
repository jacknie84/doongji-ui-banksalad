import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Button, ButtonProps, Spinner } from 'react-bootstrap'
import { DefaultProgressType, ProgressState } from '../store/progress'

const defaultTypes = [DefaultProgressType.UPLOAD, DefaultProgressType.DOWNLOAD]

function ProgressButton(props: ProgressButtonProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const progress = useSelector((state: { progress: ProgressState }) => state.progress)
  const { types = defaultTypes, progressText = 'Loading...', children, disabled = false } = props

  useEffect(() => setLoading(types.some(type => Object.keys(progress).indexOf(type) >= 0)), [types, progress])

  return (
    <Button {...props} disabled={disabled || loading}>
      {loading && <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />}
      {loading ? progressText : children}
    </Button>
  )
}

export default ProgressButton

interface ProgressButtonProps extends ButtonProps {
  types?: string[]
  progressText?: string
  disabled?: boolean
  children?: string
  onClick?: () => void
}
