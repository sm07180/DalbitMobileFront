import React, {useContext, useEffect, useState} from 'react'

import '../invite.scss'
import {Context} from "context";
import {OS_TYPE} from "context/config";

const SnsPromotion = () => {
  const context = useContext(Context)
  const code = location.pathname.split('/')[2]
  const [osCheck, setOsCheck] = useState(-1)
  useEffect(() => {
    setOsCheck(navigator.userAgent.match(/Android/i) != null ? 1 : navigator.userAgent.match(/iPhone|iPad|iPod/i) != null ? 2 : 3)
  }, [])


  const doCopy = code => {
    if (!document.queryCommandSupported("copy")) {
      return alert("복사하기가 지원되지 않는 브라우저입니다.");
    }
    const textarea = document.createElement("textarea");
    textarea.value = code;
    textarea.style.top = 0;
    textarea.style.left = 0;
    textarea.style.position = "fixed";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    context.action.alert({msg: `초대코드가 복사되었습니다.`});
  };

  const appDownload = () =>{
    if(osCheck === OS_TYPE['Android']){
      window.location.href = 'https://inforexseoul.page.link/Ws4t'
    }else if(osCheck === OS_TYPE['IOS'] ){
      var userAgent = navigator.userAgent
      var visitedAt = new Date().getTime()

      if (userAgent.match(/iPhone|iPad|iPod/)) {
        setTimeout(function () {
          if (new Date().getTime() - visitedAt < 2000) {
            location.href = 'https://itunes.apple.com/app/id1490208806'
          }
        }, 500)

        setTimeout(function () {
          location.href = 'https://inforexseoul.page.link/Ws4t'
        }, 0)
      }
    }else{

    }
  }


  return (
    <div id="snsPromotion">
        <div className='snsContent'>
            <div className='logo'>
                <img src="https://image.dalbitlive.com/common/logo/logo.png" alt="dalla 로고"/>
            </div>
            <div className='text'>
                <strong>초대 코드</strong>를 사용해 달라에 가입하고<br/>
                <strong>최대 100만원</strong> 받아가세요!
            </div>
            <div className='method'>
                <span>① 달라를 연다</span>
                <span>② 초대인의 초대코드를 입력한다</span>
                <span>③ 더 많은 혜택을 누린다!</span>
            </div>
            <button className={`copyBtn`}>
              <span className='codeText'>{code}</span>
              <span className='btnName' onClick={()=>doCopy(code)}>초대코드 복사하기</span>
            </button>
        </div>
        <button className='appDownload' onClick={appDownload}>
            <img src="https://image.dalbitlive.com/event/invite/appDownload.png" alt="앱 다운로드"/>
        </button>
    </div>
  )
}

export default SnsPromotion
