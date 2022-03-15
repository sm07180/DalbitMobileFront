import React from 'react'
import {useHistory} from 'react-router-dom'

import {RoomJoin} from 'context/room'
import Util from 'components/lib/utility.js'
//static
import like from './static/like_g_s.svg'
import live from './static/live.svg'
import people from './static/people_g_s.svg'
import time from './static/time_g_s.svg'
import StarCountIcon from './static/circle_star_s_g.svg'

// constant
import {RANK_TYPE} from './constant'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage, setGlobalCtxUpdatePopup} from "redux/actions/globalCtx";

export default (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const history = useHistory()

  const {list, rankType} = props

  const creatList = () => {
    return (
      <>
        <div className="userRanking">
          {list.map((item, index) => {
            const {
              gender,
              nickNm,
              rank,
              profImg,
              upDown,
              listenPoint,
              listenerPoint,
              goodPoint,
              broadcastPoint,
              badgeSpecial,
              roomNo,
              memNo,
              starCnt
            } = item
            let genderName
            let upDownName

            if (gender == 'm' || gender == 'f') {
              genderName = `genderBox gender-${gender}`
            } else {
              genderName = `genderBox`
            }

            return (
              <div className="myRanking rankingList" key={index}>
                <div
                  className="myRanking__left"
                  onClick={() => {
                    history.push(`/mypage/${memNo}`)
                  }}>
                  <p className="myRanking__left--ranking">{rank}</p>
                  <p className="rankingChange">
                    {upDown === 'new' ? (
                      <span className="rankingChange__new">NEW</span>
                    ) : upDown > 0 ? (
                      <span className="rankingChange__up">{Math.abs(upDown)}</span>
                    ) : upDown < 0 ? (
                      <span className="rankingChange__down">{Math.abs(upDown)}</span>
                    ) : (
                      <></>
                    )}
                  </p>
                  {/* {rankType == 1 && (
                    <>
                      <p className="myRanking__left--point">
                        <img src={point} srcSet={`${point} 1x, ${point2x} 2x`} className="myRanking__img" />
                        {Util.printNumber(djPoint)}
                      </p>
                    </>
                  )}

                  {rankType == 2 && (
                    <>
                      <p className="myRanking__left--point">
                        <img src={point} srcSet={`${point} 1x, ${point2x} 2x`} className="myRanking__img" />
                        {Util.printNumber(fanPoint)}
                      </p>
                    </>
                  )} */}
                </div>

                <div
                  className="myRanking__right"
                  onClick={() => {
                    history.push(`/mypage/${memNo}`)
                  }}>
                  <div className="myRanking__rightWrap">
                    <div className="thumbBox">
                      <img src={profImg.thumb292x292} width="50px" className="thumbBox__pic" />
                    </div>

                    <div>
                      <div className="nickNameBox">
                        {nickNm}
                        <div className="nickNameImg">
                          {/*<img src={korea} srcSet={`${korea} 1x, ${korea2x} 2x`}  className="korea-m"/> */}
                          <span className={genderName}>{gender}</span>
                          {badgeSpecial > 0 && <em className="specialDj">스페셜DJ</em>}
                        </div>
                      </div>

                      <div className="countBox">
                        {rankType === RANK_TYPE.DJ && (
                          <>
                            <span className="countBox__item">
                              <img src={people} className="ico-people" />
                              <em className="count">{Util.printNumber(listenerPoint)}</em>
                            </span>

                            <span className="countBox__item">
                              <img src={like} />
                              <em className="count">{Util.printNumber(goodPoint)}</em>
                            </span>

                            <span className="countBox__item">
                              <img src={time} />
                              <em className="count">{Util.printNumber(broadcastPoint)}</em>
                            </span>
                          </>
                        )}

                        {rankType === RANK_TYPE.FAN && (
                          <>
                            <span className="countBox__item">
                              <img src={StarCountIcon} />
                              <em className="count">{Util.printNumber(starCnt)}</em>
                            </span>
                            <span className="countBox__item">
                              <img src={time} />
                              <em className="count">{Util.printNumber(listenPoint)}</em>
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {roomNo !== '' && (
                  <div className="liveBox">
                    <img
                      src={live}
                      onClick={() => {
                        if (customHeader['os'] === OS_TYPE['Desktop']) {
                          if (globalState.token.isLogin === false) {
                            dispatch(setGlobalCtxMessage({
                              type: "alert",
                              msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
                              callback: () => {
                                history.push('/login')
                              }
                            }))
                          } else {
                            dispatch(setGlobalCtxUpdatePopup({popup: ['APPDOWN', 'appDownAlrt', 1]}));
                          }
                        } else {
                          RoomJoin({roomNo: roomNo, nickNm: nickNm})
                        }
                      }}
                      className="liveBox__img"
                    />
                    <br />
                    LIVE
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </>
    )
  }

  return creatList()
}
