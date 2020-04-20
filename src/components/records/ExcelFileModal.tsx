import React, { useState } from 'react'
import { Modal, Container, Row, Col, Button, Form } from 'react-bootstrap'
import HouseholdAccountsTable, { HouseholdAccounts } from './HouseholdAccountsTable'
import { isEmpty } from 'lodash'
import ProgressButton from '../ProgressButton'

function ExcelFileModal(props: ExcelFileModalProps) {
  const [excelFile, setExcelFile] = useState<File | null>(null)
  const [householdAccounts, setHouseholdAccounts] = useState<HouseholdAccounts[]>([])

  const onInputExcelFile = (e: React.FocusEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0)
    if (file) {
      setExcelFile(file)
      // TODO excelFile parse
      const householdAccounts = [{}]
      setHouseholdAccounts(householdAccounts)
    }
  }

  return (
    <Modal show={props.show} onHide={props.onCancel} size="lg">
      <Modal.Header closeButton>엑셀 파일 등록</Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            <Col>
              <Form>
                <Form.File
                  id="input-excel-file"
                  label={excelFile?.name || '파일을 선택해 주세요.'}
                  data-browse="Browse"
                  custom
                  onInput={onInputExcelFile}
                  accept=".xls,.xlsx,.cvs"
                />
              </Form>
            </Col>
          </Row>
          <Row>
            <Col>{!isEmpty(householdAccounts) && <HouseholdAccountsTable householdAccounts={householdAccounts} />}</Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onCancel}>
          Cancel
        </Button>
        <ProgressButton variant="primary" onClick={props.onCancel}>
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
}
