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

  let startDate = new Date()
  startDate.setFullYear(startDate.getFullYear() - 11)
  startDate.setMonth(0)
  startDate.setDate(1)

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
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            disableFuture
            format="YYYY.MM.DD"
            margin="normal"
            id="date-picker-inline"
            name="birth"
            value={selectedDate}
            onChange={handleDateChange}
            emptyLabel={'생년월일을 선택해주세요.'}
            maxDate={maxDate}
            initialFocusedDate={startDate}
          />
        </MuiPickersUtilsProvider>
      </DatepickerWrap>
    </StylesProvider>
  )
}

const DatepickerWrap = styled.div`
  position: absolute;
  width: 100%;
  top: 0;

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
    background: #fff url(${icoCal}) no-repeat right 8px top 22px;
    background-size: 32px;
    color: #000;
  }
  .MuiInput-underline:before {
    display: none;
  }
  &.no-value .MuiInputBase-input.MuiInput-input {
    font-size: 14px;
    color: #bdbdbd;
    font-weight: 400;
    letter-spacing: -0.5px;
  }
`
