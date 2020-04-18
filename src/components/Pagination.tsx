import React from 'react'
import {
  Pagination as BPagination,
  PaginationItem as BPaginationItem,
  PaginationLink as BPaginationLink,
} from 'reactstrap'

function Pagination(props: { className?: string; options: PaginationOptions; onChangePage: (page: number) => void }) {
  const { page, size, totalCount, pageSize, first, previous, next, last } = props.options
  const totalPageSize = Math.floor(totalCount / size) + (totalCount % size > 0 ? 1 : 0)
  const startPage = pageSize === 1 ? page : pageSize * Math.floor(page / pageSize) + 1
  const endPage =
    pageSize === 1 ? page : startPage + pageSize - 1 > totalPageSize ? totalPageSize : startPage + pageSize - 1
  const prefix = [
    { active: false, disabled: 1 === page, page: 1, first, printable: false, renderable: first },
    { active: false, disabled: 1 === page, page: page - 1, previous, printable: false, renderable: previous },
  ]
  const suffix = [
    {
      active: false,
      disabled: totalPageSize === endPage,
      page: page + 1,
      next,
      printable: false,
      renderable: next,
    },
    {
      active: false,
      disabled: totalPageSize === endPage,
      page: totalPageSize,
      last,
      printable: false,
      renderable: last,
    },
  ]
  const items = []
  for (let i = startPage; i <= endPage; i++) {
    items.push({ active: i === page, disabled: false, page: i, printable: true, renderable: true })
  }
  return (
    <BPagination className={props.className}>
      {[...prefix, ...items, ...suffix]
        .filter(({ renderable }) => renderable)
        .map((options, index) => (
          <PaginationItem options={options} key={index} onClick={props.onChangePage} />
        ))}
    </BPagination>
  )
}

export default Pagination

function PaginationItem(props: { options: PaginationItemOptions; onClick: (e: number) => void }) {
  const {
    active,
    disabled,
    printable,
    first = false,
    previous = false,
    next = false,
    last = false,
    page,
  } = props.options

  return (
    <BPaginationItem active={active} disabled={disabled}>
      <BPaginationLink first={first} previous={previous} next={next} last={last} onClick={_ => props.onClick(page)}>
        {printable && page}
      </BPaginationLink>
    </BPaginationItem>
  )
}

export interface PaginationOptions {
  page: number
  size: number
  totalCount: number
  pageSize: number
  first: boolean
  previous: boolean
  next: boolean
  last: boolean
}

interface PaginationItemOptions {
  active: boolean
  disabled: boolean
  printable: boolean
  page: number
  first?: boolean
  previous?: boolean
  next?: boolean
  last?: boolean
}
