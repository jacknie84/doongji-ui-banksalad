import React, { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { Pagination, Page, Condition } from 'doongji-ui-banksalad'
import { Row, Col, Button } from 'react-bootstrap'
import RecentlyUsedList, { RecentlyUsedData } from './RecentlyUsedList'
import { fetchBySelector, fetchById, save, RetrievedCondition } from '../../api/retrieved-conditions'
import RetrieveModal from './RetrieveModal'
import FavoriteList from './FavoriteList'

function Filters(props: FiltersProps) {
  const [retrieve, setRetrieve] = useState<RetrievedState>({ modal: false })
  const [recentlyUsed, setRecentlyUsed] = useRecentlyUsedState()

  const onInputRecentlyUsedPage = async (page: number) => {
    const { totalCount, content } = await fetchRecentlyUsedPage(page)
    setRecentlyUsed({ ...recentlyUsed, totalCount, content, page })
  }

  const onSelectRecentlyUsed = async (selectedId?: number) => {
    if (selectedId) {
      const model = await fetchById(selectedId)
      setRetrieve({ modal: true, model })
    }
  }

  const onSubmitRetrieve = async (condition: RetrievedCondition) => {
    props.onRetrieve({
      predicates:
        condition.predicates?.map(({ fieldName, fieldValues, operator }) => ({
          field: fieldName,
          operator,
          values: fieldValues.split(',').map(value => value.trim()),
        })) || [],
    })
    await save(condition)
    onInputRecentlyUsedPage(1)
    setRetrieve({ modal: false, model: condition })
  }

  const onClickNewCondition = () => {
    const clone = { ...retrieve, modal: true }
    delete clone.model
    setRetrieve(clone)
  }

  return (
    <Row>
      <Col>
        <Button variant="primary" className="mb-2" block onClick={onClickNewCondition}>
          새로운 검색 조건
        </Button>
        <RetrieveModal
          show={retrieve.modal}
          condition={retrieve.model}
          onCancel={() => setRetrieve({ ...retrieve, modal: false })}
          onSubmit={onSubmitRetrieve}
        />
        <RecentlyUsedList
          selectedId={retrieve.model?.id || null}
          page={recentlyUsed.page}
          size={recentlyUsed.size}
          content={recentlyUsed.content}
          totalCount={recentlyUsed.totalCount}
          onInputPage={onInputRecentlyUsedPage}
          onSelect={onSelectRecentlyUsed}
        />
        <FavoriteList />
      </Col>
    </Row>
  )
}

export default Filters

interface FiltersProps {
  onRetrieve: (condition: Condition) => void
}

interface RecentlyUsedState extends Pagination, Page<RecentlyUsedData> {}

interface RetrievedState {
  modal: boolean
  model?: RetrievedCondition
}

const defaultPage = 1
const defaultSize = 5

function useRecentlyUsedState(): [RecentlyUsedState, Dispatch<SetStateAction<RecentlyUsedState>>] {
  const [fetched, setFetched] = useState<boolean>(false)
  const [recentlyUsed, setRecentlyUsed] = useState<RecentlyUsedState>({
    page: defaultPage,
    size: defaultSize,
    totalCount: 0,
    content: [],
  })

  useEffect(() => {
    if (!fetched) {
      fetchRecentlyUsedPage().then(({ totalCount, content }) =>
        setRecentlyUsed({ ...recentlyUsed, totalCount, content }),
      )
      setFetched(true)
    }
  }, [fetched, recentlyUsed])

  return [recentlyUsed, setRecentlyUsed]
}

async function fetchRecentlyUsedPage(page: number = defaultPage): Promise<Page<RecentlyUsedData>> {
  const { totalCount, content } = await fetchBySelector({
    selectedFields: ['id', 'name', 'lastRetrievedDate'],
    pagination: { page, size: defaultSize, orders: [{ property: 'lastRetrievedDate', direction: 'DESC' }] },
  })
  return {
    totalCount,
    content: content.map(({ id, name, lastRetrievedDate }) => ({
      id,
      name,
      lastRetrievedDate: lastRetrievedDate || null,
    })),
  }
}
