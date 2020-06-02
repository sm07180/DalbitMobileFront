import React, {useState, useEffect, useContext, useRef} from 'react'
//context
import {Context} from 'context'

import point from './static/ico-point.png'
import point2x from './static/ico-point@2x.png'
import moon from './static/ico-moon-g-s.png'
import moon2x from './static/ico-moon-g-s@2x.png'
import time from './static/ico-time-g-s.png'
import time2x from './static/ico-time-g-s@2x.png'
import korea from './static/ico-korea.png'
import korea2x from './static/ico-korea@2x.png'
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
            const {gender, gift, grade, nickNm, rank, profImg, level, upDown, listen, listeners, likes, broadcast, fan, dj} = item
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

            if (gender == 'm' || gender == 'f') {
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
                        <img src={point} srcSet={`${point} 1x, ${point2x} 2x`} />
                        {Util.printNumber(dj)}
                      </p>
                    </>
                  )}

                  {rankType == 'fan' && (
                    <>
                      <p className="myRanking__left--point">
                        <img src={point} srcSet={`${point} 1x, ${point2x} 2x`} />
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
                        <span className="specialDj">스페셜DJ</span>
                      </p>
                    </div>
                  </div>

                  <div className="countBox">
                    {rankType == 'dj' && (
                      <>
                        <span className="countBox__item">
                          <img src={moon} srcSet={`${moon} 1x, ${moon2x} 2x`} />
                          {Util.printNumber(gift)}
                        </span>
                        <span className="countBox__item">
                          <img src={time} srcSet={`${time} 1x, ${time2x} 2x`} />
                          {Util.printNumber(listeners)}
                        </span>

                        <span className="countBox__item">
                          <img src={time} srcSet={`${time} 1x, ${time2x} 2x`} />
                          {Util.printNumber(likes)}
                        </span>

                        <span className="countBox__item">
                          <img src={time} srcSet={`${time} 1x, ${time2x} 2x`} />
                          {Util.printNumber(broadcast)}
                        </span>
                      </>
                    )}

                    {rankType == 'fan' && (
                      <>
                        <span className="countBox__item">
                          <img src={moon} srcSet={`${moon} 1x, ${moon2x} 2x`} />
                          {Util.printNumber(gift)}
                        </span>
                        <span className="countBox__item">
                          <img src={time} srcSet={`${time} 1x, ${time2x} 2x`} />
                          {Util.printNumber(listen)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </>
    )
  }

  return creatList()
}
