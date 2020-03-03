import React, {useState, useEffect} from 'react'
import styled from 'styled-components'

export default props => {
  console.log('## props.prev :', props.prev)
  return (
    <Container>
      <Back onClick={() => props._changeItem(props.prev)} />
      <Navi>{props.title}</Navi>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
`

const Navi = styled.div`
  display: flex;
  width: 100%;
  height: 56px;
  border-bottom-width: 1px;
  border-bottom-color: #eeeeee;
  border-bottom-style: solid;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.17;
  letter-spacing: -0.45px;
  align-items: center;
  justify-content: center;
`

const Back = styled.button`
  position: absolute;
  margin-left: 0px;
  width: 20px;
  height: 20px;
  background: url('https://devimage.dalbitcast.com/images/api/arrow_left.svg') no-repeat center;
`
