import React from 'react'

import './navigation.scss'
import {useHistory} from "react-router-dom";

const Navigation = (props) => {
  const history = useHistory();
  return (
    <>
      <nav>
        <div className="navi"></div>
        <div className="navi" onClick={() => history.push('/clip')} />
        <div className="navi"></div>
        <div className="navi" onClick={() => history.push('/search')} />
        <div className="navi" onClick={() => history.push(`/mypage`)} />
      </nav>
    </>
  )
}

export default Navigation
