import React from 'react'
import styled from 'styled-components'

const Notice = () => {
  return (
    <div>
      <TopWrap>
        <span>방송국 공지</span>
        <WriteBtn>공지 작성하기</WriteBtn>
      </TopWrap>
    </div>
  )
}

const WriteBtn = styled.button`
  padding: 12px 20px;
  border-radius: 10px;
  border: 1px solid #8556f6;
  cursor: pointer;
`
const TopWrap = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #8556f6;
  align-items: center;
  justify-content: space-between;
`

export default Notice
