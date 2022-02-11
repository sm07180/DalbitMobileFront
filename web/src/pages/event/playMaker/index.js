import React from 'react'

import Header from 'components/ui/header/Header'

import './style.scss'

const PlayMaker = () =>{
  return(
    <div id="playMaker">
      <Header title={'이벤트'} type={'back'}/>
      <img src="https://image.dalbitlive.com/event/playMaker/main.png"/>
      <button className="applyBtn">
        <img src="https://image.dalbitlive.com/event/playMaker/applyBtn.png" alt="플레이메이커 지원하러 가기" />
      </button>
    </div>
  )
}

export default PlayMaker