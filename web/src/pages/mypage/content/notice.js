import React, {useState, useEffect, useContext, useReducer} from 'react'
import {useLocation, useHistory} from 'react-router-dom'
import styled from 'styled-components'

import Api from 'context/api'

// context
import {Context} from 'context'

// component
import List from '../component/notice/list.js'
import WritePage from '../component/notice/writePage.js'
import Header from '../component/header.js'
import Paging from 'components/ui/paging.js'
import NoResult from 'components/ui/new_noResult'
import Checkbox from './checkbox'
// image,color //
import pen from 'images/pen.svg'

import WhitePen from '../component/images/WhitePen.svg'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P, PHOTO_SERVER} from 'context/color'
import {IMG_SERVER, WIDTH_MOBILE} from 'context/config'

const Notice = (props) => {
  // 기본 State
  const [noticeList, setNoticeList] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(0)
  //Component 호출
  const [isAdd, setIsAdd] = useState(false)
  const [modifyItem, setModifyItem] = useState(null)
  Z

  const getNotice = useCallback(async () => {
    setMoreToggle(false)

    const {result, data} = await getMypageNotice({
      memNo: memNo,
      page: currentPage,
      records: 10
    })
    if (result === 'success') {
      setNoticeList(data.list)
      if (data.paging) {
        setTotalPage(data.paging.totalPage)
      }
    }
  }, [memNo, currentPage])

  const deleteNotice = useCallback(
    (noticeIdx) => {
      async function deleteNoiceContent() {
        const {result, data} = await deleteMypageNotice({
          memNo: memNo,
          noticeIdx: noticeIdx
        })
        if (result === 'success') {
          getNotice()
        }
      }
      deleteNoiceContent()
    },
    [memNo, currentPage]
  )

  useEffect(() => {
    getNotice()
  }, [currentPage])

  return (
    <>
      <Header>
        <h2 className="header-title">방송공지</h2>
        {urlrStr === context.profile.memNo && createWriteBtn()}
      </Header>
    </>
  )
}

const TopHistory = styled.div`
  position: fixed;
  top: 40px;
  left: 0;
  width: 100vw;

  background-color: #fff;
  z-index: 21;
  & header {
    padding: 16px 16px 16px 10px;
    display: flex;

    border-bottom: 1px solid #bdbdbd;
    button:nth-child(1) {
      width: 24px;
      height: 24px;
      background: url(${IMG_SERVER}/images/api/btn_back.png) no-repeat center center / cover;
    }
    h2 {
      width: calc(100% - 24px);
      font-size: 18px;
      font-weight: 600;
      line-height: 1.17;
      letter-spacing: -0.45px;
      text-align: center;
    }
  }
`

const GlobalWriteBtn = styled.button`
  display: none;

  @media (max-width: ${WIDTH_MOBILE}) {
    display: none;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: 12px;
    right: 0px;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background-color: #632beb;
    &.on {
      display: flex;
    }

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
  border: 1px solid #632beb;
  cursor: pointer;
  font-size: 14px;
  color: #632beb;

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

const ListWrap = styled.div`
  /* width: calc(100% + 32px);
  margin-left: -16px; */
  position: relative;
  .search {
    min-height: 200px;
  }
  a {
    display: block;
    width: 100%;
    height: 100%;
  }

  &.noticeIsTop {
    margin: 12px 0;
  }
  .write-btn {
    color: red;
  }

  .listWrap {
    position: relative;
  }
`

const TopWrap = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid ${COLOR_MAIN};
  align-items: center;
  margin-top: 24px;
  margin-bottom: 0px;
  padding-bottom: 12px;
  button:nth-child(1) {
    width: 24px;
    height: 24px;
    background: url(${IMG_SERVER}/images/api/btn_back.png) no-repeat center center / cover;
  }
  .title {
    width: calc(100% - 24px);
    color: ${COLOR_MAIN};
    font-size: 18px;
    font-weight: bold;
    letter-spacing: -0.5px;
    text-align: center;
  }
`

const Write = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #eeeeee;
  z-index: 21;

  .checkbox-wrap > div:first-child {
    margin: 8px 0 32px 0;
  }

  & header {
    padding: 16px 16px 16px 10px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #eee;
    button:nth-child(1) {
      width: 24px;
      height: 24px;
      background: url(${IMG_SERVER}/images/api/btn_back.png) no-repeat center center / cover;
    }
    h2 {
      font-size: 18px;
      font-weight: 600;
      line-height: 1.17;
      letter-spacing: -0.45px;
      text-align: center;
    }
  }

  & section {
    padding: 20px 16px 0 16px;
    .titleWrite {
      input {
        padding: 14px 16px;
        height: 44px;
        border: 1px solid #e0e0e0;
        border-radius: 12px;
        width: 100%;
        font-size: 14px;
        &:focus {
          border: 1px solid #000;
        }
        &::placeholder {
          font-size: 14px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          letter-spacing: -0.35px;
          text-align: left;
          color: #757575;
        }
      }
    }
    .contentWrite {
      margin-top: 4px;

      textarea {
        font-size: 14px;
        border-radius: 12px;
        &:focus {
          border: 1px solid #000;
        }
        padding: 16px;
        border: 1px solid #e0e0e0;
        width: 100%;
        min-height: 310px;

        color: #000;
        font-size: 16px;
        letter-spacing: -0.8px;
        line-height: 1.5;
        transform: skew(-0.03deg);
        &::placeholder {
          font-size: 14px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          letter-spacing: -0.35px;
          text-align: left;
          color: #757575;
        }
      }
    }
  }
  .WriteSubmit {
  }

  &.on {
    display: block;
  }
`
const WriteSubmit = styled.button`
  display: block;

  width: 100%;
  background-color: #bdbdbd;
  font-size: 16px;
  color: #fff;
  font-weight: 600;
  height: 44px;
  letter-spacing: -0.4px;
  transform: skew(-0.03deg);
  border-radius: 12px;
  &.on {
    background-color: ${COLOR_MAIN};
  }
`
const TitleBtn = styled.button`
  position: absolute;
  right: 16px;
  font-size: 16px;
  line-height: 1.25;
  letter-spacing: -0.4px;
  text-align: left;
  color: #757575;
  font-weight: bold;
  transform: skew(-0.03deg);

  &.on {
    color: ${COLOR_MAIN};
    font-weight: 600;
  }
`

export default Notice
