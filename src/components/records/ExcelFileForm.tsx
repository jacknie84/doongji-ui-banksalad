import React, { useContext } from 'react'
import { Col, Form } from 'react-bootstrap'
import { ExcelFileFormState } from './ExcelFileModal'
import UserContext from '../UserContext'

function ExcelFileForm(props: ExcelFileFormProps) {
  const users = useContext(UserContext)

  const onInputUserId = (e: React.ChangeEvent<HTMLInputElement>) => props.onInputUserId(e.currentTarget.value)

  const onInputExcelFile = (e: React.FocusEvent<HTMLInputElement>) =>
    props.onInputExcelFile(e.currentTarget.files?.item(0))

  return (
    <Form noValidate validated={props.validated}>
      <Form.Row>
        <Form.Group as={Col}>
          <Form.Label>사용자 선택</Form.Label>
          <Form.Control as="select" value={props.userId} onInput={onInputUserId} required disabled={props.disabled}>
            {Object.entries(users).map(([userId, username]) => (
              <option value={userId}>{username}</option>
            ))}
          </Form.Control>
          <Form.Control.Feedback type="invalid">사용자 이름을 입력해 주세요.</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>공유 엑셀 파일</Form.Label>
          <Form.File id="input-excel-file" custom>
            <Form.File.Input
              required
              disabled={props.disabled}
              onInput={onInputExcelFile}
              accept=".xlsx"
              isInvalid={props.file.invalidExcelFile || props.file.invalidModel}
            />
            <Form.File.Label data-browse="Browse">{props.file.value?.name || '파일을 선택해 주세요.'}</Form.File.Label>
            <Form.Control.Feedback type="invalid">
              {props.file.invalidExcelFile
                ? '엑셀 파일을 선택해 주세요.'
                : props.file.invalidModel
                ? '공유 엑셀 파일 내용을 분석 할 수 없습니다.'
                : '다시 입력해 주세요.'}
            </Form.Control.Feedback>
          </Form.File>
        </Form.Group>
      </Form.Row>
    </Form>
  )
}

export default ExcelFileForm

interface ExcelFileFormProps extends ExcelFileFormState {
  disabled: boolean
  onInputUserId: (userId: string) => void
  onInputExcelFile: (file?: File | null) => void
}
