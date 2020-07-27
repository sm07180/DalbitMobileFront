import React, {useEffect, useState, useContext, useRef, useReducer} from 'react'
import qs from 'query-string'
//styled
import styled from 'styled-components'
//context
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import {COLOR_MAIN} from 'context/color'
import Api from 'context/api'
import {Context} from 'context'
import {useLocation} from 'react-router-dom'
//scroll
import {Scrollbars} from 'react-custom-scrollbars'
import Utility, {dateFormatterKor, settingAlarmTime, printNumber, minuteToTime} from 'components/lib/utility'
//svg
import PtimeIcon from '../../static/ic_p_time.svg'
import PstarIcon from '../../static/ic_p_star.svg'
import PlastTimeIcon from '../../static/ic_p_headphone.svg'
import PmemoGray from '../../static/ic_p_mem_g.svg'
import PmemoDark from '../../static/ic_p_mem_b.svg'

//---------------------------------------------------------------------------------
// concat flag
let currentPage = 1
let timer
let moreState = false
let clicker = false
//---------------------------------------------------------------------------------
export default (props) => {
  const CurrentTab = props.title

  //context
  const ctx = useContext(Context)
  const {profile} = ctx
  const location = useLocation()

  var urlrStr = location.pathname.split('/')[2]
  //state
  const [list, setList] = useState([])
  const [nextList, setNextList] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  //스크롤 이벤트
  const scrollEvtHdr = (event) => {
    if (timer) window.clearTimeout(timer)
    timer = window.setTimeout(function () {
      const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight
      const body = document.body
      const html = document.documentElement
      const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
      const windowBottom = windowHeight + window.pageYOffset
      if (moreState && windowBottom >= docHeight - 200) {
        showMoreList()
      } else {
      }
    }, 10)
  }

  //콘켓 쇼모어 이벤트
  const showMoreList = () => {
    if (moreState) {
      console.log('concat')
      setList(list.concat(nextList))
      fetchData('next')
    }
  }
  async function fetchData(next) {
    currentPage = next ? ++currentPage : currentPage
    console.log(currentPage)
    const res = await Api.getNewFanList({
      memNo: urlrStr,
      sortType: 2,
      page: currentPage,
      records: 20
    })
    if (res.result === 'success') {
      if (res.code === '0') {
        if (next !== 'next') {
          setList(false)
          setTotalCount(0)
        }
        moreState = false
      } else {
        if (next) {
          console.log('넥스트')
          moreState = true
          setNextList(res.data.list)
          setTotalCount(res.data.paging.total)
        } else {
          console.log('1')
          setList(res.data.list)
          setTotalCount(res.data.paging.total)
          fetchData('next')
        }
      }
    } else {
    }
  }
  //
  //등록,해제
  const Regist = (memNo) => {
    async function fetchDataFanRegist(memNo) {
      const res = await Api.fan_change({
        data: {
          memNo: memNo
        }
      })
      if (res.result === 'success') {
        // currentPage = 1
        fetchData()
        clicker === false
      } else if (res.result === 'fail') {
        ctx.action.alert({
          callback: () => {},
          msg: res.message
        })
      }
    }
    fetchDataFanRegist(memNo)
  }

  const Cancel = (memNo, isFan) => {
    async function fetchDataFanCancel(memNo, isFan) {
      const res = await Api.mypage_fan_cancel({
        data: {
          memNo: memNo
        }
      })
      if (res.result === 'success') {
        // currentPage = 1
        fetchData()
        clicker === false
      } else if (res.result === 'fail') {
        ctx.action.alert({
          callback: () => {},
          msg: res.message
        })
      }
    }
    fetchDataFanCancel(memNo)
  }
  //
  const registToggle = (isFan, memNo) => {
    clicker === true
    if (isFan === false) {
      Regist(memNo)
    } else if (isFan === true) {
      Cancel(memNo)
    }
  }

  //window Scroll
  useEffect(() => {
    //
    if (clicker === false) {
      window.addEventListener('scroll', scrollEvtHdr)
    }
    return () => {
      window.removeEventListener('scroll', scrollEvtHdr)
    }
  }, [nextList])
  //-----------------------------------------------------------

  useEffect(() => {
    currentPage = 1
    fetchData()
  }, [])
  return (
    <Wrap>
      {list &&
        list.map((item, idx) => {
          const {nickNm, profImg, regDt, listenTime, giftedByeol, lastListenDt, isFan, fanMemo, memNo} = item
          return (
            <div key={idx} className="list">
              <div className="list__imgBox">
                <img src={profImg.thumb120x120} alt="팬 프로필 이미지" />
              </div>
              <div className="list__infoBox">
                <span className="list__nick">{nickNm}</span>
                <span className="list__registDt">등록일 - {Utility.dateFormatterKor(regDt)}</span>
                <div className="list__details">
                  <span className="list__details__time">{listenTime}분</span>
                  <span className="list__details__byeol">{Utility.printNumber(giftedByeol)}</span>
                  <span className="list__details__lastTime">
                    {lastListenDt === '' ? '-' : Utility.settingAlarmTime(lastListenDt)}
                  </span>
                </div>
              </div>
              <div className="list__btnBox">
                <button
                  className={isFan ? 'list__btnBox__fanBtn list__btnBox__fanBtn--active' : 'list__btnBox__fanBtn'}
                  onClick={() => registToggle(isFan, memNo)}>
                  {isFan ? '팬' : '+팬등록'}
                </button>
                <button
                  className={fanMemo !== '' ? 'list__btnBox__memoBtn list__btnBox__memoBtn--active' : 'list__btnBox__memoBtn'}>
                  메모
                </button>
              </div>
            </div>
          )
        })}
    </Wrap>
  )
}

