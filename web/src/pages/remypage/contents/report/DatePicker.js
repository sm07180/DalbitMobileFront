import React, {useState, useEffect} from 'react'

import moment from 'moment'
import DateFnsUtils from '@date-io/moment'
import {DatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers'

// css
import './datePicker.scss'

const DatePickerPage = (props) => {
  const {value, change, changeActive} = props //ReportPopup.js에서 넘겨줌
  const [selectedDate, setSelectedDate] = useState() //datapicker - value값

  const handleDateChange = () => { //datepicker -> 요일 클릭시 dt값 변경, value값 변경
    change(moment(value).format("YYYYMMDD"));
    setSelectedDate(value);
  }

  const onAccept = (e) => { //datepicker -> OK버튼 클릭시 dateType변경, dt값 변경
    change(moment(e).format("YYYYMMDD"));
    changeActive(4);
  }

  moment.locale('ko')

  useEffect(() => {
    handleDateChange(value);
  }, [value]);

  return (
    <div className="datePicker">
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DatePicker
          disableFuture
          format="YYYY-MM-DD"
          margin="normal"
          id="date-picker-inline"
          name="picker"
          value={selectedDate}
          onChange={handleDateChange}
          onAccept={onAccept}
        />
      </MuiPickersUtilsProvider>
    </div>
  )
}

export default DatePickerPage;
