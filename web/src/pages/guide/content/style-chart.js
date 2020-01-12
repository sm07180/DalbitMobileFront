/**
 * @title
 */
import React from 'react'
import styled from 'styled-components'
import ChartLine from './chart/chart-line'
import ChartBar from './chart/chart-bar'
import ChartDoughnut from './chart/chart-doughnut'
import ChartScatter from './chart/chart-scatter'

export default () => {
  //---------------------------------------------------------------------

  //---------------------------------------------------------------------

  return (
    <>
      <Content>
        <ChartLine />
        <ChartBar />
        <ChartDoughnut />
        <ChartScatter />
      </Content>
    </>
  )
}
//---------------------------------------------------------------------
const Content = styled.div``
