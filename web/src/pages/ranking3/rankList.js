import Util from 'components/lib/utility.js'
//context
import {Context} from 'context'
import React, {useContext} from 'react'
import moon from './static/cashmoon_g_s.svg'
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
              <div
                className="myRanking rankingList"
                key={index}
                onClick={() => {
                  window.location.href = `/mypage/${memNo}`
                }}>
                <div className="myRanking__left">
                  <p className="myRanking__left--ranking">{rank}</p>
                  <p className="rankingChange">
                    {upDown === 'new' ? (
                      <span className="rankingChange__new">NEW</span>
                    ) : upDown < 0 ? (
                      <span className="rankingChange__up">{Math.abs(upDown)}</span>
                    ) : upDown > 0 ? (
                      <span className="rankingChange__down">{Math.abs(upDown)}</span>
                    ) : (
                      <span className="rankingChange__stop"></span>
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

                <div className="myRanking__right">
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
                          </>
                        )}

                        {rankType == 'fan' && (
                          <>
                            <span className="countBox__item">
                              <img src={moon} />
                              {Util.printNumber(gift)}
                            </span>
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
                    <img src={live} />
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
