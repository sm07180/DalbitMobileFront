/**
 * @file /mypage/content/report.js
 * @brief 마이페이지 리포트
 */

import React, {useEffect, useStet, useContext, useState} from 'react'
import styled from 'styled-components'
import _ from 'lodash'

//layout
import {IMG_SERVER, WIDTH_MOBILE} from 'context/config'

// context
import {Context} from 'context'
import Api from 'context/api'
// static
import mic from 'images/mini/mic.svg'
import moon from 'images/mini/moon.svg'
import heart from 'images/mini/heart.svg'
import clock from 'images/mini/clock.svg'

//ui
import SelectBoxs from 'components/ui/selectBox.js'
import Datepicker from './datepicker'
import moment from 'moment'
import NoResult from 'components/ui/noResult'

//
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P, PHOTO_SERVER} from 'context/color'

let pickerHolder = true
const broadInfo = {
  mic: [mic, '방송'],
  moon: [moon, '받은별'],
  heart: [heart, '좋아요'],
  clock: [clock, '청취자']
}

const listenInfo = {
  mic: [mic, '청취'],
  moon: [moon, '달 선물'],
  heart: [heart, '받은 별'],
  clock: [clock, '게스트 참여 시간']
}

const selectBoxData = [
  {value: 0, text: '방송'},
  {value: 1, text: '청취'}
]

let currentPage = 1

