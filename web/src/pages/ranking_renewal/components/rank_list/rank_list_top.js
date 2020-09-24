import React, {useContext, useState, useRef} from 'react'
import {useHistory} from 'react-router-dom'

import {Context} from 'context'
import {RankContext} from 'context/rank_ctx'

import {RoomJoin} from 'context/room'

import {printNumber} from '../../lib/common_fn'
import {convertMonday, convertMonth} from '../../lib/common_fn'

//static

import goldDecoDj from '../../static/djrf1_deco@3x.png'
import sliverDecoDj from '../../static/djrf2_deco@3x.png'
import bronzeDecoDj from '../../static/djrf3_deco@3x.png'
import goldDecoFan from '../../static/fanrf1_deco@3x.png'
import sliverDecoFan from '../../static/fanrf2_deco@3x.png'
import bronzeDecoFan from '../../static/fanrf3_deco@3x.png'

function RankListTop() {
  const history = useHistory()
  //context
  const context = useContext(Context)

  const {rankState} = useContext(RankContext)
  const {rankList, formState} = rankState

  const TopBoxRef = useRef(null)

  const realTimeNow = () => {
    const formDt = formState.currentDate
    let formYear = formDt.getFullYear()
    let formMonth = formDt.getMonth() + 1
    let formDate = formDt.getDate()

    const cDate = new Date()
    let year = cDate.getFullYear()
    let month = cDate.getMonth() + 1
    let date = cDate.getDate()

    let timeNow

    if (formState.rankType === 1) {
      if (formState.dateType === 1) {
        if (year === formYear && month === formMonth && formDate === date) {
          timeNow = <div className="realLabelDj"></div>
          if (TopBoxRef.current) {
            TopBoxRef.current.className = 'TopBox isLabel'
          }
        } else {
          timeNow = ''
          if (TopBoxRef.current) {
            TopBoxRef.current.className = 'TopBox'
          }
        }
      }
    } else if (formState.rankType === 2) {
      if (formState.dateType === 1) {
        if (year === formYear && month === formMonth && formDate === date) {
          timeNow = <div className="realLabelFan"></div>
          if (TopBoxRef.current) {
            TopBoxRef.current.className = 'TopBox isLabel'
          }
        } else {
          timeNow = ''
          if (TopBoxRef.current) {
            TopBoxRef.current.className = 'TopBox'
          }
        }
      }
    }

    return timeNow
  }

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
              const {nickNm, profImg} = item

              return (
                <div className="TopBox__item" key={index}>
                  {realTimeNow()}

                  <div className={`TopBoxThumb ${formState.rankType === 1 ? 'dj' : 'fan'}`}>
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

                  <p className="nickName">{nickNm}</p>
                </div>
                // <div
                //   className={'TopBox__item ' + `${context.token.isLogin && context.token.memNo === memNo ? 'active' : ''}`}
                //   key={index}>
                //   <div
                //     className="thumbBox"
                //     onClick={() => {
                //       if (context.token.isLogin) {
                //         if (context.token.memNo === memNo) {
                //           history.push(`/menu/profile`)
                //         } else {
                //           history.push(`/mypage/${memNo}`)
                //         }
                //       } else {
                //         history.push(`/login`)
                //       }
                //     }}>
                //     <img src={holder} className="thumbBox__frame" />
                //     <img src={profImg.thumb120x120} className="thumbBox__pic" />
                //   </div>

                //   <div
                //     onClick={() => {
                //       if (context.token.isLogin) {
                //         if (context.token.memNo === memNo) {
                //           history.push(`/menu/profile`)
                //         } else {
                //           history.push(`/mypage/${memNo}`)
                //         }
                //       } else {
                //         history.push(`/login`)
                //       }
                //     }}>
                //     {/* <p className={levelName}>
                //     Lv{level} {grade}
                //   </p> */}
                //     <div className="nickNameBox">
                //       <span className="nickName">{nickNm}</span>
                //       <div className="iconBox">
                //         {/*<img src={korea} srcSet={`${korea} 1x, ${korea2x} 2x`} className="korea-m"/> */}
                //         <span className={genderName}>{gender}</span>
                //         {isSpecial === true && <em className="specialDj">스페셜DJ</em>}
                //       </div>
                //     </div>
                //   </div>

                //   <div
                //     className="countBox"
                //     onClick={() => {
                //       if (context.token.isLogin) {
                //         if (context.token.memNo === memNo) {
                //           history.push(`/menu/profile`)
                //         } else {
                //           history.push(`/mypage/${memNo}`)
                //         }
                //       } else {
                //         history.push(`/mypage/${memNo}`)
                //       }
                //     }}>
                //     {formState.rankType === 1 && (
                //       <>
                //         {/* <span className="countBox__item countBox__item--point">
                //         <img src={point} srcSet={`${point} 1x, ${point2x} 2x`} />
                //         {printNumber(djPoint)}
                //       </span> */}

                //         <div className="countBoxInner">
                //           <span className="countBox__item">
                //             <img src={people} />
                //             {printNumber(listenerPoint)}
                //           </span>
                //           <span className="countBox__item">
                //             <img src={like} />
                //             {printNumber(goodPoint)}
                //           </span>

                //           <span className="countBox__item">
                //             <img src={time} />
                //             {printNumber(broadcastPoint)}
                //           </span>
                //         </div>
                //       </>
                //     )}

                //     {formState.rankType === 2 && (
                //       <>
                //         {/* <span className="countBox__item countBox__item--point">
                //         <img src={point} />
                //         {printNumber(fanPoint)}
                //       </span> */}
                //         {/* <span className="countBox__item">
                //         <img src={moon} />
                //         {Util.printNumber(gift)}
                //       </span> */}
                //         <span className="countBox__item">
                //           <img src={StarCountIcon} />
                //           {printNumber(starCnt)}
                //         </span>
                //         <span className="countBox__item">
                //           <img src={time} />
                //           {printNumber(listenPoint)}
                //         </span>
                //       </>
                //     )}
                //   </div>

                //   <div className="medalBox">
                //     <p className={rankName}>{rank}</p>
                //     <p className="rankingChange">
                //       {upDown === 'new' ? (
                //         <span className="rankingChange__new">NEW</span>
                //       ) : upDown > 0 ? (
                //         <span className="rankingChange__up">{Math.abs(upDown)}</span>
                //       ) : upDown < 0 ? (
                //         <span className="rankingChange__down">{Math.abs(upDown)}</span>
                //       ) : (
                //         <></>
                //       )}
                //     </p>
                //   </div>

                //   {roomNo !== '' && (
                //     <div className="liveBox">
                //       <img
                //         src={live}
                //         onClick={() => {
                //           RoomJoin({roomNo: roomNo})
                //         }}
                //         className="liveBox__img"
                //       />
                //       <br />
                //       LIVE
                //     </div>
                //   )}
                // </div>
              )
            })}
          </div>
        </div>
      </>
    )
  }

  return creatList()
}

export default React.memo(RankListTop)
