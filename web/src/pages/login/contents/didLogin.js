import React, {useMemo, useRef, useState} from 'react'

import Header from 'components/ui/header/Header'
import InputItems from '../../../components/ui/inputItems/InputItems'
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'
import PopSlide from 'components/ui/popSlide/PopSlide'
import LayerPopup from 'components/ui/layerPopup/LayerPopup'

import PopupPrivacy from '../components/PopupPrivacy'
import PopupTerms from '../components/PopupTerms'
import '../style.scss'
import Utility from "components/lib/utility";
import Api from "context/api";
import {Hybrid, isHybrid} from "context/hybrid";
import qs from 'query-string';
import {useDispatch, useSelector} from "react-redux";
import {setSlidePopupOpen} from "redux/actions/common";
import {
  setGlobalCtxAdminChecker,
  setGlobalCtxIsMailboxOn,
  setGlobalCtxMessage,
  setGlobalCtxMyInfo,
  setGlobalCtxUpdateProfile,
  setGlobalCtxUpdateToken
} from "redux/actions/globalCtx";

const DidLogin = (props) => {
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const {webview, redirect} = qs.parse(location.search)
  const [fetching, setFetching] = useState(false)
  const [btnActive, setBtnActive] = useState(false)
  const [popup, setPopup] = useState(false)
  const [popupVal, setPopupVal] = useState("")

  const [loginInfo, setLoginInfo] = useState({ phoneNum : '', password : '', })
  const inputPhoneRef = useRef()
  const inputPasswordRef = useRef()

  const commonPopup = useSelector(state => state.popup);
  const dispatch = useDispatch();

  const getSessionRedirectURL = useMemo(() => {
    try {
      const item = JSON.parse(sessionStorage.getItem('_loginRedirect__'));
      if(item) {
        sessionStorage.removeItem('_loginRedirect__');
        return item;
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  },[])

  //회원가입 팝업 클릭 처리
  const signPop = () => {
    dispatch(setSlidePopupOpen());
    setBtnActive(false)
  }

  //약관동의 체크유무
  const checkSelectAll = () => {
    const checkboxes = document.querySelectorAll('input[name="checkList"]');
    const checked = document.querySelectorAll('input[name="checkList"]:checked');
    const selectAll = document.querySelector('input[name="checkListAll"]');

    if (checkboxes.length === checked.length) {
      selectAll.checked = true;
      setBtnActive(true)
    } else {
      selectAll.checked = false;
      setBtnActive(false)
    }
  }

  //약관동의 전체선택
  const selectAll = (e) => {
    const checkboxes = document.querySelectorAll('input[name="checkList"]');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = e.target.checked
    })
    if (e.target.checked) {
      setBtnActive(true)
    } else {
      setBtnActive(false)
    }
  }

  //회원가입
  const signUp = () => {
    if(btnActive === true){
      props.history.push('/signup');
    }else{
      dispatch(setGlobalCtxMessage({type: "alert",msg: `이용약관과 개인정보 수집 및 이용에 대한 안내 모두 동의해주세요.`}))
    }
  };

  //로그인 버튼 클릭
  const loginClick = () => {
    if (fetching) return;

    if (loginInfo.phoneNum === '' && loginInfo.password === '') {
      dispatch(setGlobalCtxMessage({type: "alert",msg: `아이디(휴대폰 번호)와 비밀번호를\n 입력하고 다시 로그인 해주세요.`, callback: () => {inputPhoneRef.current.focus()}}))
    } else if (loginInfo.phoneNum === '' && loginInfo.password !== '') {
      dispatch(setGlobalCtxMessage({type: "alert",msg: `아이디(휴대폰 번호)를 입력하고\n 다시 로그인 해주세요.`, callback: () => {inputPasswordRef.current.focus()}}))
    } else if (loginInfo.password === '' && loginInfo.phoneNum !== '') {
      dispatch(setGlobalCtxMessage({type: "alert",msg: `비밀번호를 입력하고 다시 로그인 해주세요.`, callback: () => {inputPasswordRef.current.focus()}}))
    } else {
      fetchPhoneLogin(loginInfo.phoneNum, loginInfo.password).then()
    }
  }

  //로그인 시도
  const fetchPhoneLogin = async (phone, pw) => {
    setFetching(true)
    let sessionRoomNo = sessionStorage.getItem('room_no') || Utility.getCookie('listen_room_no') || ""

    const loginInfo = await Api.member_login({
      data: {
        memType: 'p',
        memId: phone,
        memPwd: pw,
        room_no: sessionRoomNo
      }
    })

    if (loginInfo.result === 'success') {
      const {memNo} = loginInfo.data

      let mypageURL = ''
      let walletURL = ''
      const _parse = qs.parse(location.search)
      if (_parse !== undefined && _parse.mypage_redirect === 'yes') {
        mypageURL = `/profile/${memNo}`
        if (_parse.mypage !== '/') mypageURL = `/profile/${memNo}${_parse.mypage}`
      }
      if(getSessionRedirectURL && getSessionRedirectURL.indexOf('/wallet')>-1){
        walletURL = '/wallet?exchange=1';
      }

      dispatch(setGlobalCtxUpdateToken(loginInfo.data))
      const profileInfo = await Api.profile({params: {memNo}})
      const myInfo = await Api.mypage()
      setTimeout(() => {
        fetchAdmin()
      }, 10)

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

        dispatch(setGlobalCtxUpdateProfile(profileInfo.data));// 타인/내정보 update
        dispatch(setGlobalCtxMyInfo(myInfo.data));// 내정보 update
        dispatch(setGlobalCtxIsMailboxOn(profileInfo.data.isMailboxOn));

        if (mypageURL !== '') {
          return (window.location.href = mypageURL)
        } else if (walletURL !== '') {  // 내지갑 > 환전 탭 으로 이동
          return (window.location.href = walletURL)
        }

        if (props.location.state) {
          return (window.location.href = `/${props.location.state.state}`)
        }
        return window.location.href = "/"
      }
    } else if (loginInfo.result === 'fail') {
      if (loginInfo.code === '-1') {
        dispatch(setGlobalCtxMessage({type: "alert",msg: `아이디(전화번호)와 비밀번호를\n 확인하고 다시 로그인해주세요.`}))
      } else if (loginInfo.code === '-3' || loginInfo.code === '-5') {
        let msg = loginInfo.data.opMsg
        if (msg === undefined || msg === null || msg === '') {
          msg = loginInfo.message
        }
        dispatch(setGlobalCtxMessage({type: "alert",title: '달라 사용 제한', msg: `${msg}`,
          callback: () => {
            if (webview && webview === 'new') {
              Hybrid('CloseLayerPopup')
            }
          }
        }))
      } else if (loginInfo.code === '-6') {
        dispatch(setGlobalCtxMessage({type: "confirm",msg: '이미 로그인 된 기기가 있습니다.\n방송 입장 시 기존기기의 연결이 종료됩니다.\n그래도 입장하시겠습니까?',
          callback: () => {
            const callResetListen = async (mem_no) => {
              const fetchResetListen = await Api.postResetListen({memNo: mem_no})
              if (fetchResetListen.result === 'success') {
                setTimeout(() => {
                  setFetching(false)
                  loginClick()
                }, 700)
              } else {
                dispatch(setGlobalCtxMessage({type: "alert",msg: `${fetchResetListen.message}`}))
                setFetching(false)
              }
            }
            callResetListen(loginInfo.data.memNo)
          }
        }))
      } else if(loginInfo.code === '-8') {
        return props.history.push({pathname: '/event/customer_clear', state: {memNo: loginInfo.data.memNo}});
      } else {
        dispatch(setGlobalCtxMessage({type: "alert",title: '로그인 실패', msg: `${loginInfo.message}`}))}
    }
    setFetching(false)
  }

  //어드민 계정 체크
  const fetchAdmin = async () => {
    const adminFunc = await Api.getAdmin()
    if (adminFunc.result === 'success') {
      dispatch(setGlobalCtxAdminChecker(true));
    } else if (adminFunc.result === 'fail') {
      dispatch(setGlobalCtxAdminChecker(false));
    }
  }

  const onChange = (e) => {
    const { value, name } = e.target;
    setLoginInfo({
      ...loginInfo,
      [name]: value
    });
  };

  const popupOpen = (val) => {
    setPopup(true);
    setPopupVal(val)
  }

  const onKeyPress = e =>{
    if(e.key ==='Enter' || e.key === 13){
      loginClick()
    }
  }

  return (
    <div id='loginPage'>
      <Header title="로그인" type="back"/>
      <section className="loginForm">
        <InputItems>
          <input ref={inputPhoneRef} type="number" pattern="\d*" placeholder="휴대폰 번호" name={"phoneNum"} value={loginInfo.phoneNum} autoFocus onChange={onChange}/>
        </InputItems>
        <InputItems>
          <input ref={inputPasswordRef} type="password" placeholder="비밀번호" name={"password"} value={loginInfo.password} onChange={onChange} onKeyPress={onKeyPress}/>
        </InputItems>
        <SubmitBtn text="로그인" onClick={loginClick}/>
        <div className="linkWrap">
          <div className="linkText" onClick={signPop}>회원가입</div>
          <div className="linkText" onClick={()=>props.history.push("/password")}>비밀번호 찾기</div>
        </div>
      </section>
      {commonPopup.slidePopup &&
      <PopSlide>
        <div className='title'>이용약관동의</div>
        <div className="agreeWrap">
          <div className="agreeListAll">
            <label className="inputLabel">
              <input type="checkbox" className="blind" name="checkListAll" onChange={selectAll}/>
              <span className="checkIcon"/>
              <p className="checkinfo">네, 모두 동의합니다.</p>
            </label>
          </div>
          <div className='agreeListWrap'>
            <div className="agreeList">
              <label className="inputLabel">
                <input type="checkbox" className="blind" name="checkList" onChange={checkSelectAll}/>
                <span className="checkIcon"/>
                <p className="checkinfo">(필수) 만 14세 이상입니다.</p>
              </label>
            </div>
            <div className="agreeList">
              <label className="inputLabel">
                <input type="checkbox" className="blind" name="checkList" onChange={checkSelectAll}/>
                <span className="checkIcon"/>
                <p className="checkinfo">(필수) 이용약관</p>
                <button className='policyBtn' onClick={() => popupOpen("terms")}>보기</button>
              </label>
            </div>
            <div className="agreeList">
              <label className="inputLabel">
                <input type="checkbox" className="blind" name="checkList" onChange={checkSelectAll}/>
                <span className="checkIcon"/>
                <p className="checkinfo">(필수) 개인정보 취급 방침</p>
                <button className='policyBtn' onClick={() => popupOpen("privacy")}>보기</button>
              </label>
            </div>
          </div>
        </div>
        <SubmitBtn text="다음" state={!btnActive && 'disabled'} onClick={signUp}/>
      </PopSlide>
      }
      {
        popup &&
        <LayerPopup setPopup={setPopup}>
          <div className='popTitle'>{popupVal === "terms" ? "이용약관" : "개인정보 취급 방침"}</div>
          <div className='popContent'>
            {popupVal=== "terms" ?
              <PopupTerms/>
              :
              <PopupPrivacy/>
            }
          </div>
        </LayerPopup>
      }
    </div>
  )
}

export default DidLogin