export default props => {
  const context = useContext(Context)
  const ctx = useContext(Context)
  //state
  const [validate, setValidate] = useState({
    pickdata: false
  })
  const [active, setActive] = useState(0)
  const [selectType, setSelectType] = useState(0)
  const [moreState, setMoreState] = useState(false)
  const [currentPickdata, setCurrentPickdata] = useState()
  const [pickerState, setPickerState] = useState(true)
  const [broadData, setBroadData] = useState([])
  const [listenData, setListenData] = useState([])
  const [showingpage, setShowingpage] = useState(false)
  const [broadtotal, setbroadtotal] = useState([])
  const [listentotal, setlistentotal] = useState([])
  const [pickerCssOn, setPickerCssOn] = useState(false)
  const [resultState, setResultState] = useState(1)
  const [nextList, setNextList] = useState(false)
  //api
  async function fetchData(next) {
    if (!next) currentPage = 1
    currentPage = next ? ++currentPage : currentPage

    const res = await Api.report_broad({
      params: {
        dateType: active,
        startDt: dateprev,
        endDt: datenext,
        page: currentPage,
        records: 3
      }
    })
    if (res.result === 'success' && _.hasIn(res.data, 'list')) {
      if (res.data.list == false) {
        if (!next) {
          setbroadtotal([])
          setBroadData([])
          setResultState(0)
        }
        setMoreState(false)
      } else {
        if (next) {
          setMoreState(true)
          setNextList(res.data.list)
        } else {
          setBroadData(res.data.list)
          fetchData('next')
        }
        setbroadtotal(res.data)
        setResultState(1)
      }
    } else {
      context.action.alert({
        msg: res.message
      })
    }
  }

  //
  async function fetchDataListen(next) {
    if (!next) currentPage = 1
    currentPage = next ? ++currentPage : currentPage
    const res = await Api.report_listen({
      params: {
        dateType: active,
        startDt: dateprev,
        endDt: datenext,
        page: currentPage,
        records: 3
      }
    })
    if (res.result === 'success' && _.hasIn(res.data, 'list')) {
      if (res.data.list == false) {
        if (!next) {
          setlistentotal([])
          setListenData([])
          setResultState(0)
        }
        setMoreState(false)
      } else {
        if (next) {
          setMoreState(true)
          setNextList(res.data.list)
        } else {
          setListenData(res.data.list)
          fetchDataListen('next')
        }
        setlistentotal(res.data)
        setResultState(1)
      }
    } else {
      context.action.alert({
        msg: res.message
      })
    }
  }
  //생년월일 유효성에서 계산할 현재 년도 date
  const d = new Date()
  const date = moment(d).format('YYYYMMDD')
  const dateYear = date.slice(0, 4) - 17
  let dateDefault = ''
  // changes 초기값 셋팅
  const [changes, setChanges] = useState({
    pickdata: ''
  })
  const [dateprev, setDateprev] = useState('')
  const [datenext, setDatenext] = useState('')
  //---------------------------------------------------------------------
  //datepicker에서 올려준 값 받아서 pickdata 바로 변경하기
  const pickerOnChange = value => {
    if (!changes.pickdata) {
      dateDefault = value
    } else {
      validateBirth(value)
      setDateprev(value)
      setActive(4)
    }
    setPickerCssOn(true)
  }

  const pickerOnChangenext = value => {
    if (!changes.pickdata) {
      dateDefault = value
    } else {
      validateBirth(value)
      setDatenext(value)
      setActive(4)
    }
    setPickerCssOn(true)
  }

  const validateBirth = value => {
    let year = value.slice(0, 4)
    if (year == '') {
    } else if (year <= dateYear || value == date) {
      setCurrentPickdata('')
      setValidate({
        ...validate,
        pickdata: true
      })
      if (pickerHolder) {
        pickerHolder = false
        setPickerState(true)
      } else {
        setPickerState(false)
      }
    } else {
      if (pickerHolder) {
        pickerHolder = false
      }
      setValidate({
        ...validate,
        pickdata: false
      })
      setPickerState(false)
    }
  }
  //-------------------------
  useEffect(() => {
    let firstSetting = {}
    if (!changes.pickdata) {
      firstSetting = {pickdata: dateDefault}
    } else if (!changes.pickdata) {
      firstSetting = {pickdata: dateDefault}
    }
    setChanges({
      ...changes,
      ...firstSetting
    })
  }, [])

  useEffect(() => {
    setTimeout(() => {
      setActive(0)
      setPickerCssOn(false)
    }, 10)
  }, [])
  //----------------------------
  // 셀렉트 타입
  const setType = value => {
    setSelectType(value)
    //setMoreState(false)
    setActive(0)
    setBroadData([])
    setListenData([])
    setResultState(1)
    setlistentotal(false)
    setbroadtotal([])
    setlistentotal([])
    setResultState(1)
  }
  //date format
  const dateFormat = strFormatFromServer => {
    let date = strFormatFromServer.slice(0, 8)
    date = [date.slice(0, 4), date.slice(4, 6), date.slice(6)].join('-')
    let time = strFormatFromServer.slice(8)
    time = [time.slice(0, 2), time.slice(2, 4), time.slice(4)].join(':')
    return `${date} `
  }

  const timeFormat = strFormatFromServer => {
    let date = strFormatFromServer.slice(0, 8)
    date = [date.slice(0, 4), date.slice(4, 6), date.slice(6)].join('-')
    let time = strFormatFromServer.slice(8)
    time = [time.slice(0, 2), time.slice(2, 4), time.slice(4)].join(':')
    return `${time} `
  }
  const timeFormatSumurry = strFormatFromServer => {
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

  const showMoreList = () => {
    if (selectType === 0) {
      setBroadData(broadData.concat(nextList))
      fetchData('next')
    } else {
      setListenData(listenData.concat(nextList))
      fetchDataListen('next')
    }
  }

  return (
    <>
      {/* 공통타이틀 */}
      <TopWrap>
        <button onClick={() => window.history.back()}></button>
        <div className="title">리포트</div>
      </TopWrap>
      <Report>
        <TitleWrap style={{paddingBottom: '25px'}}>
          <TitleText>리포트</TitleText>
          <SelectWrap>
            <SelectBoxs boxList={selectBoxData} onChangeEvent={setType} inlineStyling={{right: 0, top: '-20px', zIndex: 8}} />
          </SelectWrap>
        </TitleWrap>
        <div className="radioWrap">
          <button
            onClick={() => {
              setActive(0)
              setPickerCssOn(false)
            }}
            className={active === 0 ? 'on' : ''}>
            오늘
          </button>
          <button
            onClick={() => {
              setActive(1)
              setPickerCssOn(false)
            }}
            className={active === 1 ? 'on' : ''}>
            어제
          </button>
          <button
            onClick={() => {
              setActive(2)
              setPickerCssOn(false)
            }}
            className={active === 2 ? 'on' : ''}>
            최근 7일
          </button>
          <button
            onClick={() => {
              setActive(3)
              setPickerCssOn(false)
            }}
            className={active === 3 ? 'on' : ''}>
            월간
          </button>
          <div className={[`datebox ${pickerCssOn ? 'on' : ''}`]}>
            <section>
              <Datepicker
                text="날짜"
                name="pickdata"
                value={changes.pickdata}
                change={pickerOnChange}
                placeholder="날짜"
                pickerState={pickerState}
              />
              <span className="line">
                <span></span>
              </span>
              <Datepicker
                text="날짜"
                name="pickdata"
                value={changes.pickdata}
                change={pickerOnChangenext}
                placeholder="날짜"
                pickerState={pickerState}
              />
            </section>
            {selectType === 0 && (
              <button
                className="search"
                onClick={() => {
                  fetchData()
                }}>
                검색
              </button>
            )}

            {selectType === 1 && (
              <button
                className="search"
                onClick={() => {
                  fetchDataListen()
                }}>
                검색
              </button>
            )}
          </div>
        </div>

        {resultState == 0 ? (
          <NoResult />
        ) : (
          <>
            <TitleWrap>
              {selectType === 0 && <TitleText>방송요약</TitleText>}
              {selectType === 1 && <TitleText>청취요약</TitleText>}
              <TitleSubMsg>데이터는 최대 6개월까지 검색 가능합니다.</TitleSubMsg>
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
                    <ShortSection key={index}>
                      <div>
                        <div>{listenInfo[section][1]}</div>
                        <div className="count">
                          {listenInfo[section][1] === '청취' && listentotal.length !== 0 && decodeSec(String(listeningTime))}
                          {listenInfo[section][1] === '달 선물' &&
                            listentotal.length !== 0 &&
                            numberFormat(String(giftDalTotCnt))}
                          {listenInfo[section][1] === '받은 별' && listentotal.length !== 0 && numberFormat(String(byeolTotCnt))}
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
                    return (
                      <MobileDetailTab key={idx}>
                        <div>
                          <span>방송일자</span> <span>{dateFormat(value.broadDt)}</span>
                        </div>
                        <div>
                          <span>방송시작 </span>
                          <span>{timeFormat(value.startDt)}</span>
                        </div>
                        <div>
                          <span> 방송종료 </span>
                          <span>{timeFormat(value.endDt)}</span>
                        </div>
                        <div>
                          <span>받은별 </span>
                          <span>{numberFormat(value.byeolCnt)}</span>
                        </div>
                        <div>
                          <span>좋아요</span> <span>{numberFormat(value.likes)}</span>
                        </div>
                        <div>
                          <span>최다 청취자</span> <span>{numberFormat(value.listenerCnt)}</span>
                        </div>
                        <div>
                          <span>방송 최고 순위</span>
                          <span>{value.rank}</span>
                        </div>
                      </MobileDetailTab>
                    )
                  })}

                {selectType === 1 &&
                  listenData.map((value, idx) => {
                    return (
                      <MobileDetailTab key={idx}>
                        <div>
                          <span>청취시작</span> <span>{timeFormat(value.listenDt)}</span>
                        </div>
                        <div>
                          <span>청취종료</span>
                          <span>{timeFormat(value.endDt)}</span>
                        </div>
                        <div>
                          <span>방송방(DJ)</span>
                          <span style={{color: '#8556f6'}}>{value.bjNickNm}</span>
                        </div>
                        <div>
                          <span>선물내역(달)</span>
                          <span>{numberFormat(value.giftDalCnt)}</span>
                        </div>
                        <div>
                          <span>받은내역(별)</span>
                          <span>{numberFormat(value.byeolCnt)}</span>
                        </div>
                        <div>
                          <span>게스트</span> <span>{value.isGuest === false ? '-' : value.isGuest}</span>
                        </div>
                      </MobileDetailTab>
                    )
                  })}
              </div>
            </DetailTable>
          </>
        )}

        {moreState && (
          <Submit onClick={() => showMoreList()}>
            <span>더보기</span>
            <em></em>
          </Submit>
        )}
      </Report>
    </>
  )
}

