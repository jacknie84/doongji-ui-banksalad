import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Condition, Selector } from 'doongji-ui-banksalad'
import { Button, Row, Col, Form, Badge } from 'react-bootstrap'
import ExcelFileModal from './ExcelFileModal'
import HouseholdAccountsTable from './HouseholdAccountsTable'
import { push } from '../../store/toasts'
import { HouseholdAccounts, fetchBySelector } from '../../api/household-accounts'

const orders = [
  { property: 'useDate', direction: 'DESC' },
  { property: 'useTime', direction: 'DESC' },
]

function Records(props: RecordsProps) {
  const dispatch = useDispatch()
  const { condition } = props
  const [loading, setLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [size, setSize] = useState<number>(10)
  const [modal, setModal] = useState<boolean>(false)
  const [model, setModel] = useState<ModelState>({ items: [], totalCount: 0, totalAmount: 0 })

  useEffect(() => loadModel(page, size, condition), [page, size, condition])

  const loadModel = (page: number, size: number, condition: Condition) => {
    setLoading(true)
    const selector = { pagination: { page, size, orders }, selectedFields: [], condition } as Selector
    fetchBySelector(selector)
      .then(({ content, totalCount }) => setModel({ items: content, totalCount, totalAmount: 0 }))
      .then(() => setLoading(false))
  }

  const onInputItemSize = (e: React.FormEvent<HTMLInputElement>) => {
    setPage(1)
    setSize(parseInt(e.currentTarget.value) || 10)
  }

  const onSubmittedExcelFile = () => {
    setModal(false)
    if (page === 1) {
      loadModel(page, size, condition)
    } else {
      setPage(1)
    }
    dispatch(push({ title: '시스템 알림', content: '뱅크샐러드 공유 엑셀 파일 정상 등록' }))
  }

  return (
    <Row>
      <Col>
        <Form>
          <Form.Row>
            <Form.Group as={Col} sm={6}>
              <Form.Label>
                검색량 설정<Badge variant="info">{size}</Badge>
              </Form.Label>
              <Form.Control type="range" custom min={10} max={100} step={10} value={size} onInput={onInputItemSize} />
            </Form.Group>
            <Col sm={{ span: 2, offset: 4 }}>
              <Button variant="primary" className="mb-2" onClick={() => setModal(true)}>
                뱅크샐러드 엑셀 파일 등록
              </Button>
            </Col>
          </Form.Row>
        </Form>
        <ExcelFileModal show={modal} onCancel={() => setModal(false)} onSubmitted={onSubmittedExcelFile} />
        <HouseholdAccountsTable
          {...model}
          loading={loading}
          page={page}
          size={size}
          pageSize={10}
          onInputPage={setPage}
        />
      </Col>
    </Row>
  )
}

export default Records

interface RecordsProps {
  condition: Condition
}

interface ModelState {
  items: HouseholdAccounts[]
  totalCount: number
  totalAmount: number
}
