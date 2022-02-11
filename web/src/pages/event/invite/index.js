import React, {useEffect, useState, useContext} from 'react'
import Api from 'context/api'

import Header from 'components/ui/header/Header'

import InviteEvent from './contents/InviteEvent'
import InviteRank from './contents/InviteRank'
import InviteMydata from './contents/InviteMydata'

import './invite.scss'

const Invite = () => { 
  const [tabData, setTabData] = useState([
    {
      dufaultSrc : "https://image.dalbitlive.com/event/invite/tab01.png",
      activeSrc : "https://image.dalbitlive.com/event/invite/tabActive01.png",
      alt : "초대 이벤트",
      active : true
    },
    {
      dufaultSrc : "https://image.dalbitlive.com/event/invite/tab02.png",
      activeSrc : "https://image.dalbitlive.com/event/invite/tabActive02.png",
      alt : "초대왕 현황",
      active : false
    },
    {
      dufaultSrc : "https://image.dalbitlive.com/event/invite/tab03.png",
      activeSrc : "https://image.dalbitlive.com/event/invite/tabActive03.png",
      alt : "나의 현황",
      active : false
    },
  ]);

  const tabActive = (index) => {
    const tempData = tabData.concat([]);
    for(let i = 0; i < tabData.length; i++){
      tempData[i].active = false;
    }
    tempData[index].active = true;
    setTabData(tempData);
  }

  return (
    <div id="invite">
      <Header position={'sticky'} title={'이벤트'} type={'back'}/>
      <div className='content'>
        <img src="https://image.dalbitlive.com/event/invite/eventPage_mainImg.png" alt="친구 초대하고 초대왕 도전!" className='fullImage'/>
        {
          tabData.length > 0 &&
            <div className='tabImgText'>
              {
                tabData.map((tabList, index) => {
                  return (
                    <div
                      className={`tabMenu ${tabList.active ? "active" : ""}`}
                      key={index}
                      onClick={() => tabActive(index)}
                    >
                      <img src={tabList.active ? tabList.activeSrc : tabList.dufaultSrc} alt={tabList.alt} className='tabName'/>
                    </div>
                  )
                })
              }          
            </div>
        }
        {
          tabData[0].active &&
          <InviteEvent/>
        }
        {
          tabData[1].active &&
          <InviteRank/>
        }
        {
          tabData[2].active &&
          <InviteMydata/>
        }
      </div>
    </div>
  )
}

export default Invite
