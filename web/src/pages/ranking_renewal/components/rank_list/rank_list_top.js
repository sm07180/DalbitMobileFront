import React, {useContext, useState, useRef, useCallback} from 'react'
import {useHistory} from 'react-router-dom'

import {Context} from 'context'
import {RankContext} from 'context/rank_ctx'

import {RoomJoin} from 'context/room'

import {printNumber} from '../../lib/common_fn'
import {convertMonday, convertMonth, convertDateToText} from '../../lib/common_fn'

//static
import benefitIcon from '../../static/benefit@2x.png'
import goldDecoDj from '../../static/djrf1_deco@3x.png'
import sliverDecoDj from '../../static/djrf2_deco@3x.png'
import bronzeDecoDj from '../../static/djrf3_deco@3x.png'
import goldDecoFan from '../../static/fanrf1_deco@3x.png'
import sliverDecoFan from '../../static/fanrf2_deco@3x.png'
import bronzeDecoFan from '../../static/fanrf3_deco@3x.png'
import liveIcon from '../../static/live_white_l.svg'

function RankListTop() {
  const history = useHistory()
  //context
  const context = useContext(Context)

  const {rankState} = useContext(RankContext)
  const {rankList, formState} = rankState

  const TopBoxRef = useRef(null)

  const realTimeNow = useCallback(() => {
    let timeNow

    const status = convertDateToText(formState.dateType, formState.currentDate, 0)
    if (TopBoxRef.current) {
      if (status) {
        if (formState.rankType === 1 && formState.dateType === 1) {
          TopBoxRef.current.className = 'TopBox isLabel'
          timeNow = <div className="realLabelDj"></div>
        } else if (formState.rankType === 2 && formState.dateType === 1) {
          TopBoxRef.current.className = 'TopBox isLabel'
          timeNow = <div className="realLabelFan"></div>
        } else {
          TopBoxRef.current.className = 'TopBox'
          timeNow = ''
        }
      } else {
        TopBoxRef.current.className = 'TopBox'
        timeNow = ''
      }
    }

    // if (formState.rankType === 1) {
    //   timeNow = <div className="realLabelDj"></div>
    // } else if (formState.rankType === 2) {
    //   timeNow = <div className="realLabelFan"></div>
    // } else {
    //   timeNow = ''
    // }
    return timeNow
  }, [formState, TopBoxRef])

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
                  {realTimeNow()}

                  <div
                    className={`TopBoxThumb ${formState.rankType === 1 ? 'dj' : 'fan'}`}
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

                    {formState.rankType === 1 ? (
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
                        RoomJoin({roomNo: roomNo})
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
