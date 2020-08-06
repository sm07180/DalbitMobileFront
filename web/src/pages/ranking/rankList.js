import React from 'react'
import {useHistory} from 'react-router-dom'

import {RoomJoin} from 'context/room'
import Util from 'components/lib/utility.js'

//static
import point from './static/ico-point.png'
import point2x from './static/ico-point@2x.png'
import like from './static/like_g_s.svg'
import live from './static/live.svg'
import people from './static/people_g_s.svg'
import time from './static/time_g_s.svg'

export default (props) => {
  //context
  const history = useHistory()
  const rankType = props.rankType
  const {list} = props

  const creatList = () => {
    return (
      <>
        <div className="userRanking">
          {list.map((item, index) => {
            const {
              gender,
              gift,
              nickNm,
              rank,
              profImg,
              upDown,
              listen,
              listeners,
              likes,
              broadcast,
              fan,
              dj,
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
                  {rankType == 'dj' && (
                    <>
                      <p className="myRanking__left--point">
                        <img src={point} srcSet={`${point} 1x, ${point2x} 2x`} className="myRanking__img" />
                        {Util.printNumber(dj)}
                      </p>
                    </>
                  )}

                  {rankType == 'fan' && (
                    <>
                      <p className="myRanking__left--point">
                        <img src={point} srcSet={`${point} 1x, ${point2x} 2x`} className="myRanking__img" />
                        {Util.printNumber(fan)}
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
                        {rankType == 'dj' && (
                          <>
                            <span className="countBox__item">
                              <img src={people} />
                              {Util.printNumber(listeners)}
                            </span>

                            <span className="countBox__item">
                              <img src={like} />
                              {Util.printNumber(likes)}
                            </span>

                            <span className="countBox__item">
                              <img src={time} />
                              {Util.printNumber(broadcast)}
                            </span>
                          </>
                        )}

                        {rankType == 'fan' && (
                          <>
                            <span className="countBox__item">
                              <img src={time} />
                              {Util.printNumber(listen)}
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
                        RoomJoin(roomNo + '')
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
