import React, {useContext, useState, useRef, useCallback} from 'react'
import {useHistory} from 'react-router-dom'

import {Context} from 'context'
import {RankContext} from 'context/rank_ctx'
import Api from 'context/api'

import {RoomJoin} from 'context/room'

//static
import benefitIcon from '../../static/benefit@2x.png'
import goldDecoDj from '../../static/djrf1_deco@3x.png'
import sliverDecoDj from '../../static/djrf2_deco@3x.png'
import bronzeDecoDj from '../../static/djrf3_deco@3x.png'
import goldDecoFan from '../../static/fanrf1_deco@3x.png'
import sliverDecoFan from '../../static/fanrf2_deco@3x.png'
import bronzeDecoFan from '../../static/fanrf3_deco@3x.png'
import liveIcon from '../../static/live_white_l.svg'
import {PAGE_TYPE, RANK_TYPE} from 'pages/ranking_renewal/constant'

function RankListTop({specialPop}) {
  const history = useHistory()

  //context
  const context = useContext(Context)
  const {rankState, rankAction} = useContext(RankContext)
  const {rankList, formState} = rankState

  const TopBoxRef = useRef(null)

  //api fetchdata
  const fetchSpecialPoint = async (memNo) => {
    const {data, result, message} = await Api.get_special_point({
      params: {
        memNo: memNo
      }
    })

    if (result === 'success') {
      rankAction.setSpecialPoint(data)
      rankAction.setSpecialPointList(data.list)
    } else {
      //실패
    }
  }

  // const specialPop = (memNo) => {
  //   setPopState(true)
  //   fetchSpecialPoint(memNo)
  // }

  const realTimeNow = useCallback(
    (memNo) => {
      let timeNow
      let dateNow = new Date()
      let monthNow = dateNow.getMonth()
      let monthRank = formState[formState.pageType].currentDate.getMonth()

      if (TopBoxRef.current) {
        if (formState[formState.pageType].rankType === RANK_TYPE.DJ && monthNow === monthRank) {
          TopBoxRef.current.className = 'TopBox isLabel'
          timeNow = (
            <div className="realLabelDj" onClick={() => specialPop(memNo)}>
              <span className="arrowIcon">
                <img src="https://image.dalbitlive.com/svg/20200806/arrow_right_b.svg" alt="arrow"></img>
              </span>
            </div>
          )
        } else {
          TopBoxRef.current.className = 'TopBox'
          timeNow = ''
        }
      }
      return timeNow
    },
    [formState, TopBoxRef]
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
              const {nickNm, profImg, memNo, roomNo} = item

              return (
                <div className="TopBox__item" key={index}>
                  {realTimeNow(memNo)}

                  <div
                    className={`TopBoxThumb ${formState[PAGE_TYPE.RANKING].rankType === RANK_TYPE.DJ ? 'dj' : 'fan'}`}
                    onClick={() => {
                      if (context.token.isLogin) {
                        if (context.token.memNo === memNo) {
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
