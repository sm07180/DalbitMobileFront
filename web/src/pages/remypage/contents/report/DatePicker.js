import React, {useState, useEffect} from 'react'

import moment from 'moment'
import DateFnsUtils from '@date-io/moment'
import {DatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers'

// css
import './datePicker.scss'
 
const DatePickerPage = (props) => {
  const [selectedDate, setSelectedDate] = useState(new Date())

  moment.locale('ko')

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
        />
      </MuiPickersUtilsProvider>
    </div>
  )
}

export default DatePickerPage
 