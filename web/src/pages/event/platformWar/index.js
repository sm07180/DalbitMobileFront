import React, {useEffect, useState, useContext} from 'react'
import {IMG_SERVER} from 'context/config'
import {useHistory} from "react-router-dom";
import Api from 'context/api'

import Header from 'components/ui/header/Header'

import './platformWar.scss'

const PlatformWar = () => {
  const history = useHistory();

  const golink = () => {
    history.push(`/profile/11599118330637`)
  }

  return (
    <div id="platformWar">
      <Header position={'sticky'} title={'이벤트'} type={'back'}/>
      <div className='content'>
        <div className='imageBox'>
          <img
          src={`${IMG_SERVER}/event/dalla/7677/eventPage-7677.png`}
          alt="플랫폼의 자존심을 건 일천만원 노래대전"
          className="img__full"
          />
          <div className='clickArea' onClick={() => {golink()}}></div>
        </div>
      </div>
    </div>
  )
}

export default PlatformWar