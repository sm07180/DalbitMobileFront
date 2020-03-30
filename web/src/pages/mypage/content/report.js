/**
 * @file /mypage/content/report.js
 * @brief 마이페이지 리포트
 */

import React, {useEffect, useStet, useContext, useState} from 'react'
import styled from 'styled-components'

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
//
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P, PHOTO_SERVER} from 'context/color'
// import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
////////

let pickerHolder = true
const iconInfo = {
  mic: [mic, '방송'],
  moon: [moon, '받은별'],
  heart: [heart, '좋아요'],
  clock: [clock, '청취자']
}
const selectBoxData = [
  {value: 0, text: '방송'},
  {value: 1, text: '청취'}
]

export default props => {
  const context = useContext(Context)
  const [active, setActive] = useState(0)
  const [selectType, setSelectType] = useState(0)

  const setType = value => {
    setSelectType(value)
    console.log(selectType)
  }
  const ctx = useContext(Context)
  const detialTabList = ['방송일자', '방송시작', '청취종료', '받은별', '좋아요', '최다 청취자', '방송 최고순위']
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const [validate, setValidate] = useState({
    // 유효성 체크
    pickdata: false
  })
  const [currentPickdata, setCurrentPickdata] = useState() // 생년월일 확인 도움 텍스트 값

  const [pickerState, setPickerState] = useState(true)
  const [broadData, setBroadData] = useState([])
  const [showingpage, setShowingpage] = useState(false)
  //////////////////////api
  // const ShowDate =()=> {
  //   if () {

  //   }else if () {

  //   }
  // }
  console.log(broadData)
  async function fetchData() {
    const res = await Api.report_broad({
      params: {
        dateType: active,
        startDt: dateprev,
        endDt: datenext,
        page: 1,
        records: 10
      }
    })
    if (res.result === 'success') {
      setBroadData(res.data.list)
      console.log(res)
    } else if (res.result === 'fail') {
      console.log(res)
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
  }

  const pickerOnChangenext = value => {
    if (!changes.pickdata) {
      dateDefault = value
    } else {
      validateBirth(value)
      setDatenext(value)
      setActive(4)
    }
  }

  const validateBirth = value => {
    //생년월일 바뀔때마다 유효성
    let year = value.slice(0, 4)
    if (year == '') {
      //console.log('빈값')
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

  const more = () => {
    async function fetchData() {
      const res = await Api.report_broad({
        params: {
          dateType: active,
          startDt: dateprev,
          endDt: datenext,
          page: 1,
          records: 10
        }
      })
      if (res.result === 'success') {
        setBroadData(res.data.list)
        console.log(res)
      } else if (res.result === 'fail') {
        console.log(res)
      }
    }
    fetchData()
  }
  return (
    <Report>
      <TitleWrap style={{paddingBottom: '25px'}}>
        <TitleText>리포트</TitleText>
        {/* <div>
          <TypeBtn style={{marginRight: '5px'}}>방송</TypeBtn>
          <TypeBtn style={{marginLeft: '5px'}}>청취</TypeBtn>
        </div> */}
        <SelectWrap>
          <SelectBoxs boxList={selectBoxData} onChangeEvent={setType} inlineStyling={{right: 0, top: '-20px', zIndex: 8}} />
        </SelectWrap>
      </TitleWrap>
      <div className="radioWrap">
        <button onClick={() => setActive(0)} className={active === 0 ? 'on' : ''}>
          오늘
        </button>
        <button onClick={() => setActive(1)} className={active === 1 ? 'on' : ''}>
          어제
        </button>
        <button onClick={() => setActive(2)} className={active === 2 ? 'on' : ''}>
          최근 7일
        </button>
        <button onClick={() => setActive(3)} className={active === 3 ? 'on' : ''}>
          월간
        </button>
        <div className="datebox">
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

          <button className="search" onClick={fetchData}>
            검색
          </button>
        </div>
      </div>
      <TitleWrap>
        <TitleText>방송요약</TitleText>
        <TitleSubMsg>데이터는 최대 6개월까지 검색 가능합니다.</TitleSubMsg>
      </TitleWrap>

      <BroadcastShort>
        {Object.keys(iconInfo).map((section, index) => {
          return (
            // <ShortSection key={index}>
            //   <SectionIcon style={{backgroundImage: `url(${iconInfo[section][0]})`}} />
            //   <div>
            //     <div>0</div>
            //     <div>{iconInfo[section][1]}</div>
            //   </div>
            // </ShortSection>
            <ShortSection key={index}>
              <div>
                <div>{iconInfo[section][1]}</div>
                <div className="count">0</div>
              </div>
            </ShortSection>
          )
        })}
      </BroadcastShort>

      <TitleWrap>
        <TitleText>상세내역</TitleText>
      </TitleWrap>

      <DetailTable>
        {/* <DetailTableNav>
          {detialTabList.map((text, index) => {
            return <DetailTableTab key={index}>{text}</DetailTableTab>
          })}
        </DetailTableNav> */}

        <div>
          {broadData.map((value, idx) => {
            return (
              <MobileDetailTab key={idx} className={idx > 2 && showingpage === false ? 'disable' : 'able'}>
                <div>
                  <span>방송일자</span> <span>{value.broadDt}</span>
                </div>
                <div>
                  <span>방송시작 </span>
                  <span>{value.startDt}</span>
                </div>
                <div>
                  <span> 방송종료 </span>
                  <span>{value.endDt}</span>
                </div>
                <div>
                  <span>받은별 </span>
                  <span>{value.byeolCnt}</span>
                </div>
                <div>
                  <span> 좋아요</span> <span>{value.likes}</span>
                </div>
                <div>
                  <span> 최다 청취자</span> <span>{value.listenerCnt}</span>
                </div>
                <div>
                  <span>방송 최고 순위</span>
                  <span>{value.rank}</span>
                </div>
              </MobileDetailTab>
            )
          })}
        </div>
      </DetailTable>

      <Submit onClick={() => setShowingpage(true)} className={showingpage === true ? 'disable' : ''}>
        <span>더보기</span>
        <em></em>
      </Submit>
    </Report>
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
      width: 50%;
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
  font-family: NanumSquareB;
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

    > section {
      width: 75%;
      display: flex;
      padding: 0 1.5%;
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
    padding: 10px 10px;
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
  padding: 8px 0 4px 0;
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
