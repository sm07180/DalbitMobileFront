import React, {useContext, useEffect, useState} from 'react'
import API from 'context/api'
import {Context} from 'context'
import {useHistory} from 'react-router-dom'
import Lottie from 'react-lottie'

export default (props) => {
  const history = useHistory()
  const context = useContext(Context)
  const globalCtx = useContext(Context)
  const {token} = globalCtx
  
  const {scrollOn} = props;

  //pathname
  const urlrStr = history.location.pathname

  return (
    <div className={`eventFloat draw ${scrollOn === true ? '' : 'low'}`}></div>
  )
}
