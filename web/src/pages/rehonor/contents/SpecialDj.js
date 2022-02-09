import React, {useContext, useEffect, useState}from 'react'
import {Context} from 'context'

import Api from 'context/api'
import moment from "moment";

import DetailView from '../components/DetailView'
import PhotoFrame from 'components/ui/photoFrame/PhotoFrame'
import DataCnt from 'components/ui/dataCnt/DataCnt'
// global components

const SpecialDj = (props) => {
  const context = useContext(Context)

  const [ dateData, setDateData ] = useState([]);
  const [ specialDjList, setSpecialDjList ] = useState([]);
  
  const {token, profile} = context

  const NowDate = new Date;
  let NowYear = moment(NowDate).format("YYYY");
  let NowMonth = moment(NowDate).format("MM");

  async function fetchHonor() {
    const res = await Api.getSpecialDjHistory({
      yy: NowYear - 1,
      mm: NowMonth 
    })
    if (res.result === 'success') {
      console.log(res);
      setSpecialDjList(res.data.list);
      setDateData(res.data.info);
    }
  }

  useEffect(() => {
    fetchHonor()
  },[])

  return (
    <>
      <DetailView />
      <p className='infomation'>달라의 celebrity! 스페셜 DJ를 소개합니다.</p>
      {profile &&
        <div className='myHonor'>
            <PhotoFrame data={profile} size={80}/>
            <div className='myInfoWrap'>
              <div className='listRow'>
                <div className='nickNm'>{profile.nickNm}</div>
              </div>
              <div className='listRow'>
                <div className='level'>{profile.level}</div>
              </div>
              <div className='listRow dataCnt'>
                <DataCnt />
                <DataCnt />
                <DataCnt />
              </div>
            </div>              
        </div>
      }   
    </>
  )
}

export default SpecialDj
