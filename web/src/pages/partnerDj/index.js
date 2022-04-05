import React, {useEffect, useState, useCallback, useContext} from 'react'
import {useHistory} from 'react-router-dom'

import Header from 'components/ui/header/Header'

import './style.scss'
import {Context} from "context";

const PartnerDj = () => {
  let history = useHistory()
  const context = useContext(Context)  

  // 페이지 시작
  return (
   <div id='partnerDj'>
    <Header position={'sticky'} title="파트너 DJ" type={'back'}/>
    <div className='content'>
      <section>
        <div className='top'>
          <div className='offical'>dalla offical</div>
          <div className='mainTitle'>Partner DJ</div>
        </div>
        <div className='textWrap'>
          <p>파트너DJ는 자신만의 콘텐츠를 바탕으로 달라와 DJ,<br/>서로의 성장을 위해 플랫폼 리더십을 공유하는 제도입니다.</p>
          <p>달라는 나만의 콘텐츠와 달라에 대한 애정으로<br/>새로운 가능성을 보여줄 파트너DJ를 기다리고 있습니다!</p>
        </div>
      </section>
      <section>
        <div className='top'>
          <div className='contractTitle'>파트너DJ 계약</div>
        </div>
        <div className='textWrap'>
          <p>방송 퀄리티/컨텐츠 등 DJ의 독창성과 스타성, 미래성을 평가하고<br/>선발하여 개별 협의를 통해 계약을 진행합니다.</p>
        </div>
        <div className='stepWrap'>
          <div className='step'>달라와 DJ간의 개별 협의</div>
          <div className='step'>파트너십 계약</div>
        </div>
      </section>
    </div>
   </div>
  )
}

export default PartnerDj
