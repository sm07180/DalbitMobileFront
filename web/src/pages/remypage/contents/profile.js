import React, {useEffect, useState, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'

import Api from 'context/api'
import Header from 'components/ui/header/Header'
import TabBtn from 'components/ui/tabBtn/TabBtn'
// components
import TopSwiper from '../components/topSwiper'
import ProfileCard from '../components/profileCard'
import TotalInfo from '../components/totalInfo'
// contents
import FeedSection from './feedSection'
import FanboardSection from './fanboardSection'
import ClipSection from './clipSection'

import './profile.scss'

const socialTabmenu = ['피드','팬보드','클립']

const Myprofile = () => {
  const history = useHistory()
  //context
  const context = useContext(Context)
  const {token, profile} = context
  
  const [socialType, setSocialType] = useState(socialTabmenu[1])

  // 페이지 시작
  return (
    <div id="myprofile">
      <Header title={`${profile.nickNm}`} type={'back'} />
      <section className='topSwiper'>
        <TopSwiper data={profile} />
      </section>
      <section className="profileCard">
        <ProfileCard data={profile} />
      </section>
      <section className='totalInfo'>
        <TotalInfo data={profile} />
      </section>
      <section className="socialWrap">
        <ul className="tabmenu">
          {socialTabmenu.map((data,index) => {
            const param = {
              item: data,
              tab: socialType,
              setTab: setSocialType,
              // setPage: setPage
            }
            return (
              <TabBtn param={param} key={index} />
            )
          })}
          <button>등록</button>
        </ul>
        {socialType === socialTabmenu[0] && <FeedSection data={profile} />}
        {socialType === socialTabmenu[1] && <FanboardSection data={profile} />}
        {socialType === socialTabmenu[2] && <ClipSection data={profile} />}
      </section>
    </div>
  )
}

export default Myprofile
