import React,{useState} from  'react'

import './anniversary.scss'
import PresentTab from './contents/tab_present'
import CommentTab from './contents/tab_comment'

export default function anniversaryEvent() {
  const [tabState, setTabState] = useState('present')

  return (
  <div id="anniversaryEventPage">
    <div className="topBox">
        <img src="https://image.dalbitlive.com/event/anniversary/main.png" className="topBox_mainImg" alt="main Image" />
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
  </div>
  )
}