import React, {useEffect, useState, useContext} from 'react'

import {Context} from 'context'
import Api from "context/api";
import GenderItems from 'components/ui/genderItems/GenderItems'
import '../invite.scss'


const InviteEvent = () => {  
  const context = useContext(Context)
  const {token, profile} = context

  const [createdCode, setCreatedCode] = useState(false)
  const [code, setCode] = useState("")
  const [codeMatch, setCodeMatch] = useState(false)
  const [submitCode, setSubmitCode] = useState(false)

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
    if(value === code){
      setCodeMatch(true)
    } else {
      setCodeMatch(false)
    }
  };

  useEffect(()=>{
    //초대코드 유무 체크
    Api.inviteMy({
      reqBody: true,
      data:{
        "memNo": context.token.memNo,
      }
    }).then((response)=>{
      console.log(response);
      if(response.code === "0"){
        setCreatedCode(false);
      }else{
        setCreatedCode(true);
        setCode(response.data.invitation_code);
      }
    });
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
    const codeLength = 6
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codeText= '';
    const charactersLength = characters.length;
    for ( let i = 0; i < codeLength; i++ ) {
      codeText += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    // registerCode(codeText)
  }

  const codeSubmit = () => {
    setSubmitCode(true)
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
            <button className={`inviteBtn share`}>
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
                <input
                  type="text"
                  name={"code"}
                  onChange={onChange}
                  maxLength={6}
                  autoComplete="off"
                />
              </div>
              <button type="button" className={`inputBtn ${codeMatch ? "" : "disable"}`} onClick={codeSubmit}>확인</button>
            </div>
          </div>
        :
          <div className='imageBox'>
            <img src="https://image.dalbitlive.com/event/invite/eventPage_event-friend.png" alt="나를 초대한 친구" className='fullImage'/>
            <div className='friendWrap'>
              <div className="photo">
                <img src={`${profile.profImg.thumb150x150 ? profile.profImg.thumb150x150 : "https://image.dalbitlive.com/images/listNone-userProfile.png"}`} alt="프로필이미지" />
              </div>
              <div className='listContent'>
                <div className='listItem'>
                  <GenderItems data={profile.gender}/>
                  <span className='nickNm'>{profile.nickNm}</span>
                </div>
                <div className='listItem'>
                  <span className='memId'>{profile.memId}</span>
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
