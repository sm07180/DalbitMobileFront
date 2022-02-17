/**
 * @file /mypage/content/report.js
 * @brief 마이페이지 리포트
 */

import React, {useEffect, useStet, useContext, useState} from 'react'
import styled from 'styled-components'
import _ from 'lodash'

//layout
import {IMG_SERVER, WIDTH_MOBILE} from 'context/config'

import Api from 'context/api'
// static
import mic from 'images/mini/mic.svg'
import moon from 'images/mini/moon.svg'
import heart from 'images/mini/heart.svg'
import clock from 'images/mini/clock.svg'
import heartIcon from '../static/ico_like_g.svg'
import date from '../static/ic_circle_plus.svg'
import PurplePlayIcon from '../static/ic_purple_play.svg'
import StarGiftIcon from '../static/ic_star_gift.svg'
import PeopleYellowIcon from '../static/ic_people_yellow.svg'
import MoonIcon from '../static/ic_moon.svg'
//ui
import SelectBoxs from 'components/ui/selectBox.js'
import Datepicker from './datepicker'
import moment from 'moment'
import NoResult from 'components/ui/noResult'
import Header from '../component/header.js'
import DatePopup from './report_popup'

import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P, PHOTO_SERVER} from 'context/color'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage, setGlobalCtxReportDate} from "redux/actions/globalCtx";

let pickerHolder = true

const dateType = ['오늘', '어제', '최근7일', '월간']
const broadInfo = {
  mic: [mic, '방송'],
  moon: [moon, '받은별'],
  heart: [heart, '좋아요'],
  clock: [clock, '청취자']
}

const listenInfo = {
  mic: [mic, '청취'],
  moon: [moon, '달 선물']
  // heart: [heart, '받은 별'],
  // clock: [clock, '게스트 참여 시간']
}

const selectBoxData = [
  {value: 0, text: '방송'},
  {value: 1, text: '청취'}
]

