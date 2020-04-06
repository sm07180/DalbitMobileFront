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

  useEffect(() => {
    setOpened(false)
  }, [title])

  return (
    <div>
      <ListStyled onClick={() => setOpened(opened ? false : true)} className={opened ? 'on' : ''}>
        <TitleWrap className={isTop ? 'is-top' : ''}>
          <i className="fas fa-thumbtack" style={{color: '#ff9100'}} />
          <span className="text">{title}</span>
        </TitleWrap>
        {/* <TimeWrap>
          <Time>{timeFormat(writeDt)}</Time>
          <ArrowDownBtn />
        </TimeWrap> */}
      </ListStyled>
      {opened && (
        <>
          <ListContent>
            <div>{title}</div>
            <div> {timeFormat(writeDt)}</div>
            <div>{contents}</div>
          </ListContent>
          <Buttons>
            <button>
              <i className="far fa-edit"></i>수정
            </button>
            <button>
              <i className="far fa-trash-alt"></i>
              삭제
            </button>
          </Buttons>
        </>
      )}
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

  .text {
    font-weight: bold;
    margin-left: 6px;
  }
`

const ListContent = styled.div`
  padding: 24px 18px;
  background-color: #f8f8f8;
  color: #616161;
  font-size: 14px;
  letter-spacing: -0.35px;
  div:nth-child(1) {
    color: #000000;
    font-size: 16px;
    line-height: 1.5;
    letter-spacing: -0.4px;
    transform: skew(-0.03deg);
  }
  div:nth-child(2) {
    margin-top: 6px;
    font-size: 12px;
    color: #bdbdbd;
    line-height: 1.08;
    letter-spacing: -0.3px;
    transform: skew(-0.03deg);
  }
  div:nth-child(3) {
    margin-top: 16px;
    font-size: 14px;
    line-height: 1.43;
    letter-spacing: -0.35px;
    transform: skew(-0.03deg);
  }
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
  &.on {
    background-color: #f8f8f8;
  }

  &:active {
    background-color: #efefef;
  }
`
const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  background-color: #f8f8f8;
  border-top: 1px solid #efefef;
  border-bottom: 1px solid #efefef;
  & button {
    padding: 20px 20px 12px 20px;
    font-size: 14px;
    line-height: 1.43;
    letter-spacing: -0.35px;
    text-align: left;
    color: #9e9e9e;
    transform: skew(-0.03deg);
    > i {
      display: inline-block;
      padding-right: 5px;
      font-size: 14px;
      color: #bdbdbd;
    }
  }
`
