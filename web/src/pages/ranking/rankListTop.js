import React from 'react'
import {useHistory} from 'react-router-dom'

import {RoomJoin} from 'context/room'
import Util from 'components/lib/utility.js'

//static
import like from './static/like_g_s.svg'
import live from './static/live.svg'
import people from './static/people_g_s.svg'
import time from './static/time_g_s.svg'
import StarCountIcon from './static/circle_star_s.png'

// constant
import {RANK_TYPE} from './constant'

export default (props) => {
  const history = useHistory()

  const {list, myMemNo, rankType, dateType} = props

  const creatList = () => {
    return (
      <>
        <div className="userRanking">
          <div className="TopBox">
            {list.map((item, index) => {
              const {
                gender,

                nickNm,
                rank,
                profImg,
                level,
                upDown,
                listenPoint,
                listenerPoint,
                goodPoint,
                broadcastPoint,
                badgeSpecial,
                roomNo,
                memNo,
                holder,
                starCnt
              } = item

              let rankName
              let genderName
              let upDownName
              let levelName

              if (rank == 1 || rank == 2 || rank == 3) {
                rankName = `medal medalBox--top${rank}`
              }
              if (gender == 'm' || gender == 'f') {
                genderName = `genderBox gender-${gender}`
              } else {
                genderName = `genderBox`
              }

              if (upDown[0] === '+') {
                upDownName = `rankingChange__up`
              } else if (upDown[0] === '-' && upDown.length > 1) {
                upDownName = `rankingChange__down`
              } else if (upDown === 'new') {
                upDownName = `rankingChange__new`
              } else {
                upDownName = `rankingChange__stop`
              }

              if (level === 0) {
                levelName = `levelBox levelBox__lv0`
              } else if (level >= 1 && level <= 10) {
                levelName = `levelBox levelBox__lv1`
              } else if (level >= 11 && level <= 20) {
                levelName = `levelBox levelBox__lv2`
              } else if (level >= 21 && level <= 30) {
                levelName = `levelBox levelBox__lv3`
              } else if (level >= 31 && level <= 40) {
                levelName = `levelBox levelBox__lv4`
              } else if (level >= 41 && level <= 50) {
                levelName = `levelBox levelBox__lv5`
              }

              return (
                <div className={'TopBox__item ' + `${myMemNo === memNo ? 'active' : ''}`} key={index}>
                  <div
                    className="thumbBox"
                    onClick={() => {
                      history.push(`/profile/${memNo}`)
                    }}>
                    <img src={holder} className="thumbBox__frame" />
                    <img src={profImg.thumb120x120} className="thumbBox__pic" />
                  </div>

                  <div
                    onClick={() => {
                      history.push(`/mypage/${memNo}`)
                    }}>
                    {/* <p className={levelName}>
                      Lv{level} {grade}
                    </p> */}
                    <div className="nickNameBox">
                      <span className="nickName">{nickNm}</span>
                      <div className="iconBox">
                        {/*<img src={korea} srcSet={`${korea} 1x, ${korea2x} 2x`} className="korea-m"/> */}
                        <span className={genderName}>{gender}</span>
                        {badgeSpecial > 0 && <em className="specialDj">스페셜DJ</em>}
                      </div>
                    </div>
                  </div>

                  <div
                    className="countBox"
                    onClick={() => {
                      history.push(`/mypage/${memNo}`)
                    }}>
                    {rankType == RANK_TYPE.DJ && (
                      <>
                        {/* <span className="countBox__item countBox__item--point">
                          <img src={point} srcSet={`${point} 1x, ${point2x} 2x`} />
                          {Util.printNumber(djPoint)}
                        </span> */}

                        {/* <span className="countBox__item">
                            <img src={star} />
                            {Util.printNumber(gift)}
                          </span> */}
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

                    {rankType == RANK_TYPE.FAN && (
                      <>
                        {/* <span className="countBox__item countBox__item--point">
                          <img src={point} />
                          {Util.printNumber(fanPoint)}
                        </span> */}
                        {/* <span className="countBox__item">
                          <img src={moon} />
                          {Util.printNumber(gift)}
                        </span> */}
                        <span className="countBox__item">
                          <img src={StarCountIcon} width={16} />
                          <em className="count">{Util.printNumber(starCnt)}</em>
                        </span>

                        <span className="countBox__item">
                          <img src={time} />
                          <em className="count">{Util.printNumber(listenPoint)}</em>
                        </span>
                      </>
                    )}
                  </div>

                  <div className="medalBox">
                    <p className={rankName}>{rank}</p>
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
                  </div>

                  {roomNo !== '' && (
                    <div className="liveBox">
                      <img
                        src={live}
                        onClick={() => {
                          RoomJoin({roomNo: roomNo, nickNm: nickNm})
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
        </div>
      </>
    )
  }

  return creatList()
}
