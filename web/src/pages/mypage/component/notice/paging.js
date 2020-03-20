import React from 'react'
import styled from 'styled-components'

import arrowLeftImg from '../images/NoticeArrowLeft.svg'
import arrowRightImg from '../images/NoticeArrowRight.svg'

const Paging = props => {
  const {numbers} = props

  return (
    <PagingWrap>
      <ArrowBtn className="left" />
      {numbers.map((value, index) => (
        <NumberBtn key={index}>{value}</NumberBtn>
      ))}
      <ArrowBtn className="right" />
    </PagingWrap>
  )
}

export default Paging

const NumberBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  color: #bdbdbd;
  user-select: none;
  margin: 0 4px;

  &:hover {
    color: #fff;
    background-color: #8556f6;
    border-color: #8556f6;
  }
`

const ArrowBtn = styled.button`
  width: 36px;
  height: 36px;
  background-repeat: no-repeat;
  background-position: center;
  margin: 0 4px;

  &.left {
    background-image: url(${arrowLeftImg});
  }

  &.right {
    background-image: url(${arrowRightImg});
  }
`

const PagingWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
`
