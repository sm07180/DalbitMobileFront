// Api
import React, {useState} from 'react'
// context
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
import {useDispatch, useSelector} from "react-redux";
// ----------------------------------------------------------------------
export default function Clip(props) {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  // history
  let history = useHistory()
  const location = useLocation()
  const {tab} = qs.parse(location.search)

  const [localClipTab, setLocalClipTab] = useState(HISTORY_TAB_TYPE.UPLOAD)

  // divide components
  const createContents = () => {
    // props.type is "userprofile" when navigated from /mypage/memNo - clip tab
    if (props.type === 'userprofile' && globalState.urlStr !== globalState.profile.memNo) {
      return <MyPageClipUpload/>
    }
    if (localClipTab === HISTORY_TAB_TYPE.UPLOAD) {
      return <ClipUpload/>
    } else {
      return <ClipHistory/>
    }
  }
  //toggle tab
  const changeTab = (type) => setLocalClipTab(type)

  // render---------------------------------------------------------
  return (
    <div id="mypageClip">
      {!props.type && <Header title="클립"/>}
      {globalState.urlStr === globalState.profile.memNo && (
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
