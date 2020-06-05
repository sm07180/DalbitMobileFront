import React, {useState, useEffect, useContext, useRef} from 'react'
//context
import {Context} from 'context'

import point from './static/point.svg'
import moon from './static/cashmoon_g_s.svg'
import time from './static/time_g_s.svg'
import star from './static/cashstar_g_s.svg'
import people from './static/people_g_s.svg'
import like from './static/like_g_s.svg'
import korea from './static/ico-korea.png'
import korea2x from './static/ico-korea@2x.png'
import live from './static/live.svg'

import Util from 'components/lib/utility.js'

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
              roomNo
            } = item
            let genderName
            let upDownName

            if (upDown[0] === '+') {
              upDownName = `rankingChange__up`
            } else if (upDown[0] === '-' && upDown.length > 1) {
              upDownName = `rankingChange__down`
            } else if (upDown === 'new') {
              upDownName = `rankingChange__new`
            } else {
              upDownName = `rankingChange__stop`
            }

            if (gender === 'm' || gender === 'f') {
              genderName = `genderBox gender-${gender}`
            } else {
              genderName = `genderBox`
            }

            return (
              <div className="myRanking rankingList" key={index}>
                <div className="myRanking__left">
                  <p className="myRanking__left--ranking">{rank}</p>
                  <p className="rankingChange">
                    <span className={upDownName}>
                      <span className="textIndent">{upDown}</span>
                    </span>
                  </p>
                  {rankType == 'dj' && (
                    <>
                      <p className="myRanking__left--point">
                        <img src={point} />
                        {Util.printNumber(dj)}
                      </p>
                    </>
                  )}

                  {rankType == 'fan' && (
                    <>
                      <p className="myRanking__left--point">
                        <img src={point} />
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
                      <p className="nickNameBox">
                        {nickNm}
                        <br />
                        <img src={korea} srcSet={`${korea} 1x, ${korea2x} 2x`} /> <span className={genderName}>{gender}</span>
                        {isSpecial === true && <em className="specialDj">스페셜DJ</em>}
                      </p>
                    </div>
                  </div>

                  <div className="countBox">
                    {rankType == 'dj' && (
                      <>
                        <span className="countBox__item">
                          <img src={star} />
                          {Util.printNumber(gift)}
                        </span>
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
