import React from 'react'

import Header from 'components/ui/header/Header'

import EventComment from '../components/comment'

import './acrostic.scss'

const Acrostic =()=>{
  return(
    <div id="acrosticEvent">
      <Header title={'달라를 소개해 달라!'} type={'back'}/>
      <div className="content">
        <img src="https://image.dalbitlive.com/event/acrostic/main.png" alt="달라를 축하해 달라" />
        <button className="noticeBtn">유의사항</button>
        <EventComment 
          contPlaceHolder={'내용을 입력해주세요.'}
          commentAdd={''}
        />
      </div>
    </div>
  )
}

export default Acrostic