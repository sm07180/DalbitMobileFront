import React from 'react'

import './button.scss'

const Button = (props) => {
  const {children, height, active} = props

  // 페이지 시작
  return (
    <div className={`buttonOuter ${active ? "active" : ""}`} style={{paddingBottom : height}}>
      <div className='buttonInner'>
        <div className='buttonWrap'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Button
