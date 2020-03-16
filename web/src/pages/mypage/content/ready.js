import React from 'react'
import styled from 'styled-components'

export default props => {
  return (
    <ReadyWrap>
      <div>준비 중에 있습니다. 😊 ✌</div>
    </ReadyWrap>
  )
}

const ReadyWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  font-size: 20px;
`
