import React, {useState, useEffect} from 'react'
import {IMG_SERVER} from 'context/config'
import {setCommonPopupOpenData} from "redux/actions/common";
import {useDispatch, useSelector} from "react-redux";
import Api from 'context/api'
import moment from 'moment'
// global components
// components
import RoundList from '../components/RoundList'
import RankSlide from '../components/RankSlide'

import '../style.scss'

const Round_2 = (props) => {
  const {myRankInfo, eventInfo, tabmenuType} = props
  const eventFixDate = {start: '2022-03-18 00:00:00', end: '2022-03-27 23:59:59'}
  const lodingTime = moment('2022-03-18 01:59:59').format('MMDDHH')

  const dispatch = useDispatch()
  const popup = useSelector(state => state.popup)

  const [rankInfo, setRankInfo] = useState([])
  
  /* 이벤트 랭킹 정보 */
  const fetchRankInfo = () => {
    Api.getDallagersRankList({
      seqNo: 2,
      pageNo: 1,
      pagePerCnt: 100,
    }).then((res) => {
      if (res.result === 'success') {
        setRankInfo(res.data)
      }
    })
  }
  
  // 랭킹 더보기
  const moreRank = () => {
    dispatch(setCommonPopupOpenData({...popup, morePopup: true}));
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
      {eventInfo.seq_no === 2 ? 
        <>
          <RoundList 
            myRankInfo={myRankInfo} 
            rankInfo={rankInfo}
            lodingTime={lodingTime}
            moreRank={moreRank}
            eventFixDate={eventFixDate}
          />        
        </>
        :
        <section className="listWrap">
          <div className="comingsoon">
            <img src={`${IMG_SERVER}/event/rebranding/comingsoon.png`} alt="comingsoon" />
            <p>다음 회차엔 어떤 경품이?</p>
            <span>회차가 변경되면 보유한 dalla와 스톤이<br/>자동으로 소멸됩니다.</span>
          </div>
        </section>
      }
      <section>
        <img src={`${IMG_SERVER}/event/rebranding/giveaway_round2.png`} alt="이벤트 상품 이미지" />
      </section>
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

export default Round_2
