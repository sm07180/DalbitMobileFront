import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { Context } from 'context';

import './index.scss';
export default function AppInfo() {
  
  const history = useHistory();
  const context = useContext(Context);

  const { myInfo } = context;
  const handleHistory = url => {
    history.push(`/customer/appInfo/${url}`);
  }

  const checklogin = () => {
    if (context.token.isLogin === true) {
      history.push(`/secession`)
    } else if (context.token.isLogin === false) {
      window.location.href = '/login'
    }
  }

  return (
    <div className="appInfoWrap">
      <div onClick={() => handleHistory("service")} className="appInfoWrap__eachDiv" >
        <dd>서비스 이용약관</dd>
      </div>
      <div onClick={() => handleHistory("privacy")} className="appInfoWrap__eachDiv" >
        <dd>개인정보 취급방침</dd>
      </div>
      <div onClick={() => handleHistory("youthProtect")} className="appInfoWrap__eachDiv" >
        <dd>청소년 보호정책</dd>
      </div>
      <div onClick={() => handleHistory("operating")} className="appInfoWrap__eachDiv" >
        <dd>운영정책</dd>
      </div>
      <div className="appInfoWrap__eachDiv" onClick={checklogin} >
        <dd>회원 탈퇴</dd>
      </div>
      <div className="appInfoWrap__eachDiv" >
        <div>사용자 ID</div>
        {
          myInfo && myInfo.memId &&
          <div>
            {myInfo.memId}
          </div>
        }
      </div>
    </div>
  )

}