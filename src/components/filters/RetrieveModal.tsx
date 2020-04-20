import React, { useState, useEffect } from 'react'
import { PredicateOperator } from 'doongji-ui-banksalad'
import { Modal, Form, Button, Col, InputGroup, DropdownButton, Dropdown } from 'react-bootstrap'
import { RetrievedCondition, RetrievedConditionPredicate } from '../../api/retrieved-conditions'
import ProgressButton from '../ProgressButton'

function RetrieveModal(props: RetrieveModalProps) {
  const { show, condition } = props
  const [name, setName] = useState<string>('')
  const [favorite, setFavorite] = useState<boolean>(false)
  const [predicates, setPredicates] = useState<RetrievedConditionPredicate[]>([])

  useEffect(() => {
    if (show) {
      setName(condition?.name || '제목없음')
      setFavorite(condition?.favorite || false)
      setPredicates(condition?.predicates || [])
    }
  }, [show, condition])

  function onInputPredicate(index: number, predicate: RetrievedConditionPredicate) {
    const clone = [...predicates]
    clone[index] = predicate
    setPredicates(clone)
  }

  function onClickAddPredicate() {
    const predicate = {
      fieldName: 'useDate',
      fieldValues: '',
      operator: 'EQUALS' as PredicateOperator,
    }
    setPredicates([...predicates, predicate])
  }

  function onDeletePredicate(index: number) {
    const clone = [...predicates]
    clone.splice(index, 1)
    setPredicates(clone)
  }

  return (
    <Modal show={props.show} onHide={props.onCancel}>
      <Modal.Header closeButton>검색</Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>이름</Form.Label>
              <Form.Control type="text" value={name} onInput={onInputValue(setName)} />
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Check type="checkbox" label="즐겨찾기" checked={favorite} onInput={onInputChecked(setFavorite)} />
            </Form.Group>
          </Form.Row>

          <Form.Group>
            <Form.Label>
              조건 목록
              <Button variant="primary" size="sm" className="ml-1" onClick={onClickAddPredicate}>
                +
              </Button>
            </Form.Label>
            {predicates.map((predicate, index) => (
              <FormPredicate
                predicate={predicate}
                onInput={predicate => onInputPredicate(index, predicate)}
                onDelete={() => onDeletePredicate(index)}
              />
            ))}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onCancel}>
          Cancel
        </Button>
        <ProgressButton
          variant="primary"
          onClick={() => props.onSubmit({ id: props.condition?.id, name, favorite, predicates })}>
          Submit
        </ProgressButton>
      </Modal.Footer>
    </Modal>
  )
}

function onInputValue(callback: (value: string) => void) {
  return (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    callback(target.value)
  }
}

function onInputChecked(callback: (value: boolean) => void) {
  return (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    callback(!target.checked)
  }
}

export default RetrieveModal

interface RetrieveModalProps {
  show: boolean
  condition?: RetrievedCondition
  onCancel: () => void
  onSubmit: (condition: RetrievedCondition) => void
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
  const [labels, setLabels] = useState<LabelsState>({
    field: fields[props.predicate.fieldName],
    operator: operators[props.predicate.operator],
  })
  const [fieldValues, setFieldValues] = useState<string>('')

  useEffect(() => {
    setLabels({
      field: fields[props.predicate.fieldName],
      operator: operators[props.predicate.operator],
    })
    setFieldValues(props.predicate.fieldValues)
  }, [props.predicate])

  const onSelectField = ([key, value]: string[]) => {
    setLabels({ ...labels, field: value })
    props.onInput({ ...props.predicate, fieldName: key })
  }

  const onSelectOperator = ([key, value]: string[]) => {
    setLabels({ ...labels, operator: value })
    props.onInput({ ...props.predicate, operator: key as PredicateOperator })
  }

  const onInputValues = (fieldValues: string) => {
    props.onInput({ ...props.predicate, fieldValues })
  }

  return (
    <Form.Row>
      <Form.Group as={Col} sm={11}>
        <InputGroup>
          <DropdownButton
            id="form-predicate-field"
            as={InputGroup.Prepend}
            variant="outline-secondary"
            title={labels.field}
            size="sm">
            {Object.entries(fields).map(([key, value]) => (
              <Dropdown.Item onClick={() => onSelectField([key, value])}>{value}</Dropdown.Item>
            ))}
          </DropdownButton>
          <Form.Control size="sm" onInput={onInputValue(onInputValues)} value={fieldValues} />
          <DropdownButton
            id="form-predicate-operator"
            as={InputGroup.Append}
            variant="outline-secondary"
            title={labels.operator}
            size="sm">
            {Object.entries(operators).map(([key, value]) => (
              <Dropdown.Item onClick={() => onSelectOperator([key, value])}>{value}</Dropdown.Item>
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

interface LabelsState {
  field?: string
  operator?: string
}
