import React, { useState, useEffect } from 'react'
import { Modal, Container, Row, Col, Button, Form } from 'react-bootstrap'
import HouseholdAccountsTable from './HouseholdAccountsTable'
import ProgressButton from '../ProgressButton'
import praseExcelFile from './parse-excel-file'
import { HouseholdAccounts, put } from '../../api/household-accounts'
import { set, isEmpty } from 'lodash'

const itemSize = 6
const pageSize = 10

function ExcelFileModal(props: ExcelFileModalProps) {
  const { show } = props
  const [excelFileForm, setExcelFileForm] = useState<ExcelFileFormState>({
    validated: false,
    file: {},
    userId: '',
    model: [],
    saving: false,
  })
  const [householdAccounts, setHouseholdAccounts] = useState<HouseholdAccountsState>({
    printable: false,
    loading: false,
    items: [],
    page: 1,
    totalCount: 0,
    totalAmount: 0,
  })

  useEffect(() => {
    if (show) {
      setExcelFileForm({ validated: false, file: {}, userId: '', model: [], saving: false })
      setHouseholdAccounts({
        printable: false,
        loading: false,
        items: [],
        page: 1,
        totalCount: 0,
        totalAmount: 0,
      })
    }
  }, [show])

  const getItemsByPage = (page: number, model: HouseholdAccounts[]) => {
    const offset = (page - 1) * itemSize
    return model.slice(offset, offset + itemSize)
  }

  const onInputUserId = (userId: string) => {
    const model = excelFileForm.model.map(item => set(item, 'userId', userId))
    setExcelFileForm({ ...excelFileForm, userId, model })
  }

  const onInputExcelFile = async (file?: File | null) => {
    if (file) {
      setHouseholdAccounts({ ...householdAccounts, printable: true, loading: true })
      let model: HouseholdAccounts[] = []
      let invalidModel = false
      try {
        model = await praseExcelFile(file, excelFileForm.userId)
      } catch (error) {
        invalidModel = true
      }
      const totalAmount = model.reduce((sum, { useAmount }) => sum + useAmount, 0)
      const { page } = householdAccounts
      const items = getItemsByPage(page, model)
      setExcelFileForm({ ...excelFileForm, file: { value: file, invalidExcelFile: false, invalidModel }, model })
      setHouseholdAccounts({
        ...householdAccounts,
        printable: !invalidModel,
        loading: false,
        items,
        totalCount: model.length,
        totalAmount,
      })
    }
  }

  const onInputPage = (page: number) => {
    const { model } = excelFileForm
    const items = getItemsByPage(page, model)
    setHouseholdAccounts({ ...householdAccounts, loading: false, page, items })
  }

  const onSubmit = async () => {
    const { userId, file, model } = excelFileForm
    const invalidUserId = isEmpty(userId)
    const invalidExcelFile = !Boolean(file.value)
    const invalidModel = isEmpty(model)
    if (invalidUserId || invalidExcelFile || invalidModel) {
      setExcelFileForm({
        ...excelFileForm,
        validated: true,
        file: { ...file, invalidExcelFile, invalidModel },
      })
    } else if (file.value) {
      setExcelFileForm({ ...excelFileForm, saving: true })
      await put(userId, file.value, model)
      setExcelFileForm({ ...excelFileForm, saving: false })
      props.onSubmitted()
    } else {
      throw new Error('unexpected error')
    }
  }

  return (
    <Modal show={props.show} onHide={props.onCancel} size="xl">
      <Modal.Header closeButton>엑셀 파일 등록</Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            <Col>
              <ExcelFileForm
                {...excelFileForm}
                disabled={householdAccounts.loading || excelFileForm.saving}
                onInputUserId={onInputUserId}
                onInputExcelFile={onInputExcelFile}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              {householdAccounts.printable && (
                <HouseholdAccountsTable
                  {...householdAccounts}
                  size={itemSize}
                  pageSize={pageSize}
                  onInputPage={onInputPage}
                />
              )}
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onCancel} disabled={excelFileForm.saving}>
          Cancel
        </Button>
        <ProgressButton
          variant="primary"
          loading={excelFileForm.saving}
          onClick={onSubmit}
          disabled={isEmpty(householdAccounts.items)}>
          Submit
        </ProgressButton>
      </Modal.Footer>
    </Modal>
  )
}

export default ExcelFileModal

interface ExcelFileModalProps {
  show: boolean
  onCancel: () => void
  onSubmitted: () => void
}

function ExcelFileForm(props: ExcelFileFormProps) {
  const onInputUserId = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userId = e.target?.value || ''
    props.onInputUserId(userId)
  }

  const onInputExcelFile = async (e: React.FocusEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0)
    props.onInputExcelFile(file)
  }

  return (
    <Form noValidate validated={props.validated}>
      <Form.Row>
        <Form.Group as={Col}>
          <Form.Label>사용자 이름</Form.Label>
          <Form.Control type="text" value={props.userId} onInput={onInputUserId} required disabled={props.disabled} />
          <Form.Control.Feedback type="invalid">사용자 이름을 입력해 주세요.</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>공유 엑셀 파일</Form.Label>
          <Form.File id="input-excel-file" custom>
            <Form.File.Input
              required
              disabled={props.disabled}
              onInput={onInputExcelFile}
              accept=".xls,.xlsx,.cvs"
              isInvalid={props.file.invalidExcelFile || props.file.invalidModel}
            />
            <Form.File.Label data-browse="Browse">{props.file.value?.name || '파일을 선택해 주세요.'}</Form.File.Label>
            <Form.Control.Feedback type="invalid">
              {props.file.invalidExcelFile
                ? '엑셀 파일을 선택해 주세요.'
                : props.file.invalidModel
                ? '공유 엑셀 파일 내용을 분석 할 수 없습니다.'
                : ''}
            </Form.Control.Feedback>
          </Form.File>
        </Form.Group>
      </Form.Row>
    </Form>
  )
}

interface ExcelFileFormProps extends ExcelFileFormState {
  disabled: boolean
  onInputUserId: (userId: string) => void
  onInputExcelFile: (file?: File | null) => void
}

interface ExcelFileFormState {
  validated: boolean
  file: {
    value?: File | null
    invalidExcelFile?: boolean
    invalidModel?: boolean
  }
  userId: string
  model: HouseholdAccounts[]
  saving: boolean
}

interface HouseholdAccountsState {
  printable: boolean
  loading: boolean
  items: HouseholdAccounts[]
  page: number
  totalCount: number
  totalAmount: number
}
