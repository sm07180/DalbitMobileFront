import React, {useState, useContext, useEffect} from 'react'

import Header from 'components/ui/header/Header'
import PhoneAuth from "./components/phoneAuth";
import NickNameSetting from "./components/nickNameSetting";
import PasswordSetting from "./components/passwordSetting";

import './style.scss'
import Api from "context/api";
import qs from "query-string";
import {Hybrid, isAndroid, isHybrid} from "context/hybrid";
import Utility from "components/lib/utility";
import {Context} from "context";
import {useHistory} from "react-router-dom";

const SignUpPage = () => {
  const context = useContext(Context)
  const history = useHistory();
  const [step, setStep] = useState(1);
  const {webview, redirect} = qs.parse(location.search);

  const [signForm, setSignForm] = useState({
    phoneNum:"",
    requestNum:"",
    CMID:"",
    nickName:"",
    password:"",
    passwordCheck:"",
    memType : "p"
  })

  useEffect(() => {
    try {
      fbq('track', 'Lead')
      firebase.analytics().logEvent('Lead')
      kakaoPixel('114527450721661229').participation()
    } catch (e) {}
  }, [])


  const onChange = (e) => {
    const { value, name } = e.target;
    setSignForm({
      ...signForm,
      [name]: value
    });
  };


  //1. 회원가입
  async function signUp() {
    const nativeTid = context.nativeTid == null || context.nativeTid == 'init' ? '' : context.nativeTid
    const {result, data, message} = await Api.member_join({
      data: {
        memType: signForm.memType, memId: signForm.phoneNum, memPwd: signForm.password, nickNm: signForm.nickName,
        birth: '', term1: 'y', term2: 'y', term3: 'y', term4: 'y', term5: 'y',
        profImg: '', profImgRacy: 3, nativeTid: nativeTid, os: context.customHeader.os
      }
    })
    if (result === 'success') {
      //Facebook,Firebase 이벤트 호출
      addAdsData();

      context.action.alert({
        callback: () => {
          //애드브릭스 이벤트 전달
          if (data.adbrixData != '' && data.adbrixData != 'init') {
            Hybrid('adbrixEvent', data.adbrixData)
          }
          loginFetch()
        },
        msg: '회원가입 기념으로 달 1개를 선물로 드립니다.\n달라 즐겁게 사용하세요.'
      })
    } else {
      context.action.alert({
        msg: message
      })
      context.action.updateLogin(false)
    }
  }

  //3. 로그인
  async function loginFetch() {
    const loginInfo = await Api.member_login({
      data: {
        memType: signForm.memType,
        memId: signForm.phoneNum,
        memPwd: signForm.password
      }
    })

    if (loginInfo.result === 'success') {
      const {memNo} = loginInfo.data

      context.action.updateToken(loginInfo.data)
      const profileInfo = await Api.profile({params: {memNo}})
      if (profileInfo.result === 'success') {
        if (isHybrid()) {
          if (webview && webview === 'new') {
            Hybrid('GetLoginTokenNewWin', loginInfo.data)
          } else {
            Hybrid('GetLoginToken', loginInfo.data)
          }
        }

        if (redirect) {
          const decodedUrl = decodeURIComponent(redirect)
          return (window.location.href = decodedUrl)
        }
        context.action.updateProfile(profileInfo.data)
        return history.push('/signup/recommendDj')
      }
    } else if (loginInfo.result === 'fail') {
      context.action.alert({
        title: '로그인 실패',
        msg: `${loginInfo.message}`
      })
    }
  }

  //2. 애드브릭스
  const addAdsData = async () => {
    const firebaseDataArray = [
      { type : "firebase", key : "CompleteRegistration", value : {} },
      { type : "adbrix", key : "CompleteRegistration", value : {} },
    ];
    kakaoPixel('114527450721661229').completeRegistration()
    Hybrid('eventTracking', {service :  firebaseDataArray})
  }


  return (
    <div id='signPage'>
      <Header type="back" />
      {step === 1 && <PhoneAuth signForm={signForm} onChange={onChange} setSignForm={setSignForm} setStep={setStep}/>}
      {step === 2 && <NickNameSetting signForm={signForm}  onChange={onChange} setSignForm={setSignForm} setStep={setStep}/>}
      {step === 3 && <PasswordSetting signForm={signForm} onChange={onChange} sighUp={signUp}/>}
    </div>
  )
}

export default SignUpPage