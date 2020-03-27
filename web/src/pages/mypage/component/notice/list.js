import React, {useState, useEffect} from 'react'
import styled from 'styled-components'

import {WIDTH_MOBILE} from 'context/config'

// image
import arrowDownImg from '../images/NoticeArrowDown.svg'

const List = props => {
  const {isTop, title, contents, writeDt} = props
  const [opened, setOpened] = useState(false)

  const timeFormat = strFormatFromServer => {
    let date = strFormatFromServer.slice(0, 8)
    date = [date.slice(0, 4), date.slice(4, 6), date.slice(6)].join('.')
    let time = strFormatFromServer.slice(8)
    time = [time.slice(0, 2), time.slice(2, 4), time.slice(4)].join(':')
    return `${date} ${time}`
  }

  return (
    <div>
      <ListStyled onClick={() => setOpened(opened ? false : true)}>
        <TitleWrap className={isTop ? 'is-top' : ''}>{title}</TitleWrap>
        <TimeWrap>
          <Time>{timeFormat(writeDt)}</Time>
          <ArrowDownBtn />
        </TimeWrap>
      </ListStyled>
      {opened && <ListContent>{contents}</ListContent>}
    </div>
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

  @media (max-width: ${WIDTH_MOBILE}) {
    display: none;
  }
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

  &.is-top {
    color: #8556f6;
    font-size: 14px;
    letter-spacing: -0.35px;
  }
`

const ListContent = styled.div`
  padding: 24px 18px;
  background-color: #f8f8f8;
  color: #616161;
  font-size: 14px;
  letter-spacing: -0.35px;
`

const ListStyled = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 47px;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  user-select: none;

  &:active {
    background-color: #efefef;
  }
`