//styled
const Wrap = styled.div`
  .list {
    display: flex;
    align-items: center;
    min-height: 78px;
    padding: 8px 16px;
    box-sizing: border-box;
    background-color: #fff;
    border-bottom: 1px solid #eee;
    &__imgBox {
      margin-right: 11px;
      > img {
        width: 54px;
        border-radius: 50%;
      }
    }
    &__infoBox {
      display: flex;
      flex-direction: column;
    }
    &__nick {
      margin-bottom: 4px;
      font-size: 14px;
      font-weight: 600;
      line-height: 1.14;
      text-align: left;
      color: #000000;
    }
    &__registDt {
      margin-bottom: 4px;
      font-size: 12px;
      line-height: 1.08;
      text-align: left;
      color: #424242;
    }
    &__details {
      display: flex;
      flex-direction: row;
      span {
        margin-right: 4px;
        font-size: 12px;
        line-height: 1.08;
        letter-spacing: normal;
        text-align: left;
        color: #424242;
      }
      &__time {
        position: relative;
        &:before {
          margin-right: 1px;
          display: inline-block;
          vertical-align: middle;
          width: 16px;
          height: 16px;
          content: '';
          background: url(${PtimeIcon});
        }
      }
      &__byeol {
        position: relative;
        &:before {
          margin-right: 1px;
          display: inline-block;
          vertical-align: middle;
          width: 16px;
          height: 16px;
          content: '';
          background: url(${PstarIcon});
        }
      }
      &__lastTime {
        position: relative;
        &:before {
          margin-right: 1px;
          display: inline-block;
          vertical-align: middle;
          width: 16px;
          height: 16px;
          content: '';
          background: url(${PlastTimeIcon});
        }
      }
    }
    &__btnBox {
      display: flex;
      flex-direction: column;
      margin-left: auto;
      &__fanBtn {
        width: 64px;
        height: 32px;
        border-radius: 16px;
        color: #fff;
        font-size: 14px;
        text-align: center;
        border: solid 1px #632beb;
        background-color: #632beb;
        &--active {
          color: #632beb;
          background-color: #fff;
          border: solid 1px #5f29e2;
        }
      }
      &__memoBtn {
        display: flex;
        align-items: center;
        margin-top: 10px;
        font-size: 14px;
        font-weight: 600;
        line-height: 1.14;
        letter-spacing: -0.35px;
        text-align: center;
        color: #bdbdbd;
        &:before {
          display: block;
          width: 24px;
          height: 24px;
          background: url(${PmemoGray});
          content: '';
        }
        &--active {
          color: #000000;
          &:before {
            display: block;
            width: 24px;
            height: 24px;
            background: url(${PmemoDark});
            content: '';
          }
        }
      }
    }
  }
`
