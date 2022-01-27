import React from 'react'
import {useHistory} from 'react-router-dom'

import './header.scss'
import TitleButton from './TitleButton';

export default (props) => {
  const {title, type, position, children} = props
  const history = useHistory()

  const goBack = () => history.goBack();

  return (
    <header className={`${type ? type : ''} ${position ? position : ''}`}>
      {type === 'back' && <button className="back" onClick={goBack} />}
      {title && <h1 className="title">{title}</h1>}
      <TitleButton title={title} />
      {children}
    </header>
  )
}
