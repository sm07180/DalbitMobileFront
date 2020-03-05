import React from 'react'
import styled from 'styled-components'

export default props => {
  //------------------------------------------------------ declare start
  //------------------------------------------------------ func start
  //------------------------------------------------------ components start
  return (
    <Container>
      <div>{props.title}</div>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 130px;
  align-items: center;
  justify-content: center;
  margin-bottom: 3vh;

  & > div {
    display: flex;
    color: #8556f6;
    font-size: 28px;
    font-weight: 600;
    line-height: 0.86;
    letter-spacing: -0.7px;
  }
`
