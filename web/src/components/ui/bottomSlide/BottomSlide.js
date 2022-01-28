import React, {useEffect, useState} from 'react'

import './bottomSlide.scss'

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