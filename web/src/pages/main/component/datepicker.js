import React, {useState, useEffect} from 'react'
import styled from 'styled-components'

import {IMG_SERVER} from 'context/config'
import moment from 'moment'
import DateFnsUtils from '@date-io/moment'
import {DatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers'
import {StylesProvider} from '@material-ui/core/styles'

import icoCal from '../static/calender_b.svg'

export default (props) => {
  //---------------------------------------------------------------------
  let maxDate = new Date()
  maxDate.setFullYear(maxDate.getFullYear() - 11)
  maxDate.setMonth(12)
  maxDate.setDate(0)

  const [selectedDate, setSelectedDate] = useState(props.value)

  const handleDateChange = (date) => {
    setSelectedDate(date)
    props.change(moment(date).format('YYYYMMDD'))
  }

  moment.locale('ko')

  //---------------------------------------------------------------------
  return (
    <StylesProvider injectFirst>
      <DatepickerWrap className={props.value === null ? 'no-value' : ''}>
        {selectedDate === undefined && <span className="placeholder">생년월일을 입력해주세요</span>}
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            disableFuture
            format="YYYY.MM.DD"
            margin="normal"
            id="date-picker-inline"
            name="birth"
            value={selectedDate}
            onChange={handleDateChange}
            disableFuture="true"
          />
        </MuiPickersUtilsProvider>
      </DatepickerWrap>
    </StylesProvider>
  )
}

const DatepickerWrap = styled.div`
  width: calc(100% - 23px);
  top: 24px;
  position: absolute;
  .placeholder {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 3;
    background: #fff;
    font-size: 14px;
    color: #9e9e9e;
    line-height: 32px;
  }

  .MuiFormControl-root {
    width: 100%;
    margin: 0;
  }
  label,
  .MuiInput-underline:after {
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
  }
  .MuiInputBase-root {
    color: inherit;
    font-size: inherit;
    font-family: inherit;
    line-height: inherit;
  }
  .MuiInputBase-input.MuiInput-input {
    padding: 0;
    height: 32px;
    background: #fff url(${icoCal}) no-repeat right 0px top 1px;
    background-size: 32px;
    color: #000;
  }
  .MuiInput-underline:before {
    display: none;
  }
  &.no-value .MuiInputBase-input.MuiInput-input {
    font-size: 16px;
    color: #bdbdbd;
    font-weight: bold;
    letter-spacing: -0.5px;
  }
  #date-picker-inline {
    font-weight: bold;
  }
`
