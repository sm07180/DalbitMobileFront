import React, {useEffect, useState, useContext} from 'react'
import {IMG_SERVER} from 'context/config'
import Api from 'context/api'

import Header from 'components/ui/header/Header'

import './platformWar.scss'

const PlatformWar = () => {

  return (
    <div id="platformWar">
      <Header position={'sticky'} title={'달라 VS 하쿠나 VS 스푼'} type={'back'}/>
      <div className='content'>
          <img
          src={`${IMG_SERVER}/event/platformWar/platformWarEventPage.png`}
          alt="플랫폼의 자존심을 건 일천만원 노래대전"
          className="img__full"
          />
      </div>
    </div>
  )
}

export default PlatformWar