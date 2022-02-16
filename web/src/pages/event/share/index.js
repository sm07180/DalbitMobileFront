import React, {useEffect, useState, useRef} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import Api from 'context/api'

import Header from 'components/ui/header/Header'
import './share.scss'

const Share = () => {

  return (
    <div id="share">        
        <Header position={'sticky'} title={'이벤트'} type={'back'}/>
        <div className='content'>
            <div className='imageBox'>
                <img src='https://image.dalbitlive.com/event/dalla/7650/event_MainImg.png' alt="달라를 소개해달라" className='fullImage'/>
                <button className='noticeBtn'>유의사항</button>
            </div>
            <div className='step'>
                <div className='stepTop'>
                    <span className='stepBox'>STEP1</span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Share
