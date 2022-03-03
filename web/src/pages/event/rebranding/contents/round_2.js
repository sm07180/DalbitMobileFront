import React, {useState, useEffect} from 'react'
import {IMG_SERVER} from 'context/config'
import Api from 'context/api'
import moment from 'moment'
// global components
// components
import RoundList from '../components/roundList'

import '../style.scss'

const Round_2 = (props) => {
  const {eventInfo, tabmenuType} = props
  const eventDate = {start: eventInfo.start_date, end: eventInfo.end_date}
  const eventFixDate = {start: '2022-03-01', end: '2022-03-07'}
  const lodingTime = {start: moment('2022-03-03 00:00:00').format('MMDDHH'), end: moment('2022-03-07 02:00:00').format('MMDDHH')}
  
  // 
  const [myRankList, setMyRankList] = useState({})
  const [rankInfo, setRankInfo] = useState([])

  /* 이벤트 랭킹 내정보 */
  const fetchMyRankInfo = () => {
    const param = {
      seqNo: 2,
    }
    Api.getDallagersMyRankInfo(param).then((res) => {
      if (res.result === 'success') {
        setMyRankList(res.data)
      }
    })
  }
  
  /* 이벤트 랭킹 정보 */
  const fetchRankInfo = () => {
    Api.getDallagersRankList({
      seqNo: 2,
      pageNo: 1,
      pagePerCnt: 50,
    }).then((res) => {
      if (res.result === 'success') {
        setRankInfo(res.data)
      }
    })
  }

  useEffect(() => {
    if (eventInfo.seq_no !== 0) {
      fetchMyRankInfo()
      fetchRankInfo()
    }
  },[eventInfo.seq_no])

  return (
    <>
      <section className="date">
        {`${moment(eventFixDate.start).format('YY.MM.DD')} - ${moment(eventFixDate.end).format('MM.DD')}`}
      </section>
      {eventInfo.seq_no === 2 ? 
        <RoundList myRankInfo={myRankList} rankInfo={rankInfo} eventDate={eventDate} tabmenuType={tabmenuType} lodingTime={lodingTime} />
        :
        <section className="listWrap">
          <div className="comingsoon">
            <img src={`${IMG_SERVER}/event/rebranding/comingsoon.png`} alt="comingsoon" />
            <p>다음 회차엔 어떤 경품이?</p>
            <span>회차가 변경되면 보유한 dalla와 스톤이<br/>자동으로 소멸됩니다.</span>
          </div>
        </section>
      }
    </>
  )
}

export default Round_2
