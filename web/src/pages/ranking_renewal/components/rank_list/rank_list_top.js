import React, {useCallback, useRef} from 'react'
import {useHistory} from 'react-router-dom'

import {RoomJoin} from 'context/room'

//static
import goldDecoDj from '../../static/djrf1_deco@3x.png'
import sliverDecoDj from '../../static/djrf2_deco@3x.png'
import bronzeDecoDj from '../../static/djrf3_deco@3x.png'
import goldDecoFan from '../../static/fanrf1_deco@3x.png'
import sliverDecoFan from '../../static/fanrf2_deco@3x.png'
import bronzeDecoFan from '../../static/fanrf3_deco@3x.png'
import liveIcon from '../../static/live_white_l.svg'
import {DATE_TYPE, PAGE_TYPE, RANK_TYPE} from 'pages/ranking_renewal/constant'
import {convertDateToText} from 'pages/common/rank/rank_fn'
import {useSelector} from "react-redux";

function RankListTop({specialPop}) {
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const history = useHistory()
  const rankState = useSelector(({rank}) => rank);
  const {rankList, formState, rankTimeData} = rankState

  const TopBoxRef = useRef(null)

  const realTimeNow = useCallback(
    (memNo, liveBadgeList) => {
      let timeNow
      const status = convertDateToText(formState[formState.pageType].dateType, formState[formState.pageType].currentDate, 0)
      const dateNow = new Date()
      const monthNow = dateNow.getMonth()
      const monthRank = new Date(formState[formState.pageType].currentDate).getMonth()

      if (TopBoxRef.current) {
        if (formState[formState.pageType].dateType === DATE_TYPE.TIME) {
          if (rankTimeData.nextDate !== '') {
            if (formState[formState.pageType].rankType === RANK_TYPE.DJ) {
              if (monthNow === monthRank) {
                TopBoxRef.current.className = 'TopBox isSpPoint'
                timeNow = (
                  <div className="spPoint" onClick={() => specialPop(memNo)}>
                    <span className="arrowIcon">
                      <img src="https://image.dalbitlive.com/svg/20200806/arrow_right_b.svg" alt="arrow"></img>
                    </span>
                  </div>
                )
              } else {
                TopBoxRef.current.className = 'TopBox'
                timeNow = ''
              }
            } else {
              TopBoxRef.current.className = 'TopBox'
              timeNow = ''
            }
          } else {
            if (formState[formState.pageType].rankType === RANK_TYPE.DJ) {
              TopBoxRef.current.className = 'TopBox isLabel'
              timeNow = (
                <>
                  {liveBadgeList &&
                    liveBadgeList.length !== 0 &&
                    liveBadgeList.map((item, idx) => {
                      return (
                        <div key={idx} className="labelDj">
                          <img src={item.icon} alt="icon" />
                          {item.text}
                        </div>
                      )
                    })}
                </>
              )
            } else {
            }
          }
        } else if (formState[formState.pageType].dateType === DATE_TYPE.DAY) {
          if (formState[formState.pageType].rankType === RANK_TYPE.FAN) {
            if (status) {
              TopBoxRef.current.className = 'TopBox isLabel'
              timeNow = (
                <>
                  {liveBadgeList &&
                    liveBadgeList.length !== 0 &&
                    liveBadgeList.map((item, idx) => {
                      return (
                        <div key={idx} className="labelFan">
                          <img src={item.icon} alt="icon" />
                          {item.text}
                        </div>
                      )
                    })}
                </>
              )
            } else {
              TopBoxRef.current.className = 'TopBox'
              timeNow = ''
            }
          } else {
            TopBoxRef.current.className = 'TopBox'
            timeNow = ''
          }
        } else {
          TopBoxRef.current.className = 'TopBox'
          timeNow = ''
        }
      }
      return timeNow
    },
    [formState, TopBoxRef, rankTimeData]
  )

  const creatList = () => {
    const rank = rankList
    const baseCount = 3

    let rankResult
    if (rank.length < 3) {
      rankResult = [...rank].concat(Array(baseCount - rank.length).fill(null))
    } else {
      rankResult = rank
    }

    return (
      <>
        <div className="userRanking">
          <div className="TopBox" ref={TopBoxRef}>
            {rankResult.slice(0, 3).map((item, index) => {
              if (item === null) return <div className="TopBox__item" key={index}></div>
              const {nickNm, profImg, memNo, roomNo, liveBadgeList} = item

              return (
                <div className="TopBox__item" key={index}>
                  {realTimeNow(memNo, liveBadgeList)}
                  <div
                    className={`TopBoxThumb ${formState[PAGE_TYPE.RANKING].rankType === RANK_TYPE.DJ ? 'dj' : 'fan'}`}
                    onClick={() => {
                      if (globalState.token.isLogin) {
                        if (globalState.token.memNo === memNo) {
                          history.push(`/menu/profile`)
                        } else {
                          history.push(`/mypage/${memNo}`)
                        }
                      } else {
                        history.push(`/login`)
                      }
                    }}>
                    <img src={profImg.thumb120x120} className="TopBoxThumb__pic" />

                    {formState[PAGE_TYPE.RANKING].rankType === RANK_TYPE.DJ ? (
                      <img
                        className="TopBoxThumb__deco dj"
                        src={index === 0 ? goldDecoDj : index === 1 ? sliverDecoDj : bronzeDecoDj}
                      />
                    ) : (
                      <img
                        className="TopBoxThumb__deco fan"
                        src={index === 0 ? goldDecoFan : index === 1 ? sliverDecoFan : bronzeDecoFan}
                      />
                    )}
                  </div>
                  {roomNo !== '' ? (
                    <div
                      className="nickNameBox"
                      onClick={() => {
                        RoomJoin({roomNo: roomNo, nickNm: nickNm})
                      }}>
                      <p className="nickNameBox__nick">{nickNm}</p>
                      <i className="nickNameBox__live">
                        <img src={liveIcon} />
                      </i>
                    </div>
                  ) : (
                    <div className="nickNameBox">
                      <p className="nickNameBox__nick--noLive">{nickNm}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* <div
            className="benefitSize"
            onClick={() => {
              history.push('/rank/benefit')
            }}>
            <img src={benefitIcon} />
          </div> */}
        </div>
      </>
    )
  }

  return creatList()
}

export default React.memo(RankListTop)
