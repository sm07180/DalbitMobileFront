import React, {Component} from 'react'
import {Bar} from 'react-chartjs-2'
/**
  @brief react-chartjs-2 모듈 설치후 라이브러리에서 제공하는 컴포넌트{Bar},{Line},{Doughnut} 등  호출
 **/
import styled from 'styled-components'

const data = {
  labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  /** @brief 제공 컴포넌트의 통계 라벨의 값
   **/
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
      /**
        @brief 
        1.전체적인 datasets https://www.chartjs.org/docs/latest/charts/bar.html를 참고하여 큰틀의 스타일링 제어 및 data를 받아옴
        2.data:서버에서 가져올 데이터값의 배열 형식 
      **/
    }
  ]
}

var Options = {
  legend: {
    labels: {
      fontColor: 'blue'
    }
  },
  layout: {
    padding: {
      //left: 250,
      right: 0,
      top: 0,
      bottom: 0
    }
  },
  scales: {
    yAxes: [
      {
        ticks: {
          fontColor: 'red',
          fontSize: 50
        }
      }
    ],
    xAxes: [
      {
        ticks: {
          fontColor: 'blue',
          fontSize: 30
        }
      }
    ]
  }
}
/** @brief option이라는 프롭스 정보 값을 받아서 각각의 스타일링https://www.chartjs.org/docs/latest/general/performance.html
 * @todo 반응형시 폰트사이즈나 내부적인 변화요소에 대한 어려움이 있어서 아직 리서치 및 적용중
 **/

export default class LineDemo extends Component {
  render() {
    return (
      <ChartWrap>
        <h2>달빛라이브:바형차트</h2>
        <Bar ref="chart" data={data} options={Options} />
      </ChartWrap>
    )
  }

  componentDidMount() {
    const {datasets} = this.refs.chart.chartInstance.data
    /** @brief 데이터에 관한 접근 렌더후 .. chart.js도입시 펑션기반 컴포넌트:useEffect 로 변환
     **/
    console.log(datasets[0].data)
  }
}

const ChartWrap = styled.div`
  width: 80%;
  margin: 0 auto;
`
/** @brief 차트의 전체적인 크기는 styled-component로 캔버스의 상위박스를 제어
 **/
