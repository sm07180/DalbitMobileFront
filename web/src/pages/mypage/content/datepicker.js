/**
 * @file /user/content/style-datepicker.js
 * @brief datepicker component
 * @props text : label 태그에 들어갈 텍스트
 *        value : YYYYMMDD, 빈 값일시 현재 날짜로 셋팅
 */

import React, {useState, useEffect} from 'react'
import styled from 'styled-components'

import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

import moment from 'moment'
import DateFnsUtils from '@date-io/moment'
import {DatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers'
import {StylesProvider} from '@material-ui/core/styles'

export default props => {
  //---------------------------------------------------------------------

  //date 셋팅
  let date = new Date()

  //useState
  //최신날짜로 했던거 바꾸기
  const [selectedDate, setSelectedDate] = useState()

  const handleDateChange = date => {
    props.change(moment(props.value).format('YYYYMMDD'))
    setSelectedDate(props.value)
  }
  useEffect(() => {
    handleDateChange(props.value)
  }, [props.value])

  //---------------------------------------------------------------------
  //캘린더 한글화
  moment.locale('ko')
  //---------------------------------------------------------------------
  return (
    <StylesProvider injectFirst>
      <DatepickerWrap /*className={props.pickerState ? 'holder-on' : 'holder-off'}*/>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            disableFuture
            format="YYYY-MM-DD"
            margin="normal"
            id="date-picker-inline"
            name="picker"
            label={props.text}
            value={selectedDate}
            onChange={handleDateChange}
            onAccept={e => {
              props.change(moment(e).format('YYYYMMDD'))
              props.afterSelected()
            }}
            // placeholder={props.placeholder}
          />
          {/* <span className="holder">{props.placeholder}</span> */}
        </MuiPickersUtilsProvider>
      </DatepickerWrap>
    </StylesProvider>
  )
}

const DatepickerWrap = styled.div`
  position: relative;
  .MuiFormControl-root {
    width: 100%;
    margin: 0;
  }
  label,
  .MuiInput-underline:after {
    display: none;
  }
  label,
  .MuiInput-underline:before {
    display: none;
  }
  label + .MuiInput-formControl {
    margin-top: 0;
  }
  .MuiInput-underline:hover:not(.Mui-disabled):before {
    display: none;
  }
  .MuiInputBase-input {
    height: inherit;
    font-size: 12px;
  }
  .MuiInputBase-root {
    color: inherit;
    font-size: inherit;
    font-family: inherit;
    line-height: inherit;
  }
  .MuiInputBase-input.MuiInput-input {
    background: url(${IMG_SERVER}/images/api/ico_calendar@3x.png) no-repeat 98% 0%;
    background-size: 24px;
    /* color: rgba(0, 0, 0, 0); */
    color: #616161;
  }
  &.holder-on .MuiInputBase-input.MuiInput-input {
    color: rgba(0, 0, 0, 0);
  }
  &.holder-off .MuiInputBase-input.MuiInput-input {
    color: #616161;
  }
  span.holder {
    display: inline-block;
    position: absolute;
    left: 1px;
    top: 1px;
    padding-right: 40px;
    line-height: 48px;
    z-index: -1;
    padding-left: 16px;
    color: #616161;
    transform: skew(-0.03deg);
    background: #fff;
  }
  &.holder-off span.holder {
    display: none;
  }
`
