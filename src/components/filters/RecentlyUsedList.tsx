import React from 'react'
import { ListGroup } from 'react-bootstrap'
import Paginations from '../Paginations'

function RecentlyUsedList(props: RecentlyUsedListProps) {
  return (
    <>
      <ListGroup className="mb-2" variant="flush">
        {props.content.map(({ id, name }, index) => (
          <ListGroup.Item
            action
            active={props.selectedId === id}
            key={index}
            onClick={(e: React.MouseEvent) => props.onSelect(id)}>
            {name}
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Paginations
        className="justify-content-center"
        options={{
          page: props.page,
          size: props.size,
          pageSize: 1,
          totalCount: props.totalCount,
        }}
        onInputPage={props.onInputPage}
      />
    </>
  )
}

export default RecentlyUsedList

interface RecentlyUsedListProps {
  selectedId: number | null
  page: number
  size: number
  content: RecentlyUsedData[]
  totalCount: number
  onInputPage: (newPage: number) => void
  onSelect: (selectedId?: number) => void
}

export type RecentlyUsedData = {
  id?: number
  name: string
  lastRetrievedDate: string | null
}
