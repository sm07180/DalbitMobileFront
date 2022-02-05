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
      {title && <div className="title">{title}</div>}
      <div className={`inputItems`}>
        {type === 'text' &&
          <>
            <div className="inputBox" onFocus={onFocus} onBlur={onBlur}>
              {children}
            </div>
            {button &&
              <button type="button" className={`inputBtn ${btnClass && btnClass}`} onClick={onClick}>{button}</button>
            }
            {onClick && <p className='textLog'></p>}
          </>
        }
        {type === 'textarea' &&
          <div className="textareaBox">
            {children}
          </div>
        }
      </div>
    </>
  )
}

InputItems.defaultProps = {
  type: 'text',
}

export default InputItems
