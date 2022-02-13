import React, {useContext, useRef, useState} from 'react'

import Header from 'components/ui/header/Header'
import InputItems from 'components/ui/inputItems/inputItems'
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'
import PopSlide from 'components/ui/popSlide/PopSlide'
import {Context} from 'context'
import '../style.scss'
import Utility from "components/lib/utility";
import Api from "context/api";
import {Hybrid, isHybrid} from "context/hybrid";
import qs from 'query-string';

const DidLogin = (props) => {
  const globalCtx = useContext(Context)
  const {webview, redirect} = qs.parse(location.search)
  const [fetching, setFetching] = useState(false)
  const [btnActive, setBtnActive] = useState(false)
  const [slidePop, setSlidePop] = useState(false)
  const [loginInfo, setLoginInfo] = useState({ phoneNum : '', password : '', })
  const inputPhoneRef = useRef()
  const inputPasswordRef = useRef()

  //회원가입 팝업 클릭 처리
  const signPop = () => {
    setSlidePop(true)
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
      globalCtx.action.alert({msg: `이용약관과 개인정보 수집 및 이용에 대한 안내 모두 동의해주세요.`})
    }
  };

  //로그인 버튼 클릭
  const loginClick = () => {
    if (fetching) return;

    if (loginInfo.phoneNum === '' && loginInfo.password === '') {
      globalCtx.action.alert({msg: `아이디(핸드폰 번호)와 비밀번호를 입력하고 다시 로그인해주세요.`, callback: () => {inputPhoneRef.current.focus()}})
    } else if (loginInfo.phoneNum === '' && loginInfo.password !== '') {
      globalCtx.action.alert({msg: `아이디(핸드폰 번호)를 입력하고 다시 로그인해주세요.`, callback: () => {inputPasswordRef.current.focus()}})
    } else if (loginInfo.password === '' && loginInfo.phoneNum !== '') {
      globalCtx.action.alert({msg: `비밀번호를 입력하고 다시 로그인해주세요.`, callback: () => {inputPasswordRef.current.focus()}})
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
    console.log(loginInfo);

    if (loginInfo.result === 'success') {
      const {memNo} = loginInfo.data

      let mypageURL = ''
      const _parse = qs.parse(location.search)
      if (_parse !== undefined && _parse.mypage_redirect === 'yes') {
        mypageURL = `/mypage/${memNo}`
        if (_parse.mypage !== '/') mypageURL = `/mypage/${memNo}${_parse.mypage}`
      }

      globalCtx.action.updateToken(loginInfo.data)
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

        globalCtx.action.updateProfile(profileInfo.data) // 타인/내정보 update
        globalCtx.action.updateMyInfo(myInfo.data) // 내정보 update
        globalCtx.action.updateIsMailboxOn(profileInfo.data.isMailboxOn)

        if (mypageURL !== '') {
          return (window.location.href = mypageURL)
        }

        if (props.location.state) {
          return (window.location.href = `/${props.location.state.state}`)
        }
        return props.history.push('/')
      }
    } else if (loginInfo.result === 'fail') {
      if (loginInfo.code === '-1') {
        globalCtx.action.alert({msg: `아이디(전화번호)와 비밀번호를 확인하고 다시 로그인해주세요.`})
      } else if (loginInfo.code === '-3' || loginInfo.code === '-5') {
        let msg = loginInfo.data.opMsg
        if (msg === undefined || msg === null || msg === '') {
          msg = loginInfo.message
        }
        globalCtx.action.alert({title: '달빛라이브 사용 제한', msg: `${msg}`,
          callback: () => {
            if (webview && webview === 'new') {
              Hybrid('CloseLayerPopUp')
            }
          }
        })
      } else if (loginInfo.code === '-6') {
        globalCtx.action.confirm({msg: '이미 로그인 된 기기가 있습니다.\n방송 입장 시 기존기기의 연결이 종료됩니다.\n그래도 입장하시겠습니까?',
          callback: () => {
            const callResetListen = async (mem_no) => {
              const fetchResetListen = await Api.postResetListen({memNo: mem_no})
              if (fetchResetListen.result === 'success') {
                setTimeout(() => {
                  setFetching(false)
                  loginClick()
                }, 700)
              } else {
                globalCtx.action.alert({msg: `${fetchResetListen.message}`})
                setFetching(false)
              }
            }
            callResetListen(loginInfo.data.memNo)
          }
        })
      } else {
        globalCtx.action.alert({title: '로그인 실패', msg: `${loginInfo.message}`})}
    }
    setFetching(false)
  }

  //어드민 계정 체크
  const fetchAdmin = async () => {
    const adminFunc = await Api.getAdmin()
    if (adminFunc.result === 'success') {
      globalCtx.action.updateAdminChecker(true)
    } else if (adminFunc.result === 'fail') {
      globalCtx.action.updateAdminChecker(false)
    }
  }

  const onChange = (e) => {
    const { value, name } = e.target;
    setLoginInfo({
      ...loginInfo,
      [name]: value
    });
  };

  return (
    <div id='loginPage'>
      <Header title="로그인" type="back"/>
      <section className="loginForm">
        <InputItems>
          <input ref={inputPhoneRef} type="number" placeholder="핸드폰 번호" name={"phoneNum"} value={loginInfo.phoneNum} onChange={onChange}/>
        </InputItems>
        <InputItems>
          <input ref={inputPasswordRef} type="password" placeholder="비밀번호" name={"password"} value={loginInfo.password} onChange={onChange}/>
        </InputItems>
        <SubmitBtn text="로그인" onClick={loginClick}/>
        <div className="linkWrap">
          <div className="linkText" onClick={signPop}>회원가입</div>
          <div className="linkText">비밀번호 찾기</div>
        </div>
      </section>
      {slidePop &&
      <PopSlide setPopSlide={setSlidePop}>
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
                <button className='policyBtn'>보기</button>
              </label>
            </div>
            <div className="agreeList">
              <label className="inputLabel">
                <input type="checkbox" className="blind" name="checkList" onChange={checkSelectAll}/>
                <span className="checkIcon"/>
                <p className="checkinfo">(필수) 개인정보 취급 방침</p>
                <button className='policyBtn'>보기</button>
              </label>
            </div>
          </div>
        </div>
        <SubmitBtn text="다음" state={!btnActive && 'disabled'} onClick={signUp}/>
      </PopSlide>
      }
    </div>
  )
}

export default DidLogin