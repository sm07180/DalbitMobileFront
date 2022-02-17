import React from 'react'
import {useHistory} from 'react-router-dom'
import './index.scss'
import {useDispatch, useSelector} from "react-redux";

export default function AppInfo() {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const history = useHistory()

  const {profile} = globalState

  const handleHistory = (url) => {
    history.push(`/customer/appInfo/${url}`)
  }

  const checklogin = () => {
    if (globalState.token.isLogin === true) {
      history.push(`/secession`)
    } else if (globalState.token.isLogin === false) {
      history.push('/login')
    }
  }

  return (
    <div className="appInfoWrap">
      <div onClick={() => handleHistory('service')} className="appInfoWrap__eachDiv">
        <dd>서비스 이용약관</dd>
      </div>
      <div onClick={() => handleHistory('privacy')} className="appInfoWrap__eachDiv">
        <dd>개인정보 취급방침</dd>
      </div>
      <div onClick={() => handleHistory('youthProtect')} className="appInfoWrap__eachDiv">
        <dd>청소년 보호정책</dd>
      </div>
      <div onClick={() => handleHistory('operating')} className="appInfoWrap__eachDiv">
        <dd>운영정책</dd>
      </div>
      <div className="appInfoWrap__eachDiv" onClick={checklogin}>
        <dd>회원 탈퇴</dd>
      </div>
      <div className="appInfoWrap__eachDiv">
        <div>사용자 ID</div>
        {profile && profile.memId && <div>{profile.memId}</div>}
      </div>
    </div>
  )
}
