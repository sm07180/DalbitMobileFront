import React, {useState, useEffect} from 'react'
import Api from 'context/api'
import moment from 'moment'
// global components
// components
import RoundList from '../components/roundList'

import '../style.scss'

const Round_1 = (props) => {
  const {eventInfo, tabmenuType} = props
  const eventDate = {start: eventInfo.start_date, end: eventInfo.end_date}
  const eventFixDate = {start: '2022-02-07 00:00:00', end: '2022-02-28 00:00:00'}
  const lodingTime = {start: moment('2022-03-03 00:00:00').format('MMDDHH'), end: moment('2022-03-07 02:00:00').format('MMDDHH')}

  console.log(lodingTime);
  
  const [myRankList, setMyRankList] = useState({})
  const [rankInfo, setRankInfo] = useState([])

  /* 이벤트 랭킹 내정보 */
  const fetchMyRankInfo = () => {
    const param = {
      seqNo: 1,
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
      seqNo: 1,
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
      <RoundList myRankInfo={myRankList} rankInfo={rankInfo} eventDate={eventDate} tabmenuType={tabmenuType} lodingTime={lodingTime} />
    </>
  )
}

export default Round_1
