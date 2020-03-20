import React from 'react'
import styled from 'styled-components'

// image
import arrowDownImg from '../images/NoticeArrowDown.svg'

const List = props => {
  return (
    <ListStyled>
      <TitleWrap>추천 DJ 신청 접수 안내</TitleWrap>
      <TimeWrap>
        <Time>2020 01.14 11:30</Time>
        <ArrowDownBtn />
      </TimeWrap>
    </ListStyled>
  )
}

export default List

const ArrowDownBtn = styled.button`
  width: 36px;
  height: 36px;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(${arrowDownImg});
`

const Time = styled.div`
  font-size: 12px;
  letter-spacing: -0.3px;
  color: #bdbdbd;
  margin-right: 6px;
`

const TimeWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const TitleWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: #424242;
  font-size: 14px;
`

const ListStyled = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 47px;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
`
