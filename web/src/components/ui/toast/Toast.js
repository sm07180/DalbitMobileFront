import React, { useState, useEffect } from 'react'

import './toast.scss'

const Toast = (props) => {
  const {msg} = props
  const [toastAni, setToastAni] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setToastAni(false)
    }, 2800)
  }, [])

  return (
    <div id='toast' className={`${toastAni ? "up" : "down"}`}>
      <p>{msg}</p>
    </div>
  )
}

export default Toast
