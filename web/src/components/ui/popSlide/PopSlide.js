import React, {useEffect, useState} from 'react'

// css
import './popslide.scss'

const PopSlide = (props) => {
  const {setPopSlide, title, children} = props
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
      e.preventDefault();
      e.stopPropagation();
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
        {title && <h3>{title}</h3>}
        {children}
      </div>
    </div>
  )
}

export default PopSlide