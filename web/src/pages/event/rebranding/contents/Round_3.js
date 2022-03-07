import React, {useState, useEffect} from 'react'
import {IMG_SERVER} from 'context/config'
import Api from 'context/api'
import moment from 'moment'
// global components
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'
import LayerPopup from 'components/ui/layerPopup/LayerPopup'
// components
import RoundList from '../components/RoundList'
import RankSlide from '../components/RankSlide'

import '../style.scss'

const Round_3 = (props) => {
  const {myRankInfo, eventInfo, tabmenuType} = props
  const eventFixDate = {start: '2022-03-27 00:00:00', end: '2022-03-31 23:59:59'}
  const lodingTime = moment('2022-03-27 01:59:59').format('MMDDHH')
  const nowTime = moment().format('MMDDHH')
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
        {
          eventInfo.seq_no === 2 &&
            <button className="question" onClick={onPopSpecial}></button>
        }
      </section>
      {nowTime > lodingTime ?
        <RoundList 
          myRankInfo={myRankInfo} 
          rankInfo={rankInfo}  
          lodingTime={lodingTime} 
          moreRank={moreRank}
        />
        :
        <>
          <section className="listWrap">
            <div className="specialRound">
              <img src={`${IMG_SERVER}/event/rebranding/specialRound_roulette.png`} alt="" />
            </div>
          </section>
          <img src={`${IMG_SERVER}/event/rebranding/specialRound_giveaway.png`} alt="" />
        </>
      }
      {popSpecial && 
        <LayerPopup setPopup={setPopSpecial} close={false}>
          <section className="specialRound">
            <img src={`${IMG_SERVER}/event/rebranding/pop_specialRound.png`} alt="" />
            <span>· 당첨자는 라이브 방송에서 추첨하며 룰렛을 이용합니다.</span>
            <span>· DJ는 공정성을 위해 회원님들 중 선발합니다.</span>
            <span>· 방송 일정은 추후에 공지됩니다.</span>
            <SubmitBtn text="확인" onClick={closePopSpecial} />
          </section>
        </LayerPopup>
      }
      {popRankSlide &&
        <RankSlide 
          rankInfo={rankInfo}
          tabmenuType={tabmenuType} 
          setPopRankSlide={setPopRankSlide}
        />
      }
    </>
  )
}

export default Round_3
