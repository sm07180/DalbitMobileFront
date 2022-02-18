import React, {useEffect, useState, useContext, useRef} from 'react'

import {Context} from 'context'
import Api from "context/api";
import GenderItems from 'components/ui/genderItems/GenderItems'
import '../invite.scss'
import {useHistory} from "react-router-dom";
import {IMG_SERVER} from 'context/config'
import {Hybrid, isHybrid} from "context/hybrid";

const InviteEvent = () => {  
  const context = useContext(Context)
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
    if (context.token.isLogin) {
      Api.inviteMy({
        reqBody: true,
        data: {"memNo": context.token.memNo}
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
  },[]);

  const registerCode = (code) => {
    Api.inviteRegister({
      reqBody: true,
      data:{
        "memNo": context.token.memNo,
        "invitationCode": code
      }
    }).then((response)=>{
        console.log(response);
        if(response.code === "0000"){
          setCode(code);
          setCreatedCode(true);
        }else{
          createCode();
        }
    })
  }

  const createCode = () => {
    if (context.token.isLogin) {
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
    if (context.token.isLogin) {
      selfAuthCheck().then((res) => {
        if (res.result === 'success') {
          Api.inviteReward({
            reqBody: true,
            data: {
              "rcvMemNo": context.token.memNo,
              "invitationCode": friendCode.current.value,
              "memPhone": res.phoneNo
            }
          }).then((response) => {
            if (response.code === "0000") {
              context.action.alert({msg: "초대코드 등록이 완료되었습니다.\n 친구를 추가 초대하여 달라 초대왕이 되어보세요 "});
              history.push("/event/invite")
            } else if (response.code === "C001") {
              context.action.alert({msg: "유효하지 않는 초대코드 입니다. \n 확인 후 다시 입력해 주세요"});
            } else if (response.code === "C003") {
              context.action.alert({msg: "이미 초대코드를 등록 했습니다."});
            } else if (response.code === "C005") {
              context.action.alert({msg: "16세 이하 및 55세 이상은 \n이벤트 참여가 불가능합니다."});
            } else {
              context.action.alert({msg: response.message});
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
      context.action.alert({msg: `초대코드가 복사되었습니다.`});
    }
  };


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
            <div className='friendWrap' onClick={() => history.push(`/profile/${myInfo.mem_no}`)}>
              <div className="photo">
                <img src={myInfo.profImg.thumb88x88} alt="프로필이미지" />
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
