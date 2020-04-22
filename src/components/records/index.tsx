import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Condition } from 'doongji-ui-banksalad'
import { Button } from 'react-bootstrap'
import ExcelFileModal from './ExcelFileModal'
import HouseholdAccountsTable, { HouseholdAccountsCaptionProps } from './HouseholdAccountsTable'
import { push } from '../../store/toasts'
import { HouseholdAccounts, fetchBySelector } from '../../api/household-accounts'

function Records(props: RecordsProps) {
  const dispatch = useDispatch()
  const { condition } = props
  const [initialized, setInitialized] = useState<boolean>(false)
  const [excelFile, setExcelFile] = useState<ExcelFileState>({ modal: false })
  const [householdAccounts, setHouseholdAccounts] = useState<HouseholdAccountsState>({
    loading: true,
    items: [],
    page: 1,
    totalCount: 0,
    totalAmount: 0,
  })

  useEffect(() => {
    if (!initialized) {
      fetchHouseholdAccounts(1, condition).then(({ items, totalCount, totalAmount }) =>
        setHouseholdAccounts({ ...householdAccounts, loading: false, items, totalCount, totalAmount, page: 1 }),
      )
    }
    setInitialized(true)
  }, [initialized, householdAccounts, condition])

  const onSubmittedExcelFile = () => {
    excelFile.modal = false
    dispatch(push({ title: '시스템 알림', content: '뱅크샐러드 공유 엑셀 파일이 정상적으로 등록 되었습니다.' }))
    setHouseholdAccounts({ ...householdAccounts, loading: true, page: 1 })
    onInputPage(1)
  }

  const onInputPage = (page: number) => {
    fetchHouseholdAccounts(page, condition).then(({ items, totalCount, totalAmount }) =>
      setHouseholdAccounts({ ...householdAccounts, loading: false, items, totalCount, totalAmount, page }),
    )
  }

  return (
    <>
      <Button variant="primary" className="mb-2" onClick={() => setExcelFile({ modal: true })}>
        뱅크샐러드 엑셀 파일 등록
      </Button>
      <ExcelFileModal
        show={excelFile.modal}
        onCancel={() => setExcelFile({ modal: false })}
        onSubmitted={onSubmittedExcelFile}
      />
      <HouseholdAccountsTable {...householdAccounts} size={10} pageSize={10} onInputPage={onInputPage} />
    </>
  )
}

export default Records

interface RecordsProps {
  condition: Condition
}

interface ExcelFileState {
  modal: boolean
}

interface HouseholdAccountsState extends HouseholdAccountsCaptionProps {
  loading: boolean
  page: number
  items: HouseholdAccounts[]
  totalCount: number
}

async function fetchHouseholdAccounts(page: number, condition: Condition): Promise<HouseholdAccountsResponse> {
  const { content: items, totalCount } = await fetchBySelector({
    pagination: { page, size: 10, orders: [] },
    selectedFields: [],
    condition,
  })
  return { items, totalCount, totalAmount: 0 }
}

interface HouseholdAccountsResponse {
  items: HouseholdAccounts[]
  totalCount: number
  totalAmount: number
}
