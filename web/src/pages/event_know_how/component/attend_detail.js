import React from 'react'
import {useHistory} from 'react-router-dom'

function AttendDetail() {
  const history = useHistory()
  return <h1 onClick={() => history.goBack()}>Detail</h1>
}

export default React.memo(AttendDetail)
