import React, { useEffect, useState } from 'react'
import { Page, Predicate } from 'doongji-ui-banksalad'
import { ListGroup } from 'react-bootstrap'
import Paginations from '../Paginations'
import { fetchBySelector } from '../../api/retrieved-conditions'

const size = 5
const pageSize = 1

function RetrievedConditions(props: RetrievedConditionsProps) {
  const { initialized, selectedId, favorite = false, onInitialized, onSelect = () => {} } = props
  const [page, setPage] = useState<number>(1)
  const [model, setModel] = useState<ModelState>({ content: [], totalCount: 0 })

  useEffect(() => {
    if (!initialized) {
      loadModel(1, favorite)
      onInitialized()
    }
  }, [initialized, selectedId, model.content, favorite, onInitialized])

  useEffect(() => loadModel(page, favorite), [page, favorite])

  const loadModel = (page: number, favorite: boolean) => {
    const predicates = (favorite ? [{ field: 'favorite', operator: 'EQUALS', values: ['true'] }] : []) as Predicate[]
    fetchBySelector({
      selectedFields: ['id', 'name', 'lastRetrievedDate'],
      condition: { predicates },
      pagination: { page, size, orders: [{ property: 'lastRetrievedDate', direction: 'DESC' }] },
    }).then(({ totalCount, content }) =>
      setModel({
        totalCount,
        content: content.map(({ id, name, lastRetrievedDate }) => ({
          id,
          name,
          lastRetrievedDate: lastRetrievedDate || null,
        })),
      }),
    )
  }

  return (
    <>
      <ListGroup className="mb-2" variant="flush">
        {model.content.map(({ id, name }, index) => (
          <ListGroup.Item action active={selectedId === id} key={index} onClick={() => onSelect(id)}>
            {name}
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Paginations
        className="justify-content-center"
        options={{ page, size, pageSize, totalCount: model.totalCount }}
        onInputPage={setPage}
      />
    </>
  )
}

interface RetrievedConditionsProps {
  initialized: boolean
  selectedId: number | null
  favorite?: boolean
  onSelect?: (selectedId?: number) => void
  onInitialized: () => void
}

export default RetrievedConditions

type ModelState = Page<RecentlyUsedData>

export type RecentlyUsedData = {
  id?: number
  name: string
  lastRetrievedDate: string | null
}
