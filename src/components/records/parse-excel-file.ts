import { HouseholdAccounts } from '../../api/household-accounts'
import XLSX from 'xlsx'

type Cell = string | number | null | undefined
type Row = Array<Cell>
type BinaryString = string | ArrayBuffer | null

export default function parseExcelFile(excelFile: File, userId: string): Promise<HouseholdAccounts[]> {
  const reader = new FileReader()
  const promise = new Promise<HouseholdAccounts[]>((resolve, reject) => {
    reader.onload = ({ target }) => {
      try {
        const items = parseBinaryString(userId, target?.result)
        resolve(items)
      } catch (error) {
        reject(error)
      }
    }
  })
  reader.readAsBinaryString(excelFile)
  return promise
}

function parseBinaryString(userId: string, binaryString?: BinaryString): HouseholdAccounts[] {
  if (binaryString) {
    const workBook = XLSX.read(binaryString, { type: 'binary' })
    const workSheet = workBook.Sheets[workBook.SheetNames[1]]
    const rows = XLSX.utils.sheet_to_json<Row>(workSheet, { header: 1, raw: false })
    return rows.slice(1).map(row => ({
      useDate: row[0] as string,
      useTime: row[1] as string,
      type: row[2] as string,
      category: row[3] as string,
      subCategory: row[4] as string,
      description: row[5] as string,
      useAmount: parseFloat(row[6] as string),
      useCurrency: row[7] as string,
      useObject: row[8] as string,
      userId,
    }))
  } else {
    return []
  }
}
