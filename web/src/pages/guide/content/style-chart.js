/**
 * @title
 */
import React from 'react'
import styled from 'styled-components'
import ChartLine from './chart/chart-line'
import ChartBar from './chart/chart-bar'
import ChartDoughnut from './chart/chart-doughnut'

export default () => {
  //---------------------------------------------------------------------

  //---------------------------------------------------------------------

  return (
    <>
      <Content>
        <ChartLine />
        <ChartBar />
        <ChartDoughnut />
      </Content>
    </>
  )
}
//---------------------------------------------------------------------
const Content = styled.div``
