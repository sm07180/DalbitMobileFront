import React, {useEffect, useState, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'

import Swiper from 'react-id-swiper'
// global components
import TabBtn from 'components/ui/tabBtn/TabBtn'
// components
import SocialList from '../components/socialList'

const fanboardTabmenu = ['전체','내댓글']

const FanboardSection = (props) => {
  //context
  const context = useContext(Context)
  const {token, profile} = context
  
  const [fanboardType, setFanboardType] = useState(fanboardTabmenu[0])

  const data = profile

  return (
    <div className="fanboardSection">
      <ul className="subTabmenu">
        {fanboardTabmenu.map((data,index) => {
          const param = {
            item: data,
            tab: fanboardType,
            setTab: setFanboardType,
            // setPage: setPage
          }
          return (
            <TabBtn param={param} key={index} />
          )
        })}
      </ul>
      <div className="subArea">
        <div className="title">전체 2,222</div>
        <button>최신순</button>
      </div>
      <SocialList data={data} />
    </div>
  )
}

export default FanboardSection
