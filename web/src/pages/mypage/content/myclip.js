// Api
import React, {useCallback, useContext, useEffect, useState} from 'react'
// context
import {Context} from 'context'
import Api from 'context/api'
import {HISTORY_TAB_TYPE} from 'pages/mypage/content/constant'
// router
import {useHistory, useLocation} from 'react-router-dom'
// scss
import '../myclip.scss'
// components
import ClipUpload from '../component/clip/clip_upload'
import MyPageClipUpload from '../component/clip/mypage_clip_upload'
import ClipHistory from '../component/clip/clip_history'
import Header from '../component/header.js'
import qs from 'query-string'
// ----------------------------------------------------------------------
export default function Clip(props) {
  // history
  let history = useHistory()
  const context = useContext(Context)
  const location = useLocation()
  const {tab} = qs.parse(location.search)

  const [localClipTab, setLocalClipTab] = useState(HISTORY_TAB_TYPE.UPLOAD)

  // divide components
  const createContents = () => {
    // props.type is "userprofile" when navigated from /mypage/memNo - clip tab
    if (localClipTab === HISTORY_TAB_TYPE.UPLOAD && props.type !== 'userprofile') {
      return <ClipUpload />
    } else if (props.type === 'userprofile') {
      return <MyPageClipUpload />
    } else {
      return <ClipHistory />
    }
  }
  //toggle tab
  const changeTab = (type) => setLocalClipTab(type)

  // render---------------------------------------------------------
  return (
    <div id="mypageClip">
      {!props.type && <Header title="클립" />}
      {context.urlStr === context.profile.memNo && (
        <div className="header">
          <div className="header__tab">
            <button
              onClick={() => changeTab(HISTORY_TAB_TYPE.UPLOAD)}
              className={localClipTab === HISTORY_TAB_TYPE.UPLOAD ? 'header__tabBtn header__tabBtn--active' : 'header__tabBtn'}>
              업로드
            </button>
            <button
              onClick={() => changeTab(HISTORY_TAB_TYPE.HISTORY)}
              className={localClipTab === HISTORY_TAB_TYPE.HISTORY ? 'header__tabBtn header__tabBtn--active' : 'header__tabBtn'}>
              청취내역
            </button>
          </div>
        </div>
      )}
      {createContents()}
    </div>
  )
}
