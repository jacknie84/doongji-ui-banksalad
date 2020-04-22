import React, { useContext } from 'react'
import { Table, Spinner } from 'react-bootstrap'
import Paginations from '../Paginations'
import { HouseholdAccounts } from '../../api/household-accounts'
import { isEmpty } from 'lodash'
import Numeral from 'numeral'
import UserContext from '../UserContext'

function HouseholdAccountsTable(props: HouseholdAccountsTableProps) {
  return (
    <>
      <Table className="mb-2" striped hover>
        {props.loading ? (
          <Loading />
        ) : (
          [<Caption {...props} key="caption" />, <Thead key="thead" />, <Tbody {...props} key="tbody" />]
        )}
      </Table>
      {!props.loading && (
        <Paginations className="justify-content-center" options={{ ...props }} onInputPage={props.onInputPage} />
      )}
    </>
  )
}

export default HouseholdAccountsTable

export interface HouseholdAccountsTableProps extends HouseholdAccountsTbodyProps, HouseholdAccountsCaptionProps {
  loading: boolean
  onInputPage: (page: number) => void
}

export function Loading() {
  return (
    <thead>
      <tr>
        <td className="text-center">
          <Spinner as="span" animation="border" role="status" variant="primary" aria-hidden="true" />
        </td>
      </tr>
    </thead>
  )
}
export function Caption(props: HouseholdAccountsCaptionProps) {
  return (
    <caption>
      금액 합계: <Amount>{props.totalAmount}</Amount>
    </caption>
  )
}
export function Thead() {
  return (
    <thead>
      <tr>
        <th>날짜</th>
        <th>시간</th>
        <th>타입</th>
        <th>대분류</th>
        <th>소분류</th>
        <th>내용</th>
        <th>금액</th>
        <th>화폐</th>
        <th>결제수단</th>
        <th>사용자</th>
      </tr>
    </thead>
  )
}
export function Tbody(props: HouseholdAccountsTbodyProps) {
  const users = useContext(UserContext)
  return (
    <tbody>
      {isEmpty(props.items) ? (
        <tr>
          <td colSpan={10} className="text-center">
            비어있음
          </td>
        </tr>
      ) : (
        props.items.map((item, index) => (
          <tr key={index}>
            <td>{item.useDate}</td>
            <td>{item.useTime}</td>
            <td>{item.type}</td>
            <td>{item.category}</td>
            <td>{item.subCategory}</td>
            <td>{item.description}</td>
            <td>
              <Amount>{item.useAmount}</Amount>
            </td>
            <td>{item.useCurrency}</td>
            <td>{item.useObject}</td>
            <td>{users[item.userId] || item.userId}</td>
          </tr>
        ))
      )}
    </tbody>
  )
}

export interface HouseholdAccountsTbodyProps {
  items: HouseholdAccounts[]
  page: number
  size: number
  pageSize: number
  totalCount: number
}

export interface HouseholdAccountsCaptionProps {
  totalAmount: number
}

function Amount(props: { children: number }) {
  return (
    <span className={`text-${props.children > 0 ? 'primary' : props.children < 0 ? 'danger' : 'muted'}`}>
      {Numeral(props.children).format('($0,0)')}
    </span>
  )
}
