import React from 'react'

import './inputItems.scss'

const InputItems = (props) => {
  const {title,type,button,onClick,children,logYn,focusDisable,index} = props

  const onFocus = (e) => {
    const targetClassName = e.target.parentNode
    targetClassName.classList.add('focus')
  }
  const onBlur = (e) => {
    const targetClassName = e.target.parentNode
    targetClassName.classList.remove('focus')
  }

  return (
    <>
      <div className="inputItems">
        {title && <div className="title">{title}</div>}
        {type === 'text' &&
          <>
            <label className="inputBox"
                   onFocus={(e) => {!focusDisable && onFocus(e)}}
                   onBlur={(e) => {!focusDisable && onBlur(e)}}>
              {children}
            </label>
            {button &&
              <button type="button" className='inputBtn' data-index={index} onClick={onClick}>{button}</button>
            }
            {logYn && <p className='textLog'/>}
          </>
        }
        {type === 'textarea' &&
          <label className="textareaBox" onFocus={onFocus} onBlur={onBlur}>
            {children}
          </label>
        }
      </div>
    </>
  )
}

InputItems.defaultProps = {
  type: 'text',
  focusDisable: false  //포커스 이벤트 막기
}

export default InputItems
