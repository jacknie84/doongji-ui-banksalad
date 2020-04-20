import React, { useState } from 'react'
import { Condition } from 'doongji-ui-banksalad'
import { Button } from 'react-bootstrap'
import ExcelFileModal from './ExcelFileModal'
import HouseholdAccountsTable, { HouseholdAccounts } from './HouseholdAccountsTable'

function Records(props: RecordsProps) {
  const [excelFile, setExcelFile] = useState<ExcelFileState>({ modal: false })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [householdAccounts, setHouseholdAccounts] = useState<HouseholdAccounts[]>([])

  return (
    <div>
      <Button variant="primary" className="mb-2" onClick={() => setExcelFile({ modal: true })}>
        뱅크샐러드 엑셀 파일 등록
      </Button>
      <ExcelFileModal show={excelFile.modal} onCancel={() => setExcelFile({ modal: false })} />
      <HouseholdAccountsTable householdAccounts={householdAccounts} />
    </div>
  )
}

export default Records

interface RecordsProps {
  condition: Condition
}

interface ExcelFileState {
  modal: boolean
}
