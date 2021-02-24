import React, {useState, useCallback, useLayoutEffect} from 'react'
import API from 'context/api'
import {useHistory} from 'react-router-dom'
import ScorePop from './score_pop'
import NoResult from './no_result'
import Utility, {addComma} from 'components/lib/utility'

export default function (props) {
  const history = useHistory()
  const {moonRiseTime} = props
  const [popupState, setPopupState] = useState(false)
  const [list, setList] = useState([])

  const fetchMoonListDj = useCallback(async () => {
    const {result, data} = await API.getMoonRiseRank({
      slct_type: 2,
      fullmoon_idx: moonRiseTime
    })
    if (result === 'success') {
      setList(data)
    } else {
    }
  }, [])
  const RankDivideRender = (props) => {
    const {rank} = props
    switch (rank) {
      case 1: {
        return <img src={'https://image.dalbitlive.com/svg/ico_medal_gold_m@2x.png'} alt="골드메달 svg" className="rankImg" />
      }
      case 2: {
        return <img src={'https://image.dalbitlive.com/svg/ico_medal_silver_m@2x.png'} alt="실버메달 svg" className="rankImg" />
      }
      case 3: {
        return <img src={'https://image.dalbitlive.com/svg/ico_medal_bronze_m@2x.png'} alt="브론즈메달 svg" className="rankImg" />
      }
      default: {
        return <em className="defaultRankIcon">{rank}</em>
      }
    }
  }
  useLayoutEffect(() => {
    fetchMoonListDj()
  }, [])
  return (
    <React.Fragment>
      <div className="wizard">
        <div className="wizard_info">
          <img
            src="https://image.dalbitlive.com/event/moonrise/moonrise_fullmoon_fan.png"
            alt="문법사 보상 이미지"
            style={{minHeight: '400px'}}
          />
          <button className="wizard_popUpBtn" onClick={() => setPopupState(true)}>
            <img src="https://image.dalbitlive.com/event/moonrise/moonrise_btn_notice.png" alt="보상 팝업 이미지" />
          </button>
        </div>
        <div className="wizard_listWrap">
          {list.length === 0 ? (
            <NoResult type="fan" />
          ) : (
            list.map((wizardItem, idx) => {
              const {profileImage, nickName, rank, completeCnt, lastDate, listenTime, mem_no} = wizardItem

              return (
                <div key={idx} className="listItem" onClick={() => history.push(`/mypage/${mem_no}`)}>
                  <RankDivideRender rank={rank} />
                  <div className="listInfo">
                    <img src={profileImage[`thumb62x62`]} className="profImg" alt="프로필이미지" />
                    <div className="detail_box">
                      <span className="nick">{nickName}</span>
                      <p className="date">
                        {lastDate}
                        <img src={`https://image.dalbitlive.com/svg/time_g_s.svg`} className="timeIcon" alt="타임아이콘" />
                        {Utility.addComma(listenTime)}
                      </p>
                    </div>
                  </div>
                  <div className={idx > 2 ? 'moonCntWrap' : 'moonCntWrap ranker'}>
                    <img src="https://image.dalbitlive.com/event/moonrise/ic_fan_fullmoon.png" alt="문카운트이미지" />
                    <span className="moonCnt">{completeCnt}회</span>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
      {popupState && <ScorePop setPopupState={setPopupState} />}
    </React.Fragment>
  )
}
