import React, {useState, useEffect, useContext, useRef} from 'react'
//context
import {Context} from 'context'

import frame49 from './static/ico_frame_49.png'
import frame492x from './static/ico_frame_49@2x.png'
import live from './static/ico-circle-live.png'
import live2x from './static/ico-circle-live@2x.png'
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
          <div className="TopBox">
            {list.map((item, index) => {
              const {gender, gift, grade, nickNm, rank, profImg, level, upDown, listen, listeners, likes, broadcast} = item
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
                <div className="TopBox__item" key={index}>
                  <div className="thumbBox">
                    <img src={frame49} srcSet={`${frame49} 1x, ${frame492x} 2x`} className="thumbBox__frame" />
                    <img src={profImg.thumb120x120} width="50px" className="thumbBox__pic" />
                  </div>

                  <div>
                    <p className={levelName}>
                      Lv<strong>{level}</strong>. {grade}
                    </p>
                    <div className="nickNameBox">
                      {nickNm}
                      <div className="iconBox">
                        <img src={korea} srcSet={`${korea} 1x, ${korea2x} 2x`} /> <span className={genderName}>{gender}</span>
                      </div>
                    </div>
                  </div>

                  <div className="countBox">
                    <span className="countBox__item countBox__item--point">
                      <img src={point} srcSet={`${point} 1x, ${point2x} 2x`} />
                      45
                    </span>
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

                  <div className="medalBox">
                    <p className={rankName}>{rank}</p>
                    <p className="rankingChange">
                      <span className={upDownName}>
                        <span>{upDown}</span>
                      </span>
                    </p>
                  </div>
                  <div className="liveBox">
                    <img src={live} srcSet={`${live} 1x, ${live2x} 2x`} />
                    <br />
                    LIVE
                  </div>
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
