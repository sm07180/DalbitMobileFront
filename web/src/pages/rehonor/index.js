import React, {useEffect, useState} from 'react'
import {useHistory, useParams} from 'react-router-dom'

// global components
import Header from 'components/ui/header/Header'
// components
import Tabmenu from './components/Tabmenu'
// contents
import SpecialDj from './contents/SpecialDj'
import WeeklyPick from './contents/WeeklyPick'


import './style.scss'

const Honor = () => {  
  const [tabList, setTabList] = useState(["스페셜DJ", "위클리 픽"]);
  const [TabName, setTabName] = useState(tabList[0])
  
  useEffect(() => {

  }, [TabName])

  // 페이지 시작
  return (
   <div id='honor'>
      <Header position="sticky" title="명예의 전당" type="back"/>
      <div className='content'>
        <Tabmenu data={tabList} tab={TabName} setTab={setTabName} />
        { TabName === "스페셜DJ" ?
          <SpecialDj/>
          :
          <WeeklyPick/>
        }
      </div>
   </div>
  )
}

export default Honor
