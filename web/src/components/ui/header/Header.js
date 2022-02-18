import React, {useContext, useState} from 'react'
import {useHistory} from 'react-router-dom'

// components
import TitleButton from './TitleButton';
// css
import './header.scss'
import AdminIcon from "../../../pages/menu/static/ic_home_admin.svg";
import {Context} from "../../../context";
import {NODE_ENV} from "../../../constant/define";

const Header = (props) => {
  const {title, type, children, position, newAlarmCnt, backEvent} = props
  const history = useHistory()
  const context = useContext(Context);

  const goBack = () => backEvent? backEvent() : history.goBack();

  const goAdmin = () => {
    if (NODE_ENV === "dev") {
      window.open("https://devm2.dalbitlive.com/admin/question", "_blank");
    } else {
      window.open("https://m.dalbitlive.com/admin/question", "_blank");
    }
  };

  return (
    <header className={`${type ? type : ''} ${position ? position : ''}`}>
      {type === 'back' && <button className="back" onClick={goBack} />}
      {title && <h1 className="title">{title}</h1>}
      {context.adminChecker && title === 'MY' &&
        <a onClick={goAdmin}>
          <img src={AdminIcon} alt="관리자아이콘" />
        </a>
      }
      <TitleButton title={title} newAlarmCnt={newAlarmCnt} />
      {children}
    </header>
  )
}

Header.defaultProps = {
  position:'sticky',
  backEvent: null
}

export default Header
