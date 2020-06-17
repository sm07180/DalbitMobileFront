/**
 * @file /mypage/content/report_popup.js
 * @brief 마이페이지 리포트 날자선택 팝업
 */

import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import moment from 'moment'

import { COLOR_MAIN } from 'context/color'

//static
import closeIco from '../static/ico_close.svg'

//component
import DatePicker from './datepicker'

export default props => {
  const dateToday = moment(new Date()).format('YYYYMMDD')
  const dateDayAgo = moment(
    new Date().setDate(new Date().getDate() - 1)
  ).format('YYYYMMDD')
  const dateWeekAgo = moment(
    new Date().setDate(new Date().getDate() - 7)
  ).format('YYYYMMDD')
  const dateMonthAgo = moment(
    new Date().setMonth(new Date().getMonth() - 1)
  ).format('YYYYMMDD')

  const {
    active,
    setActive,
    setPickerCssOn,
    pickerOnChange,
    pickerOnChangenext,
    pickdataPrev,
    pickdataNext,
    pickerState,
    afterSelected,
    fetchData,
    setPopupState
  } = props

  const clickConfirm = () => {
    fetchData()
    closePopup()
  }

  const closePopup = () => {
    setPopupState(false)
  }

  const closePopupDim = e => {
    const target = e.target
    if (target.id === 'layer-popup') {
      closePopup()
    }
  }

  return (
    <Container id="layer-popup" onClick={closePopupDim}>
      <Popup>
        <div className="header">
          <h1>기간설정</h1>
          <button onClick={closePopup}>
            <img alt="닫기" src={closeIco} />
          </button>
        </div>
        <div className="cont-wrap">
          <div className="btn-wrap">
            <button
              onClick={() => {
                setActive(0)
                setPickerCssOn(false)
                pickerOnChange(dateToday, 'btn')
              }}
              className={active === 0 ? 'on' : ''}
            >
              오늘
            </button>
            <button
              onClick={() => {
                setActive(1)
                setPickerCssOn(false)
                pickerOnChange(dateDayAgo, 'dayAgo')
              }}
              className={active === 1 ? 'on' : ''}
            >
              어제
            </button>
            <button
              onClick={() => {
                setActive(2)
                setPickerCssOn(false)
                pickerOnChange(dateWeekAgo, 'btn')
              }}
              className={active === 2 ? 'on' : ''}
            >
              최근7일
            </button>
            <button
              onClick={() => {
                setActive(3)
                setPickerCssOn(false)
                pickerOnChange(dateMonthAgo, 'btn')
              }}
              className={active === 3 ? 'on' : ''}
            >
              월간
            </button>
          </div>
          <DatePicker
            text="날짜"
            name="pickdata"
            value={pickdataPrev}
            change={pickerOnChange}
            placeholder="날짜"
            pickerState={pickerState}
            afterSelected={afterSelected}
          />
          <DatePicker
            text="날짜"
            name="pickdata"
            value={pickdataNext}
            change={pickerOnChangenext}
            placeholder="날짜"
            pickerState={pickerState}
            afterSelected={afterSelected}
          />
          <button className="confirm" onClick={clickConfirm}>
            기간 적용
          </button>
        </div>
      </Popup>
    </Container>
  )
}

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 60;
  display: flex;
  justify-content: center;
  align-items: center;
`
const Popup = styled.div`
  width: calc(100% - 32px);
  max-width: 360px;
  border-radius: 16px;
  background-color: #fff;

  .header {
    position: relative;
    border-bottom: 1px solid #e0e0e0;
    h1 {
      padding: 13px 0;
      font-size: 16px;
      line-height: 16px;
      font-weight: 800;
      color: #000;
      text-align: center;
    }
    button {
      position: absolute;
      top: 4px;
      right: 7px;
    }
  }

  .cont-wrap {
    padding: 23px 16px 16px 16px;

    .confirm {
      width: 100%;
      margin-top: 24px;
      height: 44px;
      line-height: 44px;
      font-size: 18px;
      font-weight: 600;
      color: #fff;
      border-radius: 12px;
      background: ${COLOR_MAIN};
    }
  }

  .btn-wrap {
    display: flex;
    justify-content: space-between;
    margin-bottom: 13px;
    button {
      width: 24.2%;
      height: 32px;
      line-height: 32px;
      border: 1px solid #e0e0e0;
      font-size: 14px;
      color: #000;
      border-radius: 16px;
      font-weight: 600;

      &.on {
        color: #fff;
        background: ${COLOR_MAIN};
        border: 1px solid ${COLOR_MAIN};
      }
    }
  }
`
