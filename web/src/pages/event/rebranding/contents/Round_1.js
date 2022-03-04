import React, {useState, useEffect} from 'react'
import Api from 'context/api'
import moment from 'moment'
// global components
// components
import RoundList from '../components/roundList'
import RankSlide from '../components/rankSlide'

import '../style.scss'

const Round_1 = (props) => {
  const {myRankInfo, eventInfo, tabmenuType} = props
  const eventDate = {start: eventInfo.start_date, end: eventInfo.end_date}
  const eventFixDate = {start: '2022-02-07 00:00:00', end: '2022-03-08 00:00:00'}
  const lodingTime = {start: moment('2022-03-03 00:00:00').format('MMDDHH'), end: moment('2022-03-03 02:00:00').format('MMDDHH')}

  const [rankInfo, setRankInfo] = useState([])
  const [popRankSlide, setPopRankSlide] = useState(false)
  
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
    setPopRankSlide(true)
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
      {popRankSlide &&
        <RankSlide 
          rankInfo={rankInfo} 
          eventDate={eventDate} 
          tabmenuType={tabmenuType} 
          setPopRankSlide={setPopRankSlide}
        />
      }
    </>
  )
}

export default Round_1
