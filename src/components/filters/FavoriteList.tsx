import React from 'react'
import { ListGroup, ListGroupItem } from 'react-bootstrap'
import Paginations from '../Paginations'

function FavoriteList() {
  return (
    <>
      <p className="text-muted">즐겨 찾는 필터 목록</p>
      <ListGroup className="mb-2" variant="flush">
        <ListGroupItem action active onClick={console.log.bind(console)}>
          즐겨 찾는 필터1
        </ListGroupItem>
        <ListGroupItem action onClick={console.log.bind(console)}>
          즐겨 찾는 필터2
        </ListGroupItem>
      </ListGroup>
      <Paginations
        className="justify-content-center"
        options={{
          page: 3,
          size: 5,
          pageSize: 1,
          totalCount: 31,
        }}
        onInputPage={console.log.bind(console)}
      />
    </>
  )
}

export default FavoriteList
