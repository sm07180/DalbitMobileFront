import React, {Component} from 'react'
import {Line} from 'react-chartjs-2'
import styled from 'styled-components'

const data = {
  labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  datasets: [
    {
      label: '별풍선 받은 횟수',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [65, 59, 80, 81, 56, 55, 40, 99, 27, 84, 77, 19]
    },
    {
      label: '좋아요 받은 갯수',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'white',
      borderColor: 'red',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'red',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'red',
      pointHoverBorderColor: 'red',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [54, 69, 70, 36, 56, 58, 43, 79, 60, 71, 80, 23]
    },
    {
      label: '골드 받은 갯수',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'white',
      borderColor: 'gold',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'gold',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'gold',
      pointHoverBorderColor: 'gold',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [47, 62, 87, 41, 62, 46, 51, 81, 72, 61, 70, 55]
    }
  ]
}

export default class LineDemo extends Component {
  render() {
    return (
      <ChartWrap>
        <h2>달빛라디오:라인형차트</h2>
        <Line ref="chart" data={data} />
      </ChartWrap>
    )
  }

  componentDidMount() {
    const {datasets} = this.refs.chart.chartInstance.data
    console.log(datasets[0].data)
  }
}
const ChartWrap = styled.div`
  width: 40%;
  margin: 0 auto;
`
