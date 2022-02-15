import React, {useEffect, useState} from 'react'

import Api from 'context/api'
// global components
import Header from 'components/ui/header/Header'
// components
import Tabmenu from './components/Tabmenu'
// contents
import WeeklyPick from './contents/WeeklyPick'
import SpecialDj from "pages/rehonor/contents/SpecialDj";

import './style.scss'

const honorTabmenu = ["스페셜DJ", "위클리 픽"]

const Honor = () => {
  const [honorTabType, setHonorTabType] = useState(honorTabmenu[0])

  const [honorList, setHonorList] = useState({type: '', data: []})

  const fetchHonorInfo = () => {
    if (honorTabType === honorTabmenu[1]) {
      Api.getWeeklyList({
        pageNo: 1,
        pageCnt: 100
      }).then((res) => {
        if (res.result === 'success') {
          setHonorList({...honorList, type:'weeklyPick', data: res.data.list})
        }  
      })
    }
  }

  useEffect(() => {
    fetchHonorInfo()
  }, [honorTabType])

  // 페이지 시작
  return (
   <div id='honor'>
      <Header title="명예의 전당" type="back"/>
      <Tabmenu data={honorTabmenu} tab={honorTabType} setTab={setHonorTabType} />
      {honorTabType === honorTabmenu[0] ?
        <SpecialDj />
        : honorTabType === honorTabmenu[1] &&
        <WeeklyPick data={honorList.data} type={honorList.type}/>
      }
   </div>
  )
}

export default Honor
