import React from 'react';
import {useHistory} from 'react-router-dom';

// components
import TitleButton from './TitleButton';
// css
import './header.scss'

const Header = (props) => {
  const {title, type, position, backEvent, titleClick, children} = props;
  const history = useHistory();

  const goBack = () => {
    if(backEvent && typeof backEvent === 'function'){
      backEvent();
    }else{
      history.goBack();
    }
  }

  return (
    <header className={`${type ? type : ''} ${position ? position : ''}`}>
      {type === 'back' && <button className="back" onClick={goBack} />}
      {title && <h1 className="title" onClick={titleClick}>{title}</h1>}
      <TitleButton title={title} />
      {children}
    </header>
  )
}

Header.defaultProps = {
  position:'sticky',
  backEvent: null
}

export default Header
