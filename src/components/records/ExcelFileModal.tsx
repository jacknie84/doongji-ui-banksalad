import React, { useState, useEffect } from 'react'
import { Modal, Container, Row, Col, Button } from 'react-bootstrap'
import HouseholdAccountsTable from './HouseholdAccountsTable'
import ProgressButton from '../ProgressButton'
import praseExcelFile from './parse-excel-file'
import { HouseholdAccounts, put } from '../../api/household-accounts'
import { set, isEmpty } from 'lodash'
import ExcelFileForm from './ExcelFileForm'

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
      setExcelFileForm({ validated: false, file: {}, userId: 'jacknie', model: [], saving: false })
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

  const getItemsByPage = (page: number, model: HouseholdAccounts[] = []) => {
    const offset = (page - 1) * itemSize
    return model.slice(offset, offset + itemSize)
  }

  const onHide = () => {
    if (!excelFileForm.saving) {
      props.onCancel()
    }
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
    <Modal
      show={props.show}
      onHide={onHide}
      size="xl"
      style={{ cursor: excelFileForm.saving || householdAccounts.loading ? 'progress' : 'auto' }}>
      <Modal.Header closeButton={!excelFileForm.saving}>엑셀 파일 등록</Modal.Header>
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
          progressText="Saving..."
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

export interface ExcelFileFormState {
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
