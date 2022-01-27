import React, {Children, useContext, useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
// context
import {Context} from 'context'
import Api from 'context/api'

import Header from './header'
import {Hybrid, isHybrid} from 'context/hybrid'
import Utility from 'components/lib/utility'

export default function signField(props) {
  const {title, children, btnFunction} = props

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
    <div className='signField'>
      <Header leftCtn="backBtn"></Header>
      <div className='signContent'>
        <div className='signInfo'>{title}</div>
        <form>
          <div className='inputWrap'>
            {children}
          </div>
          <button className='signBtn' onClick={btnFunction}>다음</button>
        </form>
      </div>
    </div>    
  )
}
