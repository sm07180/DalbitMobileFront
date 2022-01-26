import React, {useContext, useEffect, useRef, useState} from 'react'
import {useHistory} from 'react-router-dom'
// context
import {Context} from 'context'
import Api from 'context/api'
import qs from 'query-string'

import Header from './header'
import {Hybrid, isHybrid} from 'context/hybrid'
import Utility from 'components/lib/utility'

export default function bottomSlide({props, setSlidePop, children}) {
  const [popOpen, setPopOpen] = useState(true);

  const closePopup = () => {
    setPopOpen(false)
    setTimeout(() => {
      setSlidePop(false)
    }, 400)
  }
  const closePopupDim = (e) => {
    const target = e.target
    if (target.id === 'bottomSlide') {
      closePopup()
    }
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div id="bottomSlide" onClick={closePopupDim}>
      <div className={`slideLayer ${popOpen ? "slideUp" : "slideDown"}`}>
        {children}
      </div>
    </div>
  )
}
