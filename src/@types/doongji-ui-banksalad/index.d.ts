declare module 'doongji-ui-banksalad' {
  interface Selector {
    selectedFields: string[]
    pagination: Pagination
    condition?: Condition
  }

  interface Pagination {
    page: number
    size: number
    orders?: Order[]
  }

  interface Order {
    direction: 'ASC' | 'DESC'
    property: string
  }

  interface Condition {
    predicates: Predicate[]
  }

  interface Predicate {
    field: string
    operator: PredicateOperator
    values: string[]
  }

  type PredicateOperator =
    | 'IS_NULL'
    | 'IS_NOT_NULL'
    | 'EQUALS'
    | 'NOT_EQUALS'
    | 'IN'
    | 'NOT_IN'
    | 'GREATER_THAN'
    | 'GREATER_THAN_EQUALS'
    | 'LESS_THAN'
    | 'LESS_THAN_EQUALS'
    | 'STARTS_WITH'
    | 'ENDS_WITH'
    | 'CONTAINS'

  interface Page<T> {
    totalCount: number
    content: T[]
  }
}