const MobileDetailTab = styled.div`
  padding: 16px 10px;
  border-bottom: 1px solid #e0e0e0;
  div {
    display: flex;
    justify-content: space-between;
    color: #424242;
    font-size: 14px;
    margin: 16px 0;
    letter-spacing: -0.35px;
    transform: skew(-0.03deg);
    & span {
      :nth-child(1) {
        width: 90px;
        margin-right: 30px;
      }
      :nth-child(2) {
        width: calc(100% - 120px);
      }
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
  background-color: #8556f6;
  background-repeat: no-repeat;
  background-position: center;
`
const ShortSection = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 50%;
  border-bottom: 1px solid #e0e0e0;
  padding: 12px 0;
  &:nth-child(1):before,
  &:nth-child(3):before {
    content: '';
    display: block;
    position: absolute;
    right: 10px;
    top: 50%;
    width: 1px;
    height: calc(100% - 24px);
    transform: translateY(-50%);
    background-color: #e0e0e0;
  }
  > div {
    font-size: 12px;
    color: #616161;
    transform: skew(-0.03deg);
    letter-spacing: -0.3px;
  }
  & .count {
    height: 16px;
    margin-top: 3px;
    font-size: 14px;
    font-weight: 600;
    color: #424242;
    letter-spacing: -0.35px;
  }