let currentPage = 1
let timer
let moreState = false
export default (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  //state
  const [validate, setValidate] = useState({
    pickdata: false
  })

  const [active, setActive] = useState(2)
  const [selectType, setSelectType] = useState(0)

  const [currentPickdata, setCurrentPickdata] = useState()
  const [pickerState, setPickerState] = useState(true)
  const [broadData, setBroadData] = useState([])
  const [listenData, setListenData] = useState([])
  const [showingpage, setShowingpage] = useState(false)
  const [broadtotal, setbroadtotal] = useState([])
  const [listentotal, setlistentotal] = useState([])
  const [pickerCssOn, setPickerCssOn] = useState(false)
  const [resultState, setResultState] = useState(-1)
  const [nextList, setNextList] = useState(false)
  const [popupState, setPopupState] = useState(false)
  //api
  async function fetchData(next) {
    if (!next) currentPage = 1
    currentPage = next ? ++currentPage : currentPage

    const res = await Api.report_broad({
      params: {
        dateType: active,
        startDt: changes.pickdataPrev,
        endDt: changes.pickdataNext,
        page: currentPage,
        records: 10
      }
    })
    if (res.result === 'success' && _.hasIn(res.data, 'list')) {
      if (res.data.list == false) {
        if (!next) {
          setbroadtotal([])
          setBroadData([])
          setResultState(0)
        }
        moreState = false
      } else {
        if (next) {
          moreState = true
          setNextList(res.data.list)
        } else {
          setBroadData(res.data.list)
          fetchData('next')
        }
        setbroadtotal(res.data)
        setResultState(1)
      }
    } else {
      dispatch(setGlobalCtxMessage({type:"alert",
        msg: res.message
      }))
    }
  }

  //
  async function fetchDataListen(next) {
    if (!next) currentPage = 1
    currentPage = next ? ++currentPage : currentPage
    const res = await Api.report_listen({
      params: {
        dateType: active,
        startDt: changes.pickdataPrev,
        endDt: changes.pickdataNext,
        page: currentPage,
        records: 10
      }
    })
    if (res.result === 'success' && _.hasIn(res.data, 'list')) {
      if (res.data.list == false) {
        if (!next) {
          setlistentotal([])
          setListenData([])
          setResultState(0)
        }
        moreState = false
      } else {
        if (next) {
          moreState = true
          setNextList(res.data.list)
        } else {
          setListenData(res.data.list)
          fetchDataListen('next')
        }
        setlistentotal(res.data)
        setResultState(1)
      }
    } else {
      dispatch(setGlobalCtxMessage({type:"alert",
        msg: res.message
      }))
    }
  }

  //생년월일 유효성에서 계산할 현재 년도 date
  const dateToday = moment(new Date()).format('YYYYMMDD')
  const dateDayAgo = moment(new Date().setDate(new Date().getDate() - 1)).format('YYYYMMDD')
  const dateWeekAgo = moment(new Date().setDate(new Date().getDate() - 7)).format('YYYYMMDD')
  const dateMonthAgo = moment(new Date().setMonth(new Date().getMonth() - 1)).format('YYYYMMDD')

  let dateDefault = ''
  // changes 초기값 셋팅
  const [changes, setChanges] = useState({
    pickdataPrev: dateWeekAgo,
    pickdataNext: dateToday
  })
  const [dateprev, setDateprev] = useState('')
  const [datenext, setDatenext] = useState('')
  //---------------------------------------------------------------------
  const afterSelected = () => {
    setActive(4)
    setPickerCssOn(true)
  }
  //datepicker에서 올려준 값 받아서 pickdata 바로 변경하기
  const pickerOnChange = (value, btn) => {
    if (!changes.pickdata) {
      dateDefault = value
    } else {
      setDateprev(value)
    }

    setChanges({
      ...changes,
      pickdataPrev: value
      // pickdataNext: dateToday
    })

    if (btn == 'dayAgo') {
      setChanges({
        ...changes,
        pickdataPrev: value,
        pickdataNext: value
      })
    }
  }

  const pickerOnChangenext = (value) => {
    if (!changes.pickdata) {
      dateDefault = value
    } else {
      setDatenext(value)
    }
    setChanges({
      ...changes,
      pickdataNext: value
    })
  }

  //-------------------------

  useEffect(() => {
    // console.log(JSON.stringify(changes, null, 1))
  }, [changes])

  useEffect(() => {
    setTimeout(() => {
      setActive(2)
      setPickerCssOn(false)
    }, 10)
  }, [])
  //----------------------------
  // 셀렉트 타입
  const setType = (value) => {
    setSelectType(value)
    //setMoreState(false)
    setActive(2)
    setBroadData([])
    setListenData([])
    setResultState(1)
    setlistentotal(false)
    setbroadtotal([])
    setlistentotal([])
    setResultState(1)
    setPickerCssOn(false)
    setChanges({pickdataPrev: dateWeekAgo, pickdataNext: dateToday})
  }
  //date format
  const dateFormat = (strFormatFromServer) => {
    let date = strFormatFromServer.slice(0, 8)
    date = [date.slice(0, 4), date.slice(4, 6), date.slice(6)].join('-')
    let time = strFormatFromServer.slice(8)
    time = [time.slice(0, 2), time.slice(2, 4), time.slice(4)].join(':')
    return `${date} `
  }

  const timeFormat = (strFormatFromServer) => {
    let date = strFormatFromServer.slice(0, 8)
    date = [date.slice(0, 4), date.slice(4, 6), date.slice(6)].join('-')
    let time = strFormatFromServer.slice(8)
    time = [time.slice(0, 2), time.slice(2, 4), time.slice(4)].join(':')
    return `${time} `
  }
  const timeFormatSumurry = (strFormatFromServer) => {
    let time = strFormatFromServer.slice(0, 5)
    time = [time.slice(0, 1), time.slice(1, 3), time.slice(3)].join(':')
    return `${time} `
  }

  function numberFormat(inputNumber) {
    return inputNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  function decodeSec(seconds) {
    var hour = parseInt(seconds / 3600)
    var min = parseInt((seconds % 3600) / 60)
    var sec = seconds % 60
    return `${hour}` + ':' + `${min}` + ':' + `${sec}`
    //document.getElementById("demo").innerHTML = hour+":"+min+":" + sec
  }

  const Toggletab = () => {
    setResultState(-1)
    setActive(2)
    setBroadData([])
    setListenData([])

    setbroadtotal([])
    setlistentotal([])
    setPickerCssOn(false)
    setChanges({pickdataPrev: dateWeekAgo, pickdataNext: dateToday})
    dispatch(setGlobalCtxReportDate({
      type: 2,
      prev: dateWeekAgo,
      next: dateToday
    }));

    if (selectType === 0) {
      setSelectType(1)
    } else {
      setSelectType(0)
    }
  }

  const fetchDataHandle = () => {
    if (selectType === 0) {
      fetchData()
    } else {
      fetchDataListen()
    }
  }
  useEffect(() => {
    if (selectType === 0) {
      fetchData()
    } else {
      fetchDataListen()
    }
  }, [selectType])
  useEffect(() => {
    window.addEventListener('scroll', scrollEvtHdr)
    return () => {
      window.removeEventListener('scroll', scrollEvtHdr)
    }
  }, [nextList])
  const showMoreList = () => {
    if (selectType === 0) {
      setBroadData(broadData.concat(nextList))
      fetchData('next')
    } else {
      setListenData(listenData.concat(nextList))
      fetchDataListen('next')
    }
  }
  const scrollEvtHdr = (event) => {
    if (timer) window.clearTimeout(timer)
    timer = window.setTimeout(function () {
      //스크롤
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
  useEffect(() => {
    dispatch(setGlobalCtxReportDate({
      type: 2,
      prev: changes.pickdataPrev,
      next: changes.pickdataNext
    }));
  }, [])
  return (
    <>
      {/* 공통타이틀 */}
      <Header title="리포트" />
      <Report>
        <div className="tabWrap">
          <button onClick={Toggletab} className={selectType === 0 ? 'on' : ''}>
            방송
          </button>
          <button onClick={Toggletab} className={selectType === 1 ? 'on' : ''}>
            청취
          </button>

          <img
            src={date}
            onClick={() => {
              setPopupState(true)
            }}
          />
        </div>
        <div
          className="data-box"
          onClick={() => {
            setPopupState(true)
          }}>
          <span className={globalState.reportDate.type === 4 ? 'none' : ''}>{dateType[globalState.reportDate.type]}</span>
          <p>
            {moment(globalState.reportDate.prev).format('YYYY-MM-DD')} ~ {moment(globalState.reportDate.next).format('YYYY-MM-DD')}
          </p>
        </div>

        {resultState == 0 ? (
          <NoResult />
        ) : resultState == -1 ? (
          <></>
        ) : (
          <>
            <>
              <TitleWrap>
                {selectType === 0 && <TitleText>방송요약</TitleText>}
                {selectType === 1 && <TitleText>청취요약</TitleText>}
                {/* <TitleSubMsg>
                데이터는 최대 6개월까지 검색 가능합니다.
              </TitleSubMsg> */}
              </TitleWrap>
              <BroadcastShort>
                {selectType === 0 &&
                  Object.keys(broadInfo).map((section, index) => {
                    return (
                      <ShortSection key={index}>
                        <div>
                          <div>{broadInfo[section][1]}</div>
                          <div className="count">
                            {broadInfo[section][1] === '방송' &&
                              broadtotal.length !== 0 &&
                              decodeSec(String(broadtotal.broadcastTime))}
                            {broadInfo[section][1] === '받은별' &&
                              broadtotal.length !== 0 &&
                              numberFormat(String(broadtotal.byeolTotCnt))}
                            {broadInfo[section][1] === '좋아요' &&
                              broadtotal.length !== 0 &&
                              numberFormat(String(broadtotal.goodTotCnt))}
                            {broadInfo[section][1] === '청취자' &&
                              broadtotal.length !== 0 &&
                              numberFormat(String(broadtotal.listenerTotCnt))}
                          </div>
                        </div>
                      </ShortSection>
                    )
                  })}
                {selectType === 1 &&
                  Object.keys(listenInfo).map((section, index) => {
                    const {listeningTime, giftDalTotCnt, byeolTotCnt, guestTime} = listentotal
                    return (
                      <ShortSection key={index} className="see">
                        <div>
                          <div>{listenInfo[section][1]}</div>
                          <div className="count">
                            {listenInfo[section][1] === '청취' && listentotal.length !== 0 && decodeSec(String(listeningTime))}
                            {listenInfo[section][1] === '달 선물' &&
                              listentotal.length !== 0 &&
                              numberFormat(String(giftDalTotCnt))}
                            {listenInfo[section][1] === '받은 별' &&
                              listentotal.length !== 0 &&
                              numberFormat(String(byeolTotCnt))}
                            {listenInfo[section][1] === '게스트 참여 시간' && listentotal.length !== 0 && guestTime}
                          </div>
                        </div>
                      </ShortSection>
                    )
                  })}
              </BroadcastShort>
              <TitleWrap>
                <TitleText>상세내역</TitleText>
              </TitleWrap>
              <DetailTable>
                <div>
                  {selectType === 0 &&
                    broadData.map((value, idx) => {
                      const TimeDeclare = Math.floor((parseInt(value.endTs) - parseInt(value.startTs)) / 60)
                      return (
                        <MobileDetailTab key={idx}>
                          <div>
                            <span className="listenName">{dateFormat(value.broadDt)}</span>
                          </div>
                          <div className="startDate">
                            <span>{timeFormat(value.startDt)}</span>~&nbsp;
                            <span>{timeFormat(value.endDt)}</span>
                            &nbsp;
                            {TimeDeclare > 0 && <span className="timeDeclare">(&nbsp;{TimeDeclare}분&nbsp;)</span>}
                          </div>

                          <div className="giftDate">
                            <div>
                              <span>받은별 </span>
                              <span>{numberFormat(value.byeolCnt)}</span>
                            </div>
                            <div className="onSelect1">
                              <span>좋아요</span> <span>{numberFormat(value.likes)}</span>
                            </div>
                          </div>

                          <div className="giftDate noborder">
                            <div className="onSelect2">
                              <span>최다 청취자 </span>
                              <span>{numberFormat(value.listenerCnt)}</span>
                            </div>
                            {/* <div className="onSelect3">
                              <span>방송 최고 순위</span> <span>{value.rank}</span>
                            </div> */}
                          </div>
                        </MobileDetailTab>
                      )
                    })}
                  {selectType === 1 &&
                    listenData.map((value, idx) => {
                      const TimeDeclare = Math.floor((parseInt(value.endTs) - parseInt(value.startTs)) / 60)
                      return (
                        <MobileDetailTabListen key={idx}>
                          <div>
                            <span className="listenName">{value.bjNickNm}</span>
                          </div>
                          <div className="startDate">
                            <span className="black">{dateFormat(value.startDt)}</span>
                            <span>{timeFormat(value.startDt)}</span>&nbsp;~
                            <span>{timeFormat(value.endDt)}</span>
                            &nbsp;
                            {TimeDeclare > 0 && <span className="timeDeclare">(&nbsp;{TimeDeclare}분&nbsp;)</span>}
                            {/* {value.listenTime / 3600} */}
                          </div>
                          <div className="giftDate">
                            <div className="onSelect1">
                              <span>선물준달</span>
                              <span>{numberFormat(value.giftDalCnt)}</span>
                            </div>
                          </div>
                          {/* <div className="guestDate onSelect4">
                            <span>게스트로 참여 여부</span>
                            <span>{value.isGuest === false ? '-' : value.isGuest}</span>
                          </div> */}
                        </MobileDetailTabListen>
                      )
                    })}
                </div>
              </DetailTable>
            </>
          </>
        )}
      </Report>
      {popupState && (
        <DatePopup
          active={active}
          setActive={setActive}
          setPickerCssOn={setPickerCssOn}
          pickerOnChange={pickerOnChange}
          pickerOnChangenext={pickerOnChangenext}
          pickdataPrev={changes.pickdataPrev}
          pickdataNext={changes.pickdataNext}
          pickerState={pickerState}
          afterSelected={afterSelected}
          selectType={selectType}
          fetchData={fetchDataHandle}
          setPopupState={setPopupState}
        />
      )}
    </>
  )
}

const MobileDetailTab = styled.div`
  padding: 13px 14px;
  border-radius: 12px;
  background-color: #fff;
  margin-bottom: 8px;

  div {
    display: flex;
    justify-content: space-between;
    color: #424242;
    font-size: 14px;
    /* margin: 16px 0; */
    letter-spacing: -0.35px;
    transform: skew(-0.03deg);
    .listenName {
      font-size: 16px;
      font-weight: 800;
      font-stretch: normal;
      font-style: normal;
      letter-spacing: normal;
      text-align: left;
      color: #000000;
      margin-bottom: 6px;
    }
  }
  .startDate {
    justify-content: flex-start;
    font-size: 12px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.08;
    letter-spacing: normal;
    text-align: left;
    color: #000;
    padding-bottom: 9px;
    border-bottom: 1px solid #eeeeee;
    .black {
      color: #000000;
    }

    span:nth-child(1) {
      margin-right: 10px;
    }
    span:nth-child(1) {
      margin-right: 10px;
    }
  }
  .giftDate {
    border-bottom: 1px solid #eeeeee;
    span {
      margin-left: 2px;
    }
    &.noborder {
      border: none;
    }
    div {
      position: relative;
      padding: 11px 16px 11px 16px;
      width: 50%;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: normal;
      text-align: left;
      color: #000000;
      span {
        margin-left: 2px;
      }
      :before {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 16px;
        height: 16px;

        content: '';
        background: url(${StarGiftIcon}) no-repeat center center/cover;
      }
      &.onSelect1 {
        :before {
          background: url(${heartIcon}) no-repeat center center/cover;
        }
      }

      &.onSelect2 {
        :before {
          background: url(${PeopleYellowIcon}) no-repeat center center/cover;
        }
      }
      &.onSelect3 {
        :before {
          background: url(${PurplePlayIcon}) no-repeat center center/cover;
        }
      }
    }
  }
  .guestDate {
    position: relative;
    margin-top: 12px;
    padding: 0 16px 0 16px;
    position: relative;
    font-size: 12px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.08;
    letter-spacing: normal;
    text-align: left;
    color: #000000;
    :before {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 16px;
      height: 16px;
      content: '';
      background: url(${heartIcon}) no-repeat center center/cover;
    }
  }
  &.disable {
    display: none;
  }
  &.able {
    display: block;
  }
`

const MobileDetailTabListen = styled.div`
  padding: 13px 14px;
  border-radius: 12px;
  background-color: #fff;
  margin-bottom: 8px;

  div {
    display: flex;
    justify-content: space-between;
    color: #424242;
    font-size: 14px;
    /* margin: 16px 0; */
    letter-spacing: -0.35px;
    transform: skew(-0.03deg);
    .listenName {
      font-size: 16px;
      font-weight: 800;
      font-stretch: normal;
      font-style: normal;
      letter-spacing: normal;
      text-align: left;
      color: #000000;
      margin-bottom: 6px;
    }
  }

  .startDate {
    justify-content: flex-start;
    font-size: 12px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.08;
    letter-spacing: normal;
    text-align: left;
    color: #757575;
    padding-bottom: 9px;
    border-bottom: 1px solid #eeeeee;
    .black {
      color: #000000;
    }
    span:nth-child(1) {
      margin-right: 10px;
    }
    span:nth-child(1) {
      margin-right: 10px;
    }
  }
  .giftDate {
    border-bottom: 1px solid #eeeeee;
    div {
      position: relative;
      padding: 11px 16px 11px 16px;
      width: 50%;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: normal;
      text-align: left;
      color: #000000;
      span {
        margin-left: 2px;
      }
      :before {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 16px;
        height: 16px;
        content: '';
        background: url(${MoonIcon}) no-repeat center center/cover;
      }
      &.onSelect2 {
        :before {
          background: url(${StarGiftIcon}) no-repeat center center/cover;
        }
      }
    }
  }
  .guestDate {
    position: relative;
    margin-top: 12px;
    padding: 0 16px 0 16px;
    position: relative;
    font-size: 12px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.08;
    letter-spacing: normal;
    text-align: left;
    color: #000000;
    span {
      margin-left: 2px;
    }
    &.onSelect4 {
      :before {
        background: url(${PeopleYellowIcon}) no-repeat center center/cover;
      }
    }
    :before {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 16px;
      height: 16px;
      content: '';
      background: url(${heartIcon}) no-repeat center center/cover;
    }
  }
  &.disable {
    display: none;
  }
  &.able {
    display: block;
  }
`

const DetailTableTab = styled.div`
  width: 14.2857%;
  text-align: center;
  font-size: 16px;
  letter-spacing: -0.4px;
  padding: 17px 0;
`

const DetailTableNav = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;

  @media (max-width: ${WIDTH_MOBILE}) {
    display: none;
  }
`
const DetailTable = styled.div``

const SectionIcon = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background-color: #632beb;
  background-repeat: no-repeat;
  background-position: center;
`
const ShortSection = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(50% - 2px);
  padding: 9px 16px 10px 16px;
  height: 60px;
  border-radius: 12px;
  background-color: #ffffff;
  > div {
    :after {
      position: absolute;
      content: '';
      width: 16px;
      height: 16px;
      z-index: 5;
      top: 0;
      right: 4px;
      background: url(${PurplePlayIcon}) no-repeat center center/cover;
    }
  }
  :nth-child(1),
  :nth-child(2) {
    margin-bottom: 4px;
  }
  :nth-child(2) {
    > div {
      color: #f26d4a;
      :after {
        background: url(${StarGiftIcon}) no-repeat center center/cover;
      }
    }
  }
  :nth-child(3) {
    > div {
      color: #ec455f;
      :after {
        background: url(${heartIcon}) no-repeat center center/cover;
      }
    }
  }
  :nth-child(4) {
    > div {
      color: #febd56;
      :after {
        background: url(${PeopleYellowIcon}) no-repeat center center/cover;
      }
    }
  }
  &.see {
    :nth-child(1) {
      position: relative;
      > div {
        :after {
          background: url(${PurplePlayIcon}) no-repeat center center/cover;
        }
        color: #632beb;
      }
    }
    :nth-child(2) {
      > div {
        color: #f26d4a;
        :after {
          background: url(${MoonIcon}) no-repeat center center/cover;
        }
      }
    }
    :nth-child(3) {
      > div {
        color: #ec455f;
        :after {
          background: url(${StarGiftIcon}) no-repeat center center/cover;
        }
      }
    }
    :nth-child(4) {
      > div {
        color: #febd56;
        :after {
          background: url(${PeopleYellowIcon}) no-repeat center center/cover;
        }
      }
    }
  }

  > div {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    width: 100%;
    font-size: 12px;
    font-weight: 800;
    color: #632beb;
    transform: skew(-0.03deg);
    letter-spacing: -0.3px;

    > div:first-child {
      margin-top: 2px;
      font-weight: 900;
      line-height: 16px;
    }
  }
  & .count {
    font-size: 20px;
    font-weight: 800;
    margin-top: 1px;
    letter-spacing: normal;
    text-align: left;
    color: #000000;
    line-height: 27px;
    height: 27px;
  }
`
const BroadcastShort = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  flex-direction: row;
`

const TypeBtn = styled.button`
  color: #757575;
  border: 1px solid #bdbdbd;
  border-radius: 25px;
  padding: 15px;
  width: 86px;

  &.active {
    border-color: #632beb;
  }
`
const TitleSubMsg = styled.div`
  color: #757575;
  font-size: 12px;
  height: auto;
  letter-spacing: -0.3px;
  transform: skew(-0.03deg);
`

const TitleText = styled.div`
  font-weight: 800;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: normal;
  text-align: left;
  color: #000000;
  margin-bottom: 8px;
`
const TitleWrap = styled.div`
  display: flex;
  justify-content: space-between;
  justify-items: center;
  align-items: center;

  margin-top: 16px;

  &.noneborder {
    border-bottom: none;
    padding-bottom: 0;
  }
`

const Report = styled.div`
  padding: 12px 16px;
  .data-box {
    display: flex;
    justify-content: center;
    margin: 8px 0 16px 0;
    padding: 8px;
    background: #fff;
    border-radius: 12px;
    * {
      height: 16px;
      line-height: 16px;
      font-size: 14px;
      font-weight: 600;
    }
    span {
      color: #000;
      vertical-align: top;
      ::after {
        display: inline-block;
        width: 1px;
        height: 16px;
        margin: 0 10px;
        background: #e0e0e0;
        vertical-align: top;
        content: '';
      }
      &.none {
        display: none;
      }
    }
    p {
      color: #424242;
    }
  }
  .tabWrap {
    display: flex;
    flex-direction: row;
    img {
      margin-left: auto;
    }

    button {
      width: 80px;
      height: 32px;
      border-radius: 12px;
      border: solid 1px #e0e0e0;
      background-color: #ffffff;
      margin-left: 2px;
      line-height: 32px;
      font-size: 14px;
      font-weight: 600;
      text-align: center;
      color: #000000;
      &.on {
        border: solid 1px #632beb;
        background-color: #632beb;
        color: #ffffff;
      }
    }
  }
  & .radioWrap {
    display: flex;
    margin-top: 16px;
    flex-wrap: wrap;
    & button {
      display: block;
      width: 25%;
      height: 40px;
      letter-spacing: -0.35px;
      line-height: 40px;
      border: 1px solid #bdbdbd;
      font-size: 14px;
      color: #424242;
      /* margin-right: -1px; */
      margin-left: -1px;
      transform: none;
      &.on {
        /* width: calc(25% + 1px); */
        border: 1px solid ${COLOR_MAIN};
        color: ${COLOR_MAIN};
        /* margin-right: 0; */
        z-index: 1;
      }
      &.on + button {
        /* border-left: 0; */
      }
    }
  }

  & .datebox {
    margin-top: 12px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    /* border: 1px solid #bdbdbd; */

    &.on {
      section {
        border: 1px solid ${COLOR_MAIN};
      }
    }

    > section {
      width: 75%;
      display: flex;
      /* padding: 0 calc(1.5% + 5px); */
      height: 40px;
      padding: 5px 0;
      border: 1px solid #bdbdbd;

      & .line {
        width: 10px;
        margin: 0 2.8%;
        position: relative;
        span {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          display: block;
          width: 10px;
          height: 1px;
          background-color: #757575;
        }
      }
      > div {
        width: calc(50%);
        padding-left: 6px;
        @media (max-width: 340px) {
          padding-left: 0;
        }
      }
    }
    .search {
      height: 40px;
      width: 25%;
      color: #fff;
      background-color: ${COLOR_MAIN};
      border-color: ${COLOR_MAIN};
      border: 0;
    }
  }
`

const SelectWrap = styled.div`
  position: relative;
  transform: skew(-0.03deg);
  z-index: 8;
  > div > div {
    font-size: 14px !important;
    background-color: #fff;
    :before {
      top: 18px;
    }
    :after {
      top: 18px;
    }
  }
  > div .box-list {
    font-size: 14px !important;
    padding: 10px 10px;
  }
`
const Submit = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 113px;
  border-radius: 24px;
  margin: 31px auto 30px auto;
  padding: 6px 0;
  border: 1px solid #bdbdbd;
  font-size: 14px;
  color: #bdbdbd;
  em {
    display: block;
    width: 36px;
    height: 36px;
    background: url(${IMG_SERVER}/images/api/ic_arrow_down.png) no-repeat center center/cover;
  }

  &.disable {
    display: none;
  }
`
const TopWrap = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid ${COLOR_MAIN};
  align-items: center;
  margin-top: 24px;
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
