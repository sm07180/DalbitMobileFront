import React, {useEffect, useState, useCallback} from 'react'

import Api from 'context/api'
import moment from "moment";
// global components
import Header from 'components/ui/header/Header'
// components
import Tabmenu from './components/Tabmenu'
// contents
import HonorDetail from './contents/HonorDetail'


import './style.scss'

const honorTabmenu = ["스페셜DJ", "위클리 픽"]

const Honor = () => {
  const [honorTabType, setHonorTabType] = useState(honorTabmenu[0])
  const [honorInfo, setHonorInfo] = useState({})
  const [honorList, setHonorList] = useState({type: '', data: []})
  
  const NowDate = new Date;
  let NowYear = moment(NowDate).format("YYYY");
  let NowMonth = moment(NowDate).format("MM");

  const fetchHonorInfo = () => {
    if (honorTabType === honorTabmenu[0]) {
      Api.getSpecialDjHistory({
        yy: NowYear - 1,
        mm: NowMonth 
      }).then((res) => {
        if (res.result === 'success') {
          setHonorList({...honorList, type:'specialDj', data: res.data.list})
          setHonorInfo(res.data.info)
        }  
      })
    }
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
        <HonorDetail data={honorList.data} type={honorList.type}/>
        : honorTabType === honorTabmenu[1] &&
        <HonorDetail data={honorList.data} type={honorList.type}/>
      }
   </div>
  )
}

export default Honor