`
const BroadcastShort = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
`

const TypeBtn = styled.button`
  color: #757575;
  border: 1px solid #e0e0e0;
  border-radius: 25px;
  padding: 15px;
  width: 86px;

  &.active {
    border-color: #8556f6;
  }
`
const TitleSubMsg = styled.div`
  color: #bdbdbd;
  font-size: 12px;
  height: auto;
  letter-spacing: -0.3px;
  transform: skew(-0.03deg);
`

const TitleText = styled.div`
  color: #8556f6;
  font-size: 20px;
  letter-spacing: -0.5px;
  font-weight: 600;
`
const TitleWrap = styled.div`
  display: flex;
  justify-content: space-between;
  justify-items: center;
  align-items: center;
  border-bottom: 1px solid #8556f6;
  padding-bottom: 25px;
  margin-top: 40px;
`

const Report = styled.div`
  & .radioWrap {
    display: flex;
    margin-top: 20px;
    flex-wrap: wrap;
    & button {
      display: block;
      width: 25%;
      height: 40px;
      letter-spacing: -0.35px;
      line-height: 40px;
      border: 1px solid #e0e0e0;
      font-size: 14px;
      color: #757575;
      margin-right: -1px;
      transform: none;
      &.on {
        width: calc(25% + 1px);
        border: 1px solid ${COLOR_MAIN};
        color: ${COLOR_MAIN};
        margin-right: 0;
      }
    }
  }

  & .datebox {
    margin-top: 16px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #e0e0e0;

    &.on {
      border: 1px solid ${COLOR_MAIN};
    }

    > section {
      width: 75%;
      display: flex;
      padding: 0 1.5%;
      padding-top: 2px;
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
          background-color: #e0e0e0;
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
      width: 25%;
      color: #fff;
      background-color: ${COLOR_MAIN};
      border-color: ${COLOR_MAIN};
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
  margin: 31px auto 0 auto;
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
