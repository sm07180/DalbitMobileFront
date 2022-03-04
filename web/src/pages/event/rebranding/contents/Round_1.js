import React, {useState, useEffect} from 'react'
import Api from 'context/api'
import {setCommonPopupOpenData} from "redux/actions/common";
import {useDispatch, useSelector} from "react-redux";
import moment from 'moment'
// global components
// components
import RoundList from '../components/RoundList'
import RankSlide from '../components/RankSlide'

import '../style.scss'

const Round_1 = (props) => {
  const {myRankInfo, eventInfo, tabmenuType} = props
  const eventFixDate = {start: '2022-02-07 00:00:00', end: '2022-03-04 13:59:59'}
  const lodingTime = moment('2022-03-03 01:59:59').format('MMDDHH')

  const popup = useSelector(state => state.popup)
  const dispatch = useDispatch()
  const [rankInfo, setRankInfo] = useState([])
  
  /* 이벤트 랭킹 정보 */
  const fetchRankInfo = () => {
    Api.getDallagersRankList({
      seqNo: 1,
      pageNo: 1,
      pagePerCnt: 9999,
    }).then((res) => {
      if (res.result === 'success') {
        setRankInfo(res.data)
      }
    })
  }
  
  // 랭킹 더보기
  const moreRank = () => {
    dispatch(setCommonPopupOpenData({...popup, morePopup: true}));
    // setPopRankSlide(true)
  }

  useEffect(() => {
    if (eventInfo.seq_no !== 0) {
      fetchRankInfo()
    }
  },[eventInfo.seq_no])
  
  return (
    <>
      <section className="date">
        {`${moment(eventFixDate.start).format('YY.MM.DD')} - ${moment(eventFixDate.end).format('MM.DD')}`}
      </section>
      <RoundList 
        myRankInfo={myRankInfo} 
        rankInfo={rankInfo} 
        lodingTime={lodingTime} 
        moreRank={moreRank}
      />
      {popup.morePopup &&
        <RankSlide 
          rankInfo={rankInfo} 
          eventDate={eventFixDate} 
          tabmenuType={tabmenuType} 
        />
      }
    </>
  )
}

export default Round_1
