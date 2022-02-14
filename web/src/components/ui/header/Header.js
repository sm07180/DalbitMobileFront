import React, {useState} from 'react'
import {useHistory} from 'react-router-dom'

// components
import TitleButton from './TitleButton';
// css
import './header.scss'

const Header = (props) => {
  const {title, type, children, position, newAlarmCnt} = props
  const history = useHistory()

  const goBack = () => history.goBack();

  return (
    <header className={`${type ? type : ''} ${position ? position : ''}`}>
      {type === 'back' && <button className="back" onClick={goBack} />}
      {title && <h1 className="title">{title}</h1>}
      <TitleButton title={title} newAlarmCnt={newAlarmCnt} />
      {children}
    </header>
  )
}

Header.defaultProps = {
  position:'sticky'
}

export default Header