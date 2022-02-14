import React, {useState} from 'react'
import {useHistory} from 'react-router-dom'

// components
import TitleButton from './TitleButton';
// css
import './header.scss'

const Header = (props) => {
  const {title, type, children, position, backClickEvent} = props
  const history = useHistory()

  const goBack = () => backClickEvent? backClickEvent() : history.goBack();

  return (
    <header className={`${type ? type : ''} ${position ? position : ''}`}>
      {type === 'back' && <button className="back" onClick={goBack} />}
      {title && <h1 className="title">{title}</h1>}
      <TitleButton title={title} />
      {children}
    </header>
  )
}

Header.defaultProps = {
  position:'sticky',
  backClickEvent: null
}

export default Header