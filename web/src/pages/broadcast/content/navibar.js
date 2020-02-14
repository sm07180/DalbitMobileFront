import React, {useState, useEffect} from 'react'
import styled from 'styled-components'

export default props => {
  return (
    <Container>
      <Title>{props.title}</Title>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  width: 362px;
  height: 56px;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-bottom: 0.5px;
  border-style: solid;
  border-color: #e0e0e0;
  margin-left: 20px;
`

const Title = styled.div``
