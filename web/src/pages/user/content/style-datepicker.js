/**
 * @file /user/content/style-datepicker.js
 * @brief datepicker component
 * @props text : label 태그에 들어갈 텍스트
 *        value : YYYYMMDD, 빈 값일시 현재 날짜로 셋팅
 */

import React, {useState} from 'react'
import styled from 'styled-components'

import moment from 'moment'
import DateFnsUtils from '@date-io/moment'
import {DatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers'
import {StylesProvider} from '@material-ui/core/styles'

export default props => {
  //---------------------------------------------------------------------
  //useState
  const [selectedDate, setSelectedDate] = useState(props.value !== undefined ? props.value : new Date())
  console.log('props.value = ' + selectedDate)
  const handleDateChange = date => {
    setSelectedDate(date)
  }
  //---------------------------------------------------------------------
  //캘린더 한글화
  moment.locale('ko')
  //---------------------------------------------------------------------
  return (
    <StylesProvider injectFirst>
      <DatepickerWrap>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker format="YYYY-MM-DD" margin="normal" id="date-picker-inline" label={props.text} value={selectedDate} onChange={handleDateChange} />
        </MuiPickersUtilsProvider>
      </DatepickerWrap>
    </StylesProvider>
  )
}

const DatepickerWrap = styled.div`
  .MuiFormControl-root {
    width: 100%;
  }
`
