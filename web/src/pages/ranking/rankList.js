import React, {useContext} from 'react'
import {useHistory} from 'react-router-dom'

import {RoomJoin} from 'context/room'
import Util from 'components/lib/utility.js'
// context
import {Context} from 'context'
//static
import point from './static/ico-point.png'
import point2x from './static/ico-point@2x.png'
import like from './static/like_g_s.svg'
import live from './static/live.svg'
import people from './static/people_g_s.svg'
import time from './static/time_g_s.svg'

export default (props) => {
  //context
  const context = useContext(Context)
  const history = useHistory()

  const {list, formData} = props

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
              fanPoint,
              djPoint,
              isSpecial,
              roomNo,
              memNo
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
                  {formData.rankType == 'dj' && (
                    <>
                      <p className="myRanking__left--point">
                        <img src={point} srcSet={`${point} 1x, ${point2x} 2x`} className="myRanking__img" />
                        {Util.printNumber(djPoint)}
                      </p>
                    </>
                  )}

                  {formData.rankType == 'fan' && (
                    <>
                      <p className="myRanking__left--point">
                        <img src={point} srcSet={`${point} 1x, ${point2x} 2x`} className="myRanking__img" />
                        {Util.printNumber(fanPoint)}
                      </p>
                    </>
                  )}
                </div>

                <div
                  className="myRanking__right"
                  onClick={() => {
                    history.push(`/mypage/${memNo}`)
                  }}>
                  <div className="myRanking__rightWrap">
                    <div className="thumbBox">
                      <img src={profImg.thumb120x120} width="50px" className="thumbBox__pic" />
                    </div>

                    <div>
                      <div className="nickNameBox">
                        {nickNm}
                        <div className="nickNameImg">
                          {/*<img src={korea} srcSet={`${korea} 1x, ${korea2x} 2x`}  className="korea-m"/> */}
                          <span className={genderName}>{gender}</span>
                          {isSpecial === true && <em className="specialDj">스페셜DJ</em>}
                        </div>
                      </div>

                      <div className="countBox">
                        {formData.rankType == 'dj' && (
                          <>
                            <span className="countBox__item">
                              <img src={people} />
                              {Util.printNumber(listenerPoint)}
                            </span>

                            <span className="countBox__item">
                              <img src={like} />
                              {Util.printNumber(goodPoint)}
                            </span>

                            <span className="countBox__item">
                              <img src={time} />
                              {Util.printNumber(broadcastPoint)}
                            </span>
                          </>
                        )}

                        {formData.rankType == 'fan' && (
                          <>
                            <span className="countBox__item">
                              <img src={time} />
                              {Util.printNumber(listenPoint)}
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
                        if (sessionStorage.getItem('operater') === 'true') {
                          context.action.confirm_admin({
                            //콜백처리
                            callback: () => {
                              RoomJoin({
                                roomNo: roomNo + '',
                                shadow: 1
                              })
                            },
                            //캔슬콜백처리
                            cancelCallback: () => {
                              RoomJoin({
                                roomNo: roomNo + '',
                                shadow: 0
                              })
                            },
                            msg: '관리자로 입장하시겠습니까?'
                          })
                        } else {
                          RoomJoin({
                            roomNo: roomNo + ''
                          })
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
