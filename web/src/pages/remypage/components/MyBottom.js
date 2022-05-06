import React from 'react';

import Api from 'context/api';
import SubmitBtn from '../../../components/ui/submitBtn/SubmitBtn';

import {Hybrid, isHybrid} from "context/hybrid";
import {useDispatch} from "react-redux";
import {setGlobalCtxMessage, setGlobalCtxUpdateToken, setGlobalCtxUpdateProfile} from "redux/actions/globalCtx";

const MyBottom = () => {
  const dispatch = useDispatch();
  const customHeader = JSON.parse(Api.customHeader);

  const logout = () => {
    Api.member_logout().then(res => {
      if (res.result === 'success') {
        if (isHybrid()) {
          Hybrid('GetLogoutToken', res.data)
          Hybrid('ExitRoom', '');
        }
        dispatch(setGlobalCtxUpdateToken(res.data));
        dispatch(setGlobalCtxUpdateProfile(null));
        window.location.href = '/'
      } else if (res.result === 'fail') {
        dispatch(setGlobalCtxMessage({type:'alert',
          title: '로그아웃 실패',
          msg: `${res.message}`
        }))
      }
    })
  };

  return (
    <section className="mypageBottom">
      {isHybrid() &&
        <div className="versionInfo">
          <span className="title">버전정보</span>
          <span className="version">현재 버전 {customHeader.appVer}</span>
        </div>
      }
      <SubmitBtn text="로그아웃" onClick={logout} />
    </section>
  )
}

export default MyBottom;
