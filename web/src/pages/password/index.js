import React, {useState, useEffect, useMemo, useContext, useRef} from 'react'
import {useLocation} from 'react-router-dom';

//components
import Header from 'components/ui/header/Header'
import InputItems from 'components/ui/inputItems/inputItems'
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'
import Api from 'context/api'
import './style.scss'
import {Context} from "context";


const PasswordChange = (props) => {
  const {backEvent} = props;
  const location = useLocation();
  const context = useContext(Context)
  const {token, profile} = context;

  //폰번호
  const [phoneNumVal, setPhoneNumVal] = useState("")
  //인증번호
  const [pinNumVal, setPinNumVal] = useState("")

  //비밀번호 수정불가 상태 (인증 후 사용 가능)
  const [validInfo, setValidInfo] = useState({
    phoneAuthReqBlock: false, // 인증요청 클릭 가능여부
    phoneAuthConfirmBlock: true, //확인 여부클릭 가능여부
    authDone: false, //휴대폰 인증여부
  });
  
  //요청후 5분 체크
  const authReqBlockTimerRef = useRef({intervalId: null, time:0});
  const [remainTime, setRemainTime] = useState(null);

  //비밀번호
  const [passwordVal, setPasswordVal] = useState("")
  //비밀번호 확인
  const [checkingVal, setCheckingVal] = useState("")

  //휴대폰번호 인증요청 ID
  const [CMID, setCMID] = useState(null);

  //휴대폰번호 변경시
  const phoneNumChange = (e) => {

    setPhoneNumVal(e.target.value);
    setValidInfo({...validInfo, authDone: false});
  }

  //인증번호 변경
  const pinNumChange = (e) => {
    console.log('pinNum')
    setPinNumVal(e.target.value);
  }

  const passwordChange = (e) => {
    console.log('pass')
    setPasswordVal(e.target.value);
  }

  const checkingChange = (e) => {
    console.log('chk')
    setCheckingVal(e.target.value);
  }

  // 휴대폰 번호 인증요청
  const fetchSmsReq = async () => {
    const {result, data, message} = await Api.sms_request({
      data: {
        phoneNo: phoneNumVal,
        authType: 1
      }
    });

    context.action.alert({
      msg: message
    });

    if (result === 'success') {
      setCMID(data?.CMID);
      setValidInfo({...validInfo, phoneAuthReqBlock: true, phoneAuthConfirmBlock:false});  //5분동안 요청 불가!
      authReqBlockTimerRef.current.time = 10; //5분
      const minute = Math.floor(authReqBlockTimerRef.current.time/60);
      const second = Math.floor(authReqBlockTimerRef.current.time%60);
      setRemainTime(`${minute<10? '0' + minute: minute}:${ second< 10? '0' + second : second}`);

      //5분 동안 세기 (재요청 가능)
      authReqBlockTimerRef.current.intervalId = setInterval(() => {
        authReqBlockTimerRef.current.time --;
        const minute = Math.floor(authReqBlockTimerRef.current.time/60);
        const second = Math.floor(authReqBlockTimerRef.current.time%60);
        setRemainTime(`${minute<10? '0' + minute: minute}:${ second< 10? '0' + second : second}`);
        if (authReqBlockTimerRef.current.time <= 0) { //인증요청, 확인 가능
          setValidInfo((prevState) => {
            return {...prevState, phoneAuthReqBlock: false, phoneAuthConfirmBlock: true };
          });

          clearInterval(authReqBlockTimerRef.current?.intervalId);
        }
      }, 1000);
    } else {
    }
  }

  // 휴대폰 번호 인증확인
  const fetchSmsCheck = async () => {
    const {result, data, message} = await Api.sms_check({
      data: {CMID, code: Number(pinNumVal)}
    })

    if (result === 'success') {
      context.action.alert({
        msg: message
      });
      clearInterval(authReqBlockTimerRef.current.intervalId);
      //비밀번호 입력 가능
      setValidInfo({... validInfo, authDone: true, phoneAuthReqBlock: false, phoneAuthConfirmBlock: true});
    } else {
      context.action.toast({
        msg: message
      });
    }
  }

  const validatePwd = () => {
    const num = passwordVal.search(/[0-9]/g)
    const eng = passwordVal.search(/[a-zA-Z]/gi)
    const spe = passwordVal.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi)
    if (passwordVal.length < 8 || passwordVal.length > 20) {
      return {bool:false, text:'비밀번호는 8~20자 이내로 입력해주세요'};
    }
    if ((num < 0 && eng < 0) || (eng < 0 && spe < 0) || (spe < 0 && num < 0)) {
      return {bool: false, text: '비밀번호는 영문/숫자/특수문자 중 2가지 이상 조합으로 입력해주세요.'};
    }
    //비밀번호 동일 체크
    if(passwordVal === checkingVal){
      return {bool:true, text:''};
    }

    return {bool:false, text:'비밀번호를 다시 확인해주세요.'};
  }

  const apiBlock = useRef(false);
  //비밀번호 변경
  async function passwordFetch() {
    if(!validInfo?.authDone){ //휴대폰 인증
      context.action.toast({msg:'휴대폰 인증을 먼저 해주세요.'});
      return;
    }
    const {bool, text} = validatePwd(); //비밀번호 패턴 체크
    if(!bool) {
      context.action.toast({msg: text});
      return;
    }

    if(!apiBlock.current) {
      apiBlock.current = true;
      const res = await Api.password_modify({
        data: {
          memId: phoneNumVal,
          memPwd: passwordVal
        }
      })

      if (res.result === 'success') {
        context.action.alert({
          callback: () => {
            backEvent();
          },
          msg: '비밀번호 변경(을) 성공하였습니다.'
        })
      } else {
        context.action.alert({
          msg: res.message
        })
      }
      apiBlock.current = false;
    }
  }

  //페이지로 사용한다면 Header 의 뒤로가기 클릭시  history.goBack(),
  //그 외(하위컴포넌트)로 사용한다면 props.goBackCallback 을 직접 지정해줘야함 (현재 컴포넌트를 toggle로 노출)
  const HeaderBackEvent = useMemo(() => {
    return location.pathname.indexOf('/password') > -1 ? null : backEvent;
  }, [location, backEvent]);

  useEffect(() => {
    if(authReqBlockTimerRef.current?.intervalId){
      clearInterval(authReqBlockTimerRef.current?.intervalId);
    }
  },[]);

  return (
    <div id='passwordSetting'>
      <Header position={'sticky'} title={'비밀번호 변경'} type={'back'} backClickEvent={HeaderBackEvent}/>
      <div className='content'>
        <form>
          <div className='sectionWrap'>
            <div className='section'>
              <InputItems button="인증요청" title={"휴대폰 번호"}
                          btnClass={!validInfo.phoneAuthReqBlock && !validInfo?.authDone ? 'active':''}
                          onClick={() => !validInfo.phoneAuthReqBlock && !validInfo?.authDone && fetchSmsReq()}>
                <input
                  type="tel"
                  id="memId"
                  name="memId"
                  placeholder="번호를 입력해주세요."
                  maxLength={11}
                  autoComplete="new-password"
                  defaultValue={""}
                  onChange={phoneNumChange}
                  disabled={validInfo.phoneAuthReqBlock || validInfo?.authDone}
                />
              </InputItems>
            </div>
            <div className='section'>
              <InputItems button="확인" title={"인증번호"}
                          btnClass={!validInfo.phoneAuthConfirmBlock ? 'active':''}
                          onClick={() => !validInfo.phoneAuthConfirmBlock && fetchSmsCheck()}>
                <input
                  type="number"
                  id="pinNum"
                  name="pinNum"
                  placeholder="인증번호를 입력해주세요."
                  maxLength={6}
                  autoComplete="new-password"
                  defaultValue={""}
                  disabled={validInfo?.authDone}
                  onChange={pinNumChange}
                />
                {validInfo?.phoneAuthReqBlock && <div>{`${remainTime}`}</div>}
              </InputItems>
            </div>
            <div className='section'>
              <InputItems title={"비밀번호"}>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="8~20자 영문/숫자/특수문자 중 2가지 이상 조합"
                  maxLength={20}
                  autoComplete="new-password"
                  defaultValue={""}
                  onChange={passwordChange}
                />
              </InputItems>
            </div>
            <div className='section'>
              <InputItems title={"비밀번호 확인"}>
                <input
                  type="password"
                  id="passwordCheck"
                  name="passwordCheck"
                  placeholder="비밀번호를 한번 더 입력해주세요."
                  maxLength={20}
                  autoComplete="new-password"
                  defaultValue={""}
                  onChange={checkingChange}
                />
              </InputItems>
            </div>
          </div>

          <SubmitBtn state={validInfo?.authDone && validatePwd()?.bool ? '' :'disabled'} text="변경하기"
                     onClick={passwordFetch}/>
        </form>
      </div>
    </div>    
  )
}

export default PasswordChange

PasswordChange.defaultProps = {
  backEvent: null // <Header/>에 뒤로가기 버튼 클릭 이벤트 전달용 props
}