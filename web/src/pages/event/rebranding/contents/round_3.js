import React, {useState, useEffect} from 'react'
import {IMG_SERVER} from 'context/config'
import Api from 'context/api'
import moment from 'moment'
// global components
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'
import LayerPopup from 'components/ui/layerPopup/LayerPopup'
// components
import RoundList from '../components/roundList'
import RankSlide from '../components/rankSlide'

import '../style.scss'

const Round_3 = (props) => {
  const {myRankInfo, eventInfo, tabmenuType} = props
  const eventDate = {start: eventInfo.start_date, end: eventInfo.end_date}
  const eventFixDate = {start: '2022-03-01 00:00:00', end: '2022-03-07 00:00:00'}
  const lodingTime = {start: moment('2022-03-03 00:00:00').format('MMDDHH'), end: moment('2022-03-03 02:00:00').format('MMDDHH')}
  // 
  const [rankInfo, setRankInfo] = useState([])
  const [popSpecial, setPopSpecial] = useState(false)
  const [popRankSlide, setPopRankSlide] = useState(false)

  /* 이벤트 랭킹 정보 */
  const fetchRankInfo = () => {
    Api.getDallagersSpecialMyRankList({
      seqNo: eventInfo.seq_no,
      pageNo: 1,
      pagePerCnt: 9999,
    }).then((res) => {
      if (res.result === 'success') {
        setRankInfo(res.data.list)
      }
    })
  }

  // 스페셜 라운드 팝업
  const onPopSpecial = () => {
    setPopSpecial(true)
  }
  const closePopSpecial = () => {
    setPopSpecial(false)
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
        라운드 1+2 종합순위
        <button className="question" onClick={onPopSpecial}></button>
      </section>
      {eventInfo.seq_no === 2 ? 
        <RoundList 
          myRankInfo={myRankInfo} 
          rankInfo={rankInfo}  
          lodingTime={lodingTime} 
          moreRank={moreRank}
        />
        :
        <section className="listWrap">
          <div className="specialRound">
            <img src={`${IMG_SERVER}/event/rebranding/roulette.png`} alt="roulette" />
            <p>종합순위 상위 50명에게<br/>주어지는 당첨 기회</p>
            <span>· 당첨자는 라이브 방송에서 추첨합니다.</span>
            <span>· 방송 일정은 추후 공지됩니다.</span>
          </div>
        </section>
      }
      {popSpecial && 
        <LayerPopup title="스페셜 라운드" setPopup={setPopSpecial} close={false}>
          <section className="specialRound">
            <img src={`${IMG_SERVER}/event/rebranding/roulette.png`} alt="roulette" />
            <p>종합순위 상위 50명에게<br/>주어지는 당첨 기회</p>
            <span>· 당첨자는 라이브 방송에서 추첨합니다.</span>
            <span>· 방송 일정은 추후 공지됩니다.</span>
            <SubmitBtn text="확인" onClick={closePopSpecial} />
          </section>
        </LayerPopup>
      }
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

export default Round_3
