import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Condition } from 'doongji-ui-banksalad'
import { Row, Col, Button } from 'react-bootstrap'
import RetrievedConditions from './RetrievedConditions'
import { fetchById, save, RetrievedCondition } from '../../api/retrieved-conditions'
import RetrieveModal from './RetrieveModal'
// import TestButton from '../TestButton'
import { push } from '../../store/toasts'

function Filters(props: FiltersProps) {
  const dispatch = useDispatch()
  const [retrievedConditions, setRetrievedConditions] = useState<RetrievedConditionsState>({ initialized: false })
  const [retrieveModal, setRetrieveModal] = useState<RetrieveModalState>({ show: false })

  const onClickNewCondition = () => {
    setRetrieveModal({ show: true })
  }

  const onSelectRetrievedCondition = async (selectedId?: number) => {
    if (selectedId) {
      const condition = await fetchById(selectedId)
      setRetrievedConditions({ initialized: true, selected: condition })
      setRetrieveModal({ show: true, condition })
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
    const selected = await save(condition)
    setRetrieveModal({ show: false })
    setRetrievedConditions({ initialized: false, selected })
    dispatch(push({ title: '시스템 알림', content: `${selected.name} 검색 조건 검색 성공` }))
  }

  return (
    <Row>
      <Col>
        <Button variant="primary" className="mb-2" block onClick={onClickNewCondition}>
          새로운 검색 조건
        </Button>
        <RetrieveModal
          {...retrieveModal}
          onCancel={() => setRetrieveModal({ show: false })}
          onSubmit={onSubmitRetrieve}
        />
        <RetrievedConditions
          initialized={retrievedConditions.initialized}
          selectedId={retrievedConditions.selected?.id || null}
          onInitialized={() => setRetrievedConditions({ ...retrievedConditions, initialized: true })}
          onSelect={onSelectRetrievedCondition}
        />
        <RetrievedConditions
          initialized={retrievedConditions.initialized}
          selectedId={retrievedConditions.selected?.id || null}
          favorite
          onInitialized={() => setRetrievedConditions({ ...retrievedConditions, initialized: true })}
          onSelect={onSelectRetrievedCondition}
        />
        {/* <TestButton /> */}
      </Col>
    </Row>
  )
}

export default Filters

interface FiltersProps {
  onRetrieve: (condition: Condition) => void
}

interface RetrievedConditionsState {
  initialized: boolean
  selected?: RetrievedCondition
}

interface RetrieveModalState {
  show: boolean
  condition?: RetrievedCondition
}
