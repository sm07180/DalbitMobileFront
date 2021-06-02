import React, {useState, useEffect, useCallback, useRef} from 'react'
import {useHistory, useParams} from 'react-router-dom'

import {Hybrid, isHybrid} from 'context/hybrid'

import PresentTab from './tab_present'
import CommentTab from './tab_comment'

export default function anniversaryEvent(){
  const [tabState, setTabState] = useState('present')

  const clickCloseBtn = () => {
    if (isHybrid() && webview && webview === 'new') {
      Hybrid('CloseLayerPopup')
    } else {
      return history.goBack()
    }
  }

   return (
    <>
      <div className="topBox">
        <button className="btnBack" onClick={() => clickCloseBtn()}>
          <img src="https://image.dalbitlive.com/svg/close_w_l.svg" alt="close" />
        </button>
        <img src="https://image.dalbitlive.com/event/anniversary/main.png" className="topBox__mainImg" alt="main Image" />
      </div>
      <div className="contentBox">
        <div className="tabBox">
          <button className={`btn ${tabState === 'present' && 'active'}`} onClick={() => setTabState('present')}>
            <span>EVENT 01</span>
            <span>선물 이벤트</span>
          </button>
          <button className={`btn ${tabState === 'comment' && 'active'}`} onClick={() => setTabState('comment')}>
            <span>EVENT 02</span>
            <span>댓글 이벤트</span>
          </button>
        </div>
        {tabState === 'present' && <PresentTab />}
        {tabState === 'comment' && <CommentTab />}
      </div>
    </>
   )
}