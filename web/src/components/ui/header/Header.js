import React from 'react'
import {useHistory} from 'react-router-dom'

import './header.scss'
import TitleButton from './TitleButton';

export default (props) => {
  const {title, type, children} = props
  const history = useHistory()

  const goBack = () => history.goBack();

  return (
    <header className={`${type ? type : ''}`}>
      {type === 'back' && <button className="back" onClick={goBack} />}
      <h1 className="title">{title}</h1>
      <TitleButton title={title} />
      {children}
    </header>
  )
}
