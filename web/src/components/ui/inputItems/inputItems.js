import React, {useState} from 'react'

import './inputItems.scss'

const InputItems = (props) => {
  const {title,type,button,onClick,children} = props

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
            <div className="inputBox" onFocus={onFocus} onBlur={onBlur}>
              {children}
            </div>
            {button &&
              <button className='inputBtn' onClick={onClick}>{button}</button>
            }
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
