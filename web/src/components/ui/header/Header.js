import React, {useState} from 'react'
import {useHistory} from 'react-router-dom'

// components
import TitleButton from './TitleButton';
// css
import './header.scss'

export default (props) => {
  const {title, type, children, position} = props
  const history = useHistory()

  const goBack = () => history.goBack();

  return (
    <header className={`${type ? type : ''} ${position ? position : ''}`}>
      {type === 'back' && <button className="back" onClick={goBack} />}
      {title && <h1 className="title">{title}</h1>}
      {/* <TitleButton title={title} /> */}
      {children}
    </header>
  )
}
