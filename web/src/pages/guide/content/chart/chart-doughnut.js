import React, {Component} from 'react'
import {Doughnut} from 'react-chartjs-2'
import styled from 'styled-components'

const data = {
  labels: ['방송시간', '청취시간', '누적 방송시간'],
  datasets: [
    {
      data: [50, 120, 480],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      hoverBackgroundColor: ['black', 'black', 'black']
    }
  ]
}

export default class LineDemo extends Component {
  render() {
    return (
      <ChartWrap>
        <h2>달빛라이브:도넛차트</h2>
        <Doughnut ref="chart" data={data} />
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
