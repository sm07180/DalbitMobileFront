import React, {Component} from 'react'
import {Bar} from 'react-chartjs-2'
import styled from 'styled-components'
import {red} from 'ansi-colors'

const data = {
  labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  datasets: [
    {
      label: '평균 시청자 수',
      backgroundColor: 'rgba(255,99,132,0.2)',
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'orangered',
      hoverBorderColor: 'white',
      hoverBorderWidth: '4',
      data: [1165, 859, 480, 381, 1656, 2355, 1140, 1822, 979, 565, 1641, 1100]
    }
  ]
}
var Options = {
  legend: {
    labels: {
      fontColor: 'blue'
    }
  }
}

export default class LineDemo extends Component {
  render() {
    return (
      <ChartWrap>
        <h2>달빛라디오:바형차트</h2>
        <Bar ref="chart" data={data} options={Options} />
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
