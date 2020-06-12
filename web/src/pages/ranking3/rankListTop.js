import Util from 'components/lib/utility.js'
//context
import {Context} from 'context'
import React, {useContext} from 'react'
import point from './static/ico-point.png'
import point2x from './static/ico-point@2x.png'
import like from './static/like_g_s.svg'
import live from './static/live.svg'
import people from './static/people_g_s.svg'
import time from './static/time_g_s.svg'

export default props => {
  //context
  const context = useContext(Context)
  const rankType = props.rankType
  const {list, myMemNo} = props

  console.log(props.myMemNo)

  const creatList = () => {
    return (
      <>
        <div className="userRanking">
          <div className="TopBox">
            {list.map((item, index) => {
              const {
                gender,
                gift,
                grade,
                nickNm,
                rank,
                profImg,
                level,
                upDown,
                listen,
                listeners,
                likes,
                broadcast,
                fan,
                dj,
                roomNo,
                memNo,
                holder
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
                <div
                  className={'TopBox__item ' + `${myMemNo === memNo ? 'active' : ''}`}
                  key={index}
                  onClick={() => {
                    window.location.href = `/mypage/${memNo}`
                  }}>
                  <div className="thumbBox">
                    <img src={holder} className="thumbBox__frame" />
                    <img src={profImg.thumb120x120} className="thumbBox__pic" />
                  </div>

                  <div>
                    <p className={levelName}>
                      Lv{level} {grade}
                    </p>
                    <div className="nickNameBox">
                      <span className="nickName">{nickNm}</span>
                      <div className="iconBox">
                        {/*<img src={korea} srcSet={`${korea} 1x, ${korea2x} 2x`} className="korea-m"/> */}
                        <span className={genderName}>{gender}</span>
                      </div>
                    </div>
                  </div>

                  <div className="countBox">
                    {rankType == 'dj' && (
                      <>
                        <span className="countBox__item countBox__item--point">
                          <img src={point} srcSet={`${point} 1x, ${point2x} 2x`} />
                          {Util.printNumber(dj)}
                        </span>

                        <div className="countBoxInner">
                          {/* <span className="countBox__item">
                            <img src={star} />
                            {Util.printNumber(gift)}
                          </span> */}
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
                        </div>
                      </>
                    )}

                    {rankType == 'fan' && (
                      <>
                        <span className="countBox__item countBox__item--point">
                          <img src={point} />
                          {Util.printNumber(fan)}
                        </span>
                        {/* <span className="countBox__item">
                          <img src={moon} />
                          {Util.printNumber(gift)}
                        </span> */}
                        <span className="countBox__item">
                          <img src={time} />
                          {Util.printNumber(listen)}
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
                        <span className="rankingChange__stop"></span>
                      )}
                    </p>
                  </div>

                  {roomNo !== '' && (
                    <div className="liveBox">
                      <img src={live} />
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
