import React, {useState, useCallback, useLayoutEffect} from 'react'

import {useHistory} from 'react-router-dom'
import API from 'context/api'
import ScorePop from './score_pop'
import NoResult from './no_result'

export default function (props) {
  const history = useHistory()
  const {moonRiseTime} = props
  const [popupState, setPopupState] = useState(false)
  const [list, setList] = useState([])

  const fetchMoonListDj = useCallback(async () => {
    const {result, data} = await API.getMoonRiseRank({
      slct_type: 1,
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
        return <img src={'https://image.dallalive.com/svg/ico_medal_gold_m@2x.png'} alt="골드메달 svg" className="rankImg" />
      }
      case 2: {
        return <img src={'https://image.dallalive.com/svg/ico_medal_silver_m@2x.png'} alt="실버메달 svg" className="rankImg" />
      }
      case 3: {
        return <img src={'https://image.dallalive.com/svg/ico_medal_bronze_m@2x.png'} alt="브론즈메달 svg" className="rankImg" />
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
        <div className="wizard_info" style={{minHeight: '330px'}}>
          <img src="https://image.dallalive.com/event/moonrise/moonrise_fullmoon_dj.png" alt="문법사 보상 이미지" />
          <button className="wizard_popUpBtn" onClick={() => setPopupState(true)}>
            <img src="https://image.dallalive.com/event/moonrise/moonrise_btn_notice.png" alt="보상 팝업 이미지" />
          </button>
        </div>
        <div className="wizard_listWrap">
          {list.length === 0 ? (
            <NoResult type="dj" />
          ) : (
            list.map((wizardItem, idx) => {
              const {profileImage, nickName, rank, completeCnt, lastDate, mem_no} = wizardItem
              return (
                <div key={idx} className="listItem" onClick={() => history.push(`/profile/${mem_no}`)}>
                  <RankDivideRender rank={rank} />
                  <div className="listInfo">
                    <img src={profileImage[`thumb62x62`]} className="profImg" alt="프로필이미지" />
                    <div className="detail_box">
                      <span className="nick">{nickName}</span>
                      <p className="date">{lastDate}</p>
                    </div>
                  </div>
                  <div className={idx > 2 ? 'moonCntWrap' : 'moonCntWrap ranker'}>
                    <img src="https://image.dallalive.com/event/moonrise/ic_dj_fullmoon.png" alt="문카운트이미지" />
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
