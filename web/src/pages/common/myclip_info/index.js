import React from 'react'

import './index.scss'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxVisible} from "redux/actions/globalCtx";

export default () => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  return (
    <div id="MyClipPopup">
      <div className="title">
        <h2>내 클립 현황</h2>
        <button onClick={() => {
          dispatch(setGlobalCtxVisible(false));
        }}>확인
        </button>
      </div>
      <div className="content">
        <ul>
          <li>
            <span className="upload">등록 클립 수</span>
            <p>등록한 클립 중 공개 설정된 클립의 수</p>
          </li>
          <li>
            <span className="listen">청취 횟수</span>
            <p>등록한 모든 클립의 청취 횟수</p>
          </li>
          <li>
            <span className="like">받은 좋아요</span>
            <p>등록한 모든 클립의 받은 좋아요 수</p>
          </li>
          <li>
            <span className="gift">받은 선물</span>
            <p>등록한 모든 클립의 받은 선물 수</p>
          </li>
        </ul>
      </div>
    </div>
  )
}
