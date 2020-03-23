import React, {useState, useEffect} from 'react'
import styled from 'styled-components'

// component
import List from '../component/notice/list.js'
import Paging from '../component/notice/paging.js'
import WritePage from '../component/notice/writePage.js'

// image
import pen from 'images/pen.svg'
import WhitePen from '../component/images/WhitePen.svg'

const Notice = () => {
  const [writeStatus, setWriteStatus] = useState('off')

  const writeStatusHandler = () => {
    if (writeStatus === 'off') {
      setWriteStatus('on')
    } else if (writeStatus === 'on') {
      setWriteStatus('off')
    }
  }

  return (
    <>
      <TopWrap>
        <TitleText>방송국 공지</TitleText>
        <WriteBtn className={writeStatus} onClick={writeStatusHandler}>
          공지 작성하기
        </WriteBtn>
      </TopWrap>
      {writeStatus === 'off' ? (
        <>
          <List noticeList={[1, 2, 3, 4]} />
          <Paging pages={[1, 2, 3, 4]} />
        </>
      ) : (
        <WritePage />
      )}
    </>
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

  &.on {
    color: #fff;
    border-color: #bdbdbd;
    background-color: #bdbdbd;

    &::after {
      background-image: url(${WhitePen});
    }
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
