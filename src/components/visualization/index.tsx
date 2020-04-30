import React, { useState, useEffect } from 'react'
import { Condition } from 'doongji-ui-banksalad'
import { Chart } from 'react-google-charts'
import { Tabs, Tab, Row, Col, Spinner } from 'react-bootstrap'
import { fetchGroupBy, GroupBy, StatisticsAmount } from '../../api/statistics'

function Visualization(props: VisualizationProps) {
  const { condition } = props
  const [type, setType] = useState<GroupBy>('year')

  return (
    <Row>
      <Col>
        <Tabs id="visualization-tabs" activeKey={type} onSelect={(eventKey: string) => setType(eventKey as GroupBy)}>
          {Object.entries(groupByOptions).map(([eventKey, { header, sort }], index) => (
            <Tab eventKey={eventKey} title={header} key={index}>
              <BarChart type={eventKey as GroupBy} sort={sort} condition={condition} />
            </Tab>
          ))}
        </Tabs>
      </Col>
    </Row>
  )
}

export default Visualization

interface VisualizationProps {
  condition: Condition
}

type StatisticsState = StatisticsAmount[]

interface GroupByOptions {
  header: string
  height: number
  sort: (a: string | number, b: string | number) => number
}

const groupByOptions: { [key: string]: GroupByOptions } = {
  year: { header: '년', height: 100, sort: desc },
  month: { header: '월', height: 50, sort: asc },
  day: { header: '일', height: 20, sort: asc },
  'day-of-week': { header: '요일', height: 50, sort: dow },
  hour: { header: '시간', height: 20, sort: asc },
  type: { header: '타입', height: 50, sort: asc },
  category: { header: '대분류', height: 20, sort: asc },
  'sub-category': { header: '소분류', height: 10, sort: asc },
  'use-object': { header: '결제수단', height: 20, sort: asc },
  'user-id': { header: '사용자', height: 100, sort: asc },
}

function BarChart(props: BarChartProps) {
  const { type, condition, sort } = props
  const [loading, setLoading] = useState<boolean>(false)
  const [statistics, setStatistics] = useState<StatisticsState>([])

  useEffect(() => {
    setLoading(true)
    fetchGroupBy(type, condition)
      .then(data => data.sort((a, b) => sort(a.group, b.group)))
      .then(setStatistics)
      .then(() => setLoading(false))
  }, [type, condition, sort])

  const { header, height } = groupByOptions[type]
  const bars = statistics.map(({ group, totalAmount }, index) => [group, totalAmount, resolveBarStyle(index)])
  const data = [[header, '금액', { role: 'style' }], ...bars]

  return loading ? (
    <Spinner animation="border" role="status" aria-hidden="true" />
  ) : (
    <Chart chartType="BarChart" width="100%" height={`${(data.length - 1) * height}px`} data={data} />
  )
}

interface BarChartProps {
  type: GroupBy
  sort: (a: string | number, b: string | number) => number
  condition: Condition
}

function resolveBarStyle(index: number): string {
  switch (index % 6) {
    case 0:
      return 'color: #007bff;'
    case 1:
      return 'color: #6c757d;'
    case 2:
      return 'color: #28a745;'
    case 3:
      return 'color: #dc3545;'
    case 4:
      return 'color: #ffc107;'
    case 5:
      return 'color: #17a2b8;'
    default:
      return 'color: gray;'
  }
}

function asc(a: string | number, b: string | number): number {
  return a > b ? 1 : a < b ? -1 : 0
}

function desc(a: string | number, b: string | number): number {
  return a > b ? -1 : a < b ? 1 : 0
}

function dow(a: string | number, b: string | number): number {
  const dowValues: { [key: string]: number } = { 월: 1, 화: 2, 수: 3, 목: 4, 금: 5, 토: 6, 일: 7 }
  return asc(dowValues[a as string], dowValues[b as string])
}
