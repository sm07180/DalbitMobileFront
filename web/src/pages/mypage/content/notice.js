import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'

import Api from 'context/api'

// context
import {Context} from 'context'

// component
import List from '../component/notice/list.js'
import WritePage from '../component/notice/writePage.js'
import Paging from 'components/ui/paging.js'

// image
import pen from 'images/pen.svg'
import WhitePen from '../component/images/WhitePen.svg'

import {WIDTH_MOBILE} from 'context/config'

const Notice = () => {
  const ctx = useContext(Context)
  const [writeStatus, setWriteStatus] = useState('off')
  const [searching, setSearching] = useState(true)

  const [listDetailed, setListDetailed] = useState([])
  const [totalPageNumber, setTotalPageNumber] = useState(null)
  const [page, setPage] = useState(1)

  const writeStatusHandler = () => {
    if (writeStatus === 'off') {
      setWriteStatus('on')
    } else if (writeStatus === 'on') {
      setWriteStatus('off')
    }
  }

  useEffect(() => {
    ;(async () => {
      const {memNo} = ctx.profile
      const params = {
        memNo,
        page,
        records: 10
      }
      const response = Api.mypage_notice_inquire(params)
      if (response.result === 'success') {
        if (list.length) {
          if (paging) {
            // const {totalPage} = paging
            // setTotalPageNumber(totalPage)
          }
          setListDetailed(list)
        } else {
          setListDetailed(false)
        }
      }
    })()
  }, [page])

  return (
    <>
      <TopWrap>
        <TitleText>방송국 공지</TitleText>
        {/* <WriteBtn className={writeStatus} onClick={writeStatusHandler}>
          공지 작성하기
        </WriteBtn> */}
      </TopWrap>
      {/* {writeStatus === 'off' ? (
        <>
          <List noticeList={[1, 2, 3, 4]} />
        </>
      ) : (
        <WritePage />
      )} */}

      <Paging setPage={setPage} totalPage={1} currentPage={page} />

      {/* <GlobalWriteBtn>
        <div className="inner" />
      </GlobalWriteBtn> */}
    </>
  )
}

const GlobalWriteBtn = styled.button`
  display: none;

  @media (max-width: ${WIDTH_MOBILE}) {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    bottom: 22px;
    right: 16px;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background-color: #8556f6;

    .inner {
      width: 27px;
      height: 27px;
      background-image: url(${WhitePen});
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
    }
  }
`

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

  @media (max-width: ${WIDTH_MOBILE}) {
    display: none;
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
