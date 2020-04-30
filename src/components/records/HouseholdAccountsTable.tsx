import React, { useContext } from 'react'
import { Order, Direction } from 'doongji-ui-banksalad'
import { Table, Spinner, Button } from 'react-bootstrap'
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
          [
            <Caption {...props} key="caption" />,
            props.orders && props.onInputOrders ? (
              <OrderableThead key="thead" orders={props.orders} onInputOrders={props.onInputOrders} />
            ) : (
              <DefaultThead key="thead" />
            ),
            <Tbody {...props} key="tbody" />,
          ]
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
  orders?: Order[]
  onInputPage: (page: number) => void
  onInputOrders?: (orders: Order[]) => void
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

const columns: Column[] = [
  { property: 'useDate', label: '날짜' },
  { property: 'useTime', label: '시간' },
  { property: 'type', label: '타입' },
  { property: 'category', label: '대분류' },
  { property: 'subCategory', label: '소분류' },
  { property: 'description', label: '내용' },
  { property: 'useAmount', label: '금액' },
  { property: 'useCurrency', label: '화폐' },
  { property: 'useObject', label: '결제수단' },
  { property: 'userId', label: '사용자' },
]

interface Column {
  property: string
  label: string
}

export function OrderableThead(props: OrderableTheadProps) {
  const onInput = (property: string, direction: Direction | null) => {
    const columnProperties = columns.map(({ property }) => property)
    const orders = [...props.orders]
    const index = orders.findIndex(order => order.property === property)
    if (direction) {
      if (index >= 0) {
        orders[index].direction = direction
      } else {
        orders.push({ property, direction })
      }
    } else if (index >= 0) {
      orders.splice(index, 1)
    }
    props.onInputOrders(
      orders.sort(({ property: p1 }, { property: p2 }) => columnProperties.indexOf(p1) - columnProperties.indexOf(p2)),
    )
  }
  return (
    <thead>
      <tr>
        {columns.map(({ property, label }) => (
          <th>
            <CaretToggle
              property={property}
              direction={(props.orders.find(order => order.property === property) || {}).direction}
              onInput={onInput}>
              {label}
            </CaretToggle>
          </th>
        ))}
      </tr>
    </thead>
  )
}

interface OrderableTheadProps {
  orders: Order[]
  onInputOrders: (orders: Order[]) => void
}

interface DirectionsState {
  [key: string]: Direction
}

export function DefaultThead() {
  return (
    <thead>
      <tr>
        {columns.map(({ label }) => (
          <th>{label}</th>
        ))}
      </tr>
    </thead>
  )
}

export function CaretToggle(props: CaretToggleProps) {
  const { children, direction, property } = props

  const onClick = () => {
    switch (direction) {
      case 'DESC':
        props.onInput(property, 'ASC')
        break
      case 'ASC':
        props.onInput(property, null)
        break
      default:
        props.onInput(property, 'DESC')
    }
  }

  return (
    <Button variant="link" size="sm" onClick={onClick}>
      {children}
      {direction === 'ASC' ? <span>&#x25b4;</span> : direction === 'DESC' ? <span>&#x25be;</span> : ''}
    </Button>
  )
}

interface CaretToggleProps {
  children: string
  property: string
  direction?: Direction
  onInput: (property: string, direction: Direction | null) => void
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
