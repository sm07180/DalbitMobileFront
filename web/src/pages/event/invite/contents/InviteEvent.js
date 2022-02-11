import React, {useEffect, useState} from 'react'

import '../invite.scss'

const InviteEvent = () => {  
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

  const createCode = () => {
    const codeLength = 6
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let codeText= '';
    const charactersLength = characters.length;
    for ( let i = 0; i < codeLength; i++ ) {
      codeText += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    setCode(codeText)
  }

  const codeSubmit = () => {
    setSubmitCode(true)
  }

  useEffect(() => {
    if(code !== ""){
      setCreatedCode(true);
    }
  }, [code])

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
            <div className='codeInput'>
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
