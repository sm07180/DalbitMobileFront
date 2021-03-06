import React, {useEffect, useState, useContext, useRef} from 'react'
import Api from "context/api";
import GenderItems from 'components/ui/genderItems/GenderItems'
import '../invite.scss'
import {useHistory} from "react-router-dom";
import {Hybrid, isHybrid} from "context/hybrid";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

const InviteEvent = () => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const history = useHistory();

  const [code, setCode] = useState("")                    //나의 초대코드
  const [createdCode, setCreatedCode] = useState(false)   //초대코드 생성 여부
  const [codeMatch, setCodeMatch] = useState(false)       //친구초대 코드 유효성검사 (6자)
  const [submitCode, setSubmitCode] = useState(false);    //친구초대 코드 입력 여부
  const friendCode = useRef();
  const [myInfo, setMyInfo] = useState();

  const onFocus = (e) => {
    const targetClassName = e.target.parentNode;
    targetClassName.classList.add('focus');
  }
  const onBlur = (e) => {
    const targetClassName = e.target.parentNode;
    targetClassName.classList.remove('focus');
  }
  const onChange = (e) => {
    const value = e.target.value;
    if(value.length === 6){
      setCodeMatch(true)
    } else {
      setCodeMatch(false)
    }
  };

  useEffect(()=>{
    //초대코드 유무 체크
    if (globalState.token.isLogin) {
      Api.inviteMy({
        reqBody: true,
        data: {"memNo": globalState.token.memNo}
      }).then((response) => {
        setMyInfo(response.data);
        //초대코드 생성 유무
        if (response.data.invitation_code !== "") {
          setCreatedCode(true);
          setCode(response.data.invitation_code);
        } else {
          setCreatedCode(false);
        }
        //친구초대코드 등록 유무
        if (response.data.send_mem_no !== "0") {
          setSubmitCode(true);
        }
      });
    }
  },[submitCode]);

  const registerCode = (code) => {
    selfAuthCheck().then((res) => {
      if (res.result === 'success') {
        Api.inviteRegister({
          reqBody: true,
          data:{
            "memNo": globalState.token.memNo,
            "invitationCode": code,
            "memPhone": res.phoneNo
          }
        }).then((response)=>{
          console.log(response);
          if(response.code === "0000"){
            setCode(code);
            setCreatedCode(true);
          }else{
            dispatch(setGlobalCtxMessage({type: "alert",msg: "초대코드 발급에 실패했습니다. \n 잠시후 다시 시도해주세요."}));
          }
        })
      }
    })
  }

  const createCode = () => {
    if (globalState.token.isLogin) {
      const codeLength = 5
      const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456788';
      let codeText= '';
      const charactersLength = characters.length;
      for ( let i = -1; i < codeLength; i++ ) {
        codeText += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      registerCode(codeText)
    }else{
      history.push('/login')
    }
  }

  const registerFriendCode = () => {
    if (globalState.token.isLogin) {
      selfAuthCheck().then((res) => {
        if (res.result === 'success') {
          Api.inviteReward({
            reqBody: true,
            data: {
              "rcvMemNo": globalState.token.memNo,
              "invitationCode": friendCode.current.value,
              "memPhone": res.phoneNo
            }
          }).then((response) => {
            if (response.code === "0000") {
              dispatch(setGlobalCtxMessage({type: "alert",msg: "초대코드 등록이 완료되었습니다.\n 친구를 추가 초대하여 달라 초대왕이 되어보세요 "}));
              setSubmitCode(true);
            } else if (response.code === "C001") {
              dispatch(setGlobalCtxMessage({type: "alert",msg: "유효하지 않는 초대코드 입니다. \n 확인 후 다시 입력해 주세요"}));
            } else if (response.code === "C003") {
              dispatch(setGlobalCtxMessage({type: "alert",msg: "이미 초대코드를 등록 했습니다."}));
            } else if (response.code === "C005") {
              dispatch(setGlobalCtxMessage({type: "alert",msg: "가입 내역이 있습니다."}));
            } else if (response.code === "C006"){
              dispatch(setGlobalCtxMessage({type: "alert",msg: "이벤트 참여 대상자가 \n아닙니다."}));
            } else {
              dispatch(setGlobalCtxMessage({type: "alert",msg: response.msg}));
            }
          })
        }
      })
    }else{
      history.push('/login')
    }
  }

  //본인인증
  const  selfAuthCheck = async () =>{
    const {result, data} = await Api.self_auth_check();
      if(result === 'success'){
        return {result : result, phoneNo : data.phoneNo};
      }else{
        history.push(`/selfauth?event=/event`)
      }
  }

  const doCopy = code => {
    if(isHybrid()){
      Hybrid("sendShareUrl", {
        shareLink: `https://${location.host}/invite/${code}`,
        title: "dalla 달라 | 초대코드"
      })
    }else {
      if (!document.queryCommandSupported("copy")) {
        return alert("복사하기가 지원되지 않는 브라우저입니다.");
      }
      const textarea = document.createElement("textarea");
      textarea.value = `https://${location.host}/invite/${code}`;
      textarea.style.top = 0;
      textarea.style.left = 0;
      textarea.style.position = "fixed";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      dispatch(setGlobalCtxMessage({type: "alert",msg: `초대코드가 복사되었습니다.`}));
    }
  };

  const goSendProfile = () =>{
    if(myInfo.sendExitYn === "n"){
      history.push(`/profile/${myInfo.send_mem_no}`)
    }else{
      dispatch(setGlobalCtxMessage({type: "alert",msg: `탈퇴한 회원입니다.`}));
    }
  }


  return (
    <div className='inviteEvent'>
      <div className='imageBox'>
        <img src="https://image.dalbitlive.com/event/invite/eventPage_event-benefit.png" alt="친구가 달라 신규가입 시 혜택" className='fullImage'/>
      </div>
      <div className='imageBox'>
        <img src="https://image.dalbitlive.com/event/invite/eventPage_event-method.png" alt="참여방법 안내" className='fullImage'/>
        {
          createdCode ?
            <button className={`inviteBtn share`} onClick={()=>doCopy(code)}>
              <span className='codeText'>{code}</span>
              <span className='btnName'>초대코드 공유하기</span>
            </button>
          :
            <button className={`inviteBtn create`} onClick={createCode}>
              <span className='btnName'>초대코드 생성하기</span>
            </button>
        }
      </div>
      {
        !submitCode ?
          <div className='imageBox'>
            <img src="https://image.dalbitlive.com/event/invite/eventPage_event-code.png" alt="친구 초대 코드 입력하면 10달이 내 지갑에 쏙!" className='fullImage'/>
            <div className='codeInput'>
              <div className="inputBox" onFocus={onFocus} onBlur={onBlur}>
                <input type="text" name={"code"} ref={friendCode} onChange={onChange} maxLength={6} autoComplete="off"/>
              </div>
              <button type="button" className={`inputBtn ${codeMatch ? "" : "disable"}`} onClick={registerFriendCode}>확인</button>
            </div>
          </div>
        :
          <div className='imageBox'>
            <img src="https://image.dalbitlive.com/event/invite/eventPage_event-friend.png" alt="나를 초대한 친구" className='fullImage'/>
            <div className='friendWrap' onClick={goSendProfile}>
              <div className="photo">
                <img src={myInfo.profImg.thumb292x292} alt="프로필이미지" />
              </div>
              <div className='listContent'>
                <div className='listItem'>
                  <GenderItems data={myInfo.send_mem_sex}/>
                  <span className='nickNm'>{myInfo.send_mem_nick}</span>
                </div>
                <div className='listItem'>
                  <span className='memId'>{myInfo.send_mem_id}</span>
                </div>
              </div>
            </div>
          </div>
      }
      <div className='imageBox'>
        <img src="https://image.dalbitlive.com/event/invite/eventPage_event-notice.png" alt="유의사항" className='fullImage'/>
      </div>
    </div>
  )
}

export default InviteEvent
