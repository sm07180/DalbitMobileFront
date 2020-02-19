import React, {useState, useEffect} from 'react'
import styled from 'styled-components'

export default props => {
  //-------------------------------------------------------- declare start
  //-------------------------------------------------------- components start
  return (
    <Container>
      <Contents>
        <div>
          <p>
            <b>솜사탕사탕사탕</b> 님에게
          </p>
          <p>루비를 선물하시겠습니까?</p>
        </div>
      </Contents>
    </Container>
  )
}
//-------------------------------------------------------- styled start

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 338%;
`
const Contents = styled.div`
  display: flex;
  width: 100%;
  height: 98px;
  justify-content: center;
  align-items: center;

  & > div {
    width: 168px;
    height: 42px;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: -0.4px;
    text-align: center;
  }
`
