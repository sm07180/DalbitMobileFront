import React, {useState} from 'react'
import {useHistory} from 'react-router-dom'

import './header.scss'

export default (props) => {
  const {title, type, children, position} = props
  const history = useHistory()

  const goBack = () => {
    return history.goBack()
  }

  return (
    <header className={`${type ? type : ''} ${position ? position : ''}`}>
      {type === 'back' && (
        <button className="back" onClick={goBack}></button>
      )}
      {title && <h1 className="title">{title}</h1>}
      {title === '메인' && 
        <div className="buttonGroup">
          <button className='ranking'></button>
          <button className='message'></button>
          <button className='alarm'></button>
        </div>
      }
      {title === '클립' && 
        <div className="buttonGroup">
          <button className='message'></button>
          <button className='alarm'></button>
        </div>
      }
      {title === '좋아요한 클립' && 
        <div className="buttonGroup">
          <button className='play'></button>
          <button className='shuffle'></button>
        </div>
      }
      {title === '최근 들은 클립' && 
        <div className="buttonGroup">
          <button className='play'></button>
          <button className='shuffle'></button>
        </div>
      }
      {title === 'MY' && 
        <div className="buttonGroup">
          <button className='store'></button>
          <button className='search'></button>
          <button className='alarm'></button>
        </div>
      }
      {children}
    </header>
  )
}
