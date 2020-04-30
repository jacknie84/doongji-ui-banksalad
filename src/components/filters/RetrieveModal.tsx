import React, { useState, useEffect } from 'react'
import { PredicateOperator } from 'doongji-ui-banksalad'
import { Modal, Form, Button, Col, InputGroup, DropdownButton, Dropdown } from 'react-bootstrap'
import { RetrievedCondition, RetrievedConditionPredicate } from '../../api/retrieved-conditions'
import { v4 as uuid } from 'uuid'
import { set } from 'lodash'

function RetrieveModal(props: RetrieveModalProps) {
  const { show, condition } = props
  const [name, setName] = useState<string>('')
  const [favorite, setFavorite] = useState<boolean>(false)
  const [predicates, setPredicates] = useState<RetrievedPredicatesState>({})

  useEffect(() => {
    if (show) {
      setName(condition?.name || '제목없음')
      setFavorite(condition?.favorite || false)
      setPredicates((condition?.predicates || []).reduce((object, predicate) => set(object, uuid(), predicate), {}))
    }
  }, [show, condition])

  function onInputPredicate(key: string, predicate: RetrievedConditionPredicate) {
    const clone = { ...predicates }
    clone[key] = predicate
    setPredicates(clone)
  }

  function onClickAddPredicate() {
    const predicate = {
      fieldName: 'useDate',
      fieldValues: '',
      operator: 'EQUALS' as PredicateOperator,
    }
    setPredicates({ ...predicates, [uuid()]: predicate })
  }

  function onDeletePredicate(key: string) {
    const clone = { ...predicates }
    delete clone[key]
    setPredicates(clone)
  }

  const onInputName = (e: React.FormEvent<HTMLInputElement>) => setName(e.currentTarget.value)

  return (
    <Modal show={props.show} onHide={props.onCancel}>
      <Modal.Header closeButton>검색</Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>이름</Form.Label>
              <Form.Control type="text" value={name} onInput={onInputName} onFocus={() => setName('')} />
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Check type="checkbox" label="즐겨찾기" checked={favorite} onInput={() => setFavorite(!favorite)} />
            </Form.Group>
          </Form.Row>

          <Form.Group>
            <Form.Label>
              조건 목록
              <Button variant="primary" size="sm" className="ml-1" onClick={onClickAddPredicate}>
                +
              </Button>
            </Form.Label>
            {Object.entries(predicates).map(([key, predicate]) => (
              <FormPredicate
                key={key}
                predicate={predicate}
                onInput={predicate => onInputPredicate(key, predicate)}
                onDelete={() => onDeletePredicate(key)}
              />
            ))}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onCancel}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={() =>
            props.onSubmit({ id: props.condition?.id, name, favorite, predicates: Object.values(predicates) })
          }>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default RetrieveModal

interface RetrieveModalProps {
  show: boolean
  condition?: RetrievedCondition
  onCancel: () => void
  onSubmit: (condition: RetrievedCondition) => void
}

interface RetrievedPredicatesState {
  [key: string]: RetrievedConditionPredicate
}

const fields: { [key: string]: string } = {
  useDate: '날짜',
  useTime: '시간',
  type: '타입',
  category: '대분류',
  subCategory: '소분류',
  description: '내용',
  useAmount: '금액',
  useCurrency: '화폐',
  useObject: '결제수단',
  userId: '사용자',
}

const operators: { [key: string]: string } = {
  IS_NULL: '없다.',
  IS_NOT_NULL: '있다.',
  EQUALS: '같다.',
  NOT_EQUALS: '같지 않다.',
  IN: '포함 된다.',
  NOT_IN: '포함 되지 않는다.',
  GREATER_THAN: '크다.',
  GREATER_THAN_EQUALS: '크거나 같다.',
  LESS_THAN: '작다.',
  LESS_THAN_EQUALS: '작거나 같다.',
  STARTS_WITH: '단어가 시작 된다.',
  ENDS_WITH: '단어가 끝난다.',
  CONTAINS: '단어가 포함된다.',
}

function FormPredicate(props: FormPredicateProps) {
  const { predicate, onInput } = props
  const { fieldName, operator, fieldValues } = predicate

  const onSelectField = (key: string) => onInput({ ...predicate, fieldName: key })
  const onSelectOperator = (key: string) => onInput({ ...predicate, operator: key as PredicateOperator })
  const onInputFieldValues = (e: React.FormEvent<HTMLInputElement>) =>
    onInput({ ...predicate, fieldValues: e.currentTarget.value })

  return (
    <Form.Row>
      <Form.Group as={Col} sm={11}>
        <InputGroup>
          <DropdownButton
            id="form-predicate-field"
            as={InputGroup.Prepend}
            variant="outline-secondary"
            title={fields[fieldName] || '선택'}
            size="sm">
            {Object.entries(fields).map(([key, value]) => (
              <Dropdown.Item onClick={() => onSelectField(key)}>{value}</Dropdown.Item>
            ))}
          </DropdownButton>
          <Form.Control size="sm" onInput={onInputFieldValues} value={fieldValues} />
          <DropdownButton
            id="form-predicate-operator"
            as={InputGroup.Append}
            variant="outline-secondary"
            title={operators[operator] || '선택'}
            size="sm">
            {Object.entries(operators).map(([key, value]) => (
              <Dropdown.Item onClick={() => onSelectOperator(key)}>{value}</Dropdown.Item>
            ))}
          </DropdownButton>
        </InputGroup>
      </Form.Group>
      <Form.Group as={Col}>
        <Button variant="warning" size="sm" onClick={props.onDelete}>
          x
        </Button>
      </Form.Group>
    </Form.Row>
  )
}

interface FormPredicateProps {
  predicate: RetrievedConditionPredicate
  onInput: (predicate: RetrievedConditionPredicate) => void
  onDelete: () => void
}
