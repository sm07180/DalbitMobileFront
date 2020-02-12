/**
 * @file /user/content/style-datepicker.js
 * @brief datepicker component
 * @props text : label 태그에 들어갈 텍스트
 *        value : YYYYMMDD, 빈 값일시 현재 날짜로 셋팅
 */

import React, {useState, useEffect} from 'react'
import styled from 'styled-components'

import moment from 'moment'
import DateFnsUtils from '@date-io/moment'
import {DatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers'
import {StylesProvider} from '@material-ui/core/styles'

export default props => {
  //---------------------------------------------------------------------
  //date 셋팅
  let date = new Date()
  date.setFullYear(date.getFullYear() - 17)
  //useState
  const [selectedDate, setSelectedDate] = useState(props.value ? props.value : date)

  //console.log('props.value = ' + selectedDate)
  const handleDateChange = date => {
    setSelectedDate(date)
    props.change(moment(date).format('YYYYMMDD'))
  }
  useEffect(() => {
    handleDateChange(selectedDate)
  }, [props.value])

  useEffect(() => {
    handleDateChange(selectedDate)
  }, [props.value])

  //console.log('selectedDate', selectedDate)
  //---------------------------------------------------------------------
  //캘린더 한글화
  moment.locale('ko')
  //---------------------------------------------------------------------
  return (
    <StylesProvider injectFirst>
      <DatepickerWrap>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker format="YYYY-MM-DD" margin="normal" id="date-picker-inline" name="birth" label={props.text} value={selectedDate} onChange={handleDateChange} />
        </MuiPickersUtilsProvider>
      </DatepickerWrap>
    </StylesProvider>
  )
}

const DatepickerWrap = styled.div`
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
`
