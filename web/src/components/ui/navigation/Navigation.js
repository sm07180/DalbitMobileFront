import React from 'react'

import './navigation.scss'
import {useHistory} from "react-router-dom";

const Navigation = (props) => {
  const history = useHistory();
  return (
    <>
    <div id="navigation">
      <nav>
        <div className="navi" onClick={() => history.push('/')} />
        <div className="navi" onClick={() => history.push('/clip')} />
        <div className="navi"></div>
        <div className="navi" onClick={() => history.push('/search')} />
        <div className="navi" onClick={() => history.push(`/mypage`)} />
      </nav>
    </div>
    </>
  )
}

export default Navigation
