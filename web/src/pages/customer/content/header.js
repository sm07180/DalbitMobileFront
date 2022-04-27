import React from 'react'
import {useHistory} from 'react-router-dom'
// static
import closeBtn from './static/ic_back.svg'
import {useDispatch, useSelector} from "react-redux";

export default (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const history = useHistory()

  const goBack = () => {
    if (globalState.noticeIndexNum.split('/')[3] !== undefined) {
      return history.push('/')
    } else {
      return history.goBack()
    }
  }

  return (
    <div className="header-wrap">
      <div className="child-bundle">{props.children}</div>
      <button className="close-btn" onClick={goBack}>
        <img src={closeBtn} alt="뒤로가기" />
      </button>
    </div>
  )
}
