import React from 'react'
import { Pagination } from 'react-bootstrap'

function Paginations(props: PagiantionProps) {
  const { page, size, totalCount, pageSize, first = true, prev = true, next = true, last = true } = props.options
  const totalPageSize = getTotalPageSize(totalCount, size)
  const startPage = getStartPage(page, pageSize)
  const endPage = getEndPage(page, pageSize, startPage, totalPageSize)
  const items = [] as PaginationItemOptions[]

  if (first) items.push({ disabled: 1 === page, page: 1, type: 'first' })
  if (prev) items.push({ disabled: 1 === page, page: page - 1, type: 'prev' })
  for (let i = startPage; i <= endPage; i++) {
    items.push({ active: i === page, page: i, type: 'item' })
  }
  if (next) items.push({ disabled: totalPageSize <= endPage, page: page + 1, type: 'next' })
  if (last) items.push({ disabled: totalPageSize <= endPage, page: totalPageSize, type: 'last' })
  return (
    <Pagination className={props.className}>
      {items.map((options, index) => (
        <PaginationItem options={options} key={index} onClick={props.onInputPage} />
      ))}
    </Pagination>
  )
}

export default Paginations

function getTotalPageSize(totalCount: number, size: number): number {
  return Math.floor(totalCount / size) + (totalCount % size > 0 ? 1 : 0)
}

function getStartPage(page: number, pageSize: number): number {
  if (pageSize === 1) {
    return page
  } else {
    return pageSize * Math.floor(page / pageSize) + 1
  }
}

function getEndPage(page: number, pageSize: number, startPage: number, totalPageSize: number): number {
  if (pageSize === 1) {
    return page
  } else {
    const endPage = startPage + pageSize - 1
    return endPage > totalPageSize ? totalPageSize : endPage
  }
}

function PaginationItem(props: PaginationItemProps) {
  const { active = false, disabled = false, type = 'item', page } = props.options
  const onClick = () => props.onClick(page)
  switch (type) {
    case 'item':
      return (
        <Pagination.Item active={active} onClick={onClick}>
          {page}
        </Pagination.Item>
      )
    case 'first':
      return <Pagination.First disabled={disabled} onClick={onClick} />
    case 'prev':
      return <Pagination.Prev disabled={disabled} onClick={onClick} />
    case 'next':
      return <Pagination.Next disabled={disabled} onClick={onClick} />
    case 'last':
      return <Pagination.Last disabled={disabled} onClick={onClick} />
  }
}

export interface PagiantionProps {
  /**
   * bootstrap Pagination 컴포넌트에 className 값을 대입
   */
  className?: string
  /**
   * Pagination 컴포넌트 구성 옵션
   */
  options: PaginationOptions
  /**
   * 페이지가 입력 이벤트 핸들러
   */
  onInputPage: (page: number) => void
}

export interface PaginationOptions {
  /**
   * 현재 페이지 번호
   */
  page: number
  /**
   * 페이지 목록 갯수
   */
  size: number
  /**
   * 총 목록 갯수
   */
  totalCount: number
  /**
   * 출력하는 페이지 갯수
   */
  pageSize: number
  /**
   * 첫 페이지 이동하기 사용 여부
   */
  first?: boolean
  /**
   * 앞 페이지 이동하기 사용 여부
   */
  prev?: boolean
  /**
   * 뒤 페이지 이동하기 사용 여부
   */
  next?: boolean
  /**
   * 마지막 페이지 이동하기 사용 여부
   */
  last?: boolean
}

interface PaginationItemProps {
  options: PaginationItemOptions
  onClick: (page: number) => void
}

interface PaginationItemOptions {
  active?: boolean
  disabled?: boolean
  page: number
  type: 'item' | 'first' | 'prev' | 'next' | 'last'
}
