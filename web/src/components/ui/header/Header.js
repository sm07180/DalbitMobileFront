import React from 'react'
import {useHistory} from 'react-router-dom'

import './header.scss'

export default (props) => {
  const {title, type, children} = props
  const history = useHistory()

  const goBack = () => {
    return history.goBack()
  }

  return (
    <header className={`${type ? type : ''}`}>
      {type === 'back' && (
        <button className="back" onClick={goBack}></button>
      )}
      <h1 className="title">{title}</h1>
      {title === '라이브' && 
        <div className="buttonGroup">
          <button className='ranking'></button>
          <button className='message'></button>
          <button className='alarm'></button>
        </div>
      }
      {title === '클립' && 
        <div className="buttonGroup">
          <button className='search'></button>
          <button className='alarm'></button>
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
