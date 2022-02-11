import React from 'react'

import Header from 'components/ui/header/Header'

import './style.scss'

const PlayMaker = () =>{
  return(
    <div id="playMaker">
      <Header title={'이벤트'} type={'back'}/>
      <img src="https://image.dalbitlive.com/event/playMaker/main.png"/>
      <a className="applyBtn" href="https://docs.google.com/forms/d/e/1FAIpQLSecaCjYX_wmMEcikiB49WuHLIWCcmdHUjhyQ4AiF0_MI5ZDXA/viewform">
        <img src="https://image.dalbitlive.com/event/playMaker/applyBtn.png" alt="플레이메이커 지원하러 가기" />
      </a>
    </div>
  )
}

export default PlayMaker