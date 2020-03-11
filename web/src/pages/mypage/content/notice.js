import React from 'react'
import styled from 'styled-components'

// image
import pen from 'images/pen.svg'

const Notice = () => {
  return (
    <div>
      <TopWrap>
        <TitleText>방송국 공지</TitleText>
        <WriteBtn>공지 작성하기</WriteBtn>
      </TopWrap>
    </div>
  )
}

const WriteBtn = styled.button`
  position: relative;
  padding: 12px 20px 12px 36px;
  border-radius: 10px;
  border: 1px solid #8556f6;
  cursor: pointer;
  font-size: 14px;
  color: #8556f6;

  &::after {
    position: absolute;
    top: 12px;
    left: 18px;
    content: '';
    width: 16px;
    height: 16px;
    background-repeat: no-repeat;
    background-image: url(${pen});
  }
`
const TitleText = styled.span`
  color: #8556f6;
  font-size: 20px;
  letter-spacing: -0.5px;
`

const TopWrap = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #8556f6;
  align-items: center;
  justify-content: space-between;
  margin-top: 54px;
  padding-bottom: 16px;
`

export default Notice
