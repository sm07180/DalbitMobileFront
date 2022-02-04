import React, {useState} from 'react'

import './inputItems.scss'

const InputItems = (props) => {
  const {title,type,button,children} = props

  return (
    <>
      <div className="inputItems">
        <div className="title">{title}</div>
        {type === 'text' &&
          <>
            <div className="inputBox">
              {children}
            </div>
            {button &&
              <button className='inputBtn'>{button}</button>
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
