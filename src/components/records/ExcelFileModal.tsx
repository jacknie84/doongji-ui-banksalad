import React, { useState } from 'react'
import { Modal, Container, Row, Col, Button, Form } from 'react-bootstrap'
import HouseholdAccountsTable, { HouseholdAccounts } from './HouseholdAccountsTable'
import { isEmpty } from 'lodash'

function ExcelFileModal(props: ExcelFileModalProps) {
  const [householdAccounts, setHouseholdAccounts] = useState<HouseholdAccounts[]>([])

  const onInputExcelFile = () => {
    setHouseholdAccounts([{}])
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
                  label="뱅크샐러드 공유 엑셀 파일"
                  data-browse="파일 찾기"
                  custom
                  onInput={onInputExcelFile}
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
        <Button variant="primary" onClick={props.onCancel}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ExcelFileModal

interface ExcelFileModalProps {
  show: boolean
  onCancel: () => void
}
