import React, { useState } from 'react'
import { ListGroup, ListGroupItem } from 'reactstrap'
import Pagination from '../../Pagination'

function RecentlyUsed(props: RecentlyUsedProps) {
  const [paginationOptions, setPaginationOptions] = useState({
    first: true,
    last: true,
    next: true,
    previous: true,
    page: 1,
    size: 5,
    pageSize: 1,
    totalCount: 360,
  })

  return (
    <div>
      <ListGroup className="mb-2">
        <ListGroupItem active>사용중</ListGroupItem>
        <ListGroupItem>최근사용</ListGroupItem>
      </ListGroup>
      <Pagination
        className="text-center"
        options={paginationOptions}
        onChangePage={page => setPaginationOptions({ ...paginationOptions, page })}
      />
    </div>
  )
}

export default RecentlyUsed

interface RecentlyUsedProps {
  page: number
  size: number
  content: any[]
  totalCount: number
  onInputPage: (newPage: number) => void
}
