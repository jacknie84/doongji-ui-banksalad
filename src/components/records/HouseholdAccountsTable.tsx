import React from 'react'
import { Table } from 'react-bootstrap'
import Paginations from '../Paginations'

function HouseholdAccountsTable(props: HouseholdAccountsTableProps) {
  return (
    <div>
      <Table className="mb-2" striped hover>
        <caption>금액 합계: &#8361; 1,293,810,293</caption>
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
        <tbody>
          <tr>
            <td colSpan={10} className="text-center">
              비어있음
            </td>
          </tr>
          <tr>
            <td>2019-04-19</td>
            <td>18:43</td>
            <td>수입</td>
            <td>급여</td>
            <td>미분류</td>
            <td>블릭스소프트</td>
            <td>&#8361; 133,480</td>
            <td>KRW</td>
            <td>보통예금(IBK급여통장)</td>
            <td>정현기</td>
          </tr>
          <tr>
            <td>2019-04-19</td>
            <td>18:43</td>
            <td>수입</td>
            <td>급여</td>
            <td>미분류</td>
            <td>블릭스소프트</td>
            <td>&#8361; 133,480</td>
            <td>KRW</td>
            <td>보통예금(IBK급여통장)</td>
            <td>정현기</td>
          </tr>
          <tr>
            <td>2019-04-19</td>
            <td>18:43</td>
            <td>수입</td>
            <td>급여</td>
            <td>미분류</td>
            <td>블릭스소프트</td>
            <td>&#8361; 133,480</td>
            <td>KRW</td>
            <td>보통예금(IBK급여통장)</td>
            <td>정현기</td>
          </tr>
        </tbody>
      </Table>
      <Paginations
        className="justify-content-center"
        options={{
          page: 1,
          size: 10,
          pageSize: 10,
          totalCount: 1290831,
        }}
        onInputPage={console.log.bind(console)}
      />
    </div>
  )
}

export default HouseholdAccountsTable

interface HouseholdAccountsTableProps {
  householdAccounts: HouseholdAccounts[]
}

export interface HouseholdAccounts {}
