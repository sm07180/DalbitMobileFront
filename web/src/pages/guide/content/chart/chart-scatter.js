import React, {Component} from 'react'
import {Scatter} from 'react-chartjs-2'
import styled from 'styled-components'

const data = {
  labels: ['비제이 실시간 랭킹'],
  datasets: [
    {
      label: '실시간 랭킹',
      fill: false,
      backgroundColor: 'rgba(75,192,192,0.4)',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 6,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [
        {
          x: 65,
          y: 75
        },
        {
          x: 59,
          y: 49
        },
        {
          x: 80,
          y: 90
        },
        {
          x: 81,
          y: 29
        },
        {
          x: 56,
          y: 36
        },
        {
          x: 55,
          y: 25
        },
        {
          x: 40,
          y: 18
        },
        {
          x: 32,
          y: 32
        }
      ]
    }
  ]
}

export default class LineDemo extends Component {
  render() {
    return (
      <ChartWrap>
        <h2>달빛라이브:스케터차트</h2>
        <Scatter ref="chart" data={data} />
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
