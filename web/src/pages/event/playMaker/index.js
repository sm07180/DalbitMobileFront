import React from 'react'
import {useDispatch, useSelector} from "react-redux";

import Header from 'components/ui/header/Header'

import './style.scss'

import {Hybrid} from 'context/hybrid'

const PlayMaker = () =>{
  const isDesktop = useSelector((state)=> state.common.isDesktop)
    
  const form = () =>{
    if(isDesktop){
      window.open('https://docs.google.com/forms/d/e/1FAIpQLSecaCjYX_wmMEcikiB49WuHLIWCcmdHUjhyQ4AiF0_MI5ZDXA/viewform')
    }else{
      Hybrid('openUrl', `https://docs.google.com/forms/d/e/1FAIpQLSecaCjYX_wmMEcikiB49WuHLIWCcmdHUjhyQ4AiF0_MI5ZDXA/viewform`)
    }
  }

  return(
    <div id="playMaker">
      <Header title={'이벤트'} type={'back'}/>
      <img src="https://image.dalbitlive.com/event/playMaker/main.png"/>
      <span  className="applyBtn" onClick={()=>{form()}}>
        <img src="https://image.dalbitlive.com/event/playMaker/applyBtn.png" alt="플레이메이커 지원하러 가기" />
      </span>
    </div>
  )
}

export default PlayMaker