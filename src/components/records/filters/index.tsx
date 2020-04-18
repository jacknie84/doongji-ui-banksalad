import React, { useState } from 'react'
import { Selector, Page } from 'doongji-ui-banksalad'
import { Row, Col, ListGroup, ListGroupItem } from 'reactstrap'
import RecentlyUsed from './RecentlyUsed'

function RecordFilters() {
  const [recentlyUsed, setRecentlyUsed] = useState<RecentlyUsedState>({
    selectedFields: [''],
    pagination: { page: 1, size: 5 },
    condition: { predicates: [] },
    totalCount: 0,
    content: [],
  })

  const onInputRecentlyUsedPage = (newPage: number) => {
    const clone = { ...recentlyUsed }
    const { pagination = { page: 1, size: 5 } } = clone
    pagination.page = newPage
    clone.pagination = pagination
    setRecentlyUsed(clone)
  }

  return (
    <Row>
      <Col>
        <RecentlyUsed
          page={recentlyUsed.pagination?.page || 1}
          size={recentlyUsed.pagination?.size || 5}
          content={recentlyUsed.content}
          totalCount={recentlyUsed.totalCount}
          onInputPage={onInputRecentlyUsedPage}
        />
        <ListGroup>
          <ListGroupItem>즐겨 찾는 필터1</ListGroupItem>
          <ListGroupItem>즐겨 찾는 필터2</ListGroupItem>
        </ListGroup>
      </Col>
    </Row>
  )
}

export default RecordFilters

interface RecentlyUsedState extends Selector, Page<any> {}
