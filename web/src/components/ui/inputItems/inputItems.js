import React, {useState} from 'react'

import './inputItems.scss'

const InputItems = (props) => {
  const {title,type,button,onClick,btnClass,children} = props

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
      <div className={`inputItems`}>
        {title && <div className="title">{title}</div>}
        {type === 'text' &&
          <>
            <label className="inputBox" onFocus={onFocus} onBlur={onBlur}>
              {children}
            </label>
            {button &&
              <button type="button" className={`inputBtn ${btnClass && btnClass}`} onClick={onClick}>{button}</button>
            }
            {onClick && <p className='textLog'></p>}
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
}

export default InputItems
