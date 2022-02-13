import React, {useEffect, useState} from 'react'

// css
import './popslide.scss'

const PopSlide = (props) => {
  const {setPopSlide, children} = props
  const [popOpen, setPopOpen] = useState(true);

  const closePopup = () => {
    setPopOpen(false)
    setTimeout(() => {
      setPopSlide(false)
    }, 400)
  }
  const closePopupDim = (e) => {
    const target = e.target
    if (target.id === 'popSlide') {
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
    <div id="popSlide" onClick={closePopupDim}>
      <div className={`slideLayer ${popOpen ? "slideUp" : "slideDown"}`}>
        {children}
      </div>
    </div>
  )
}

export default PopSlide