import React from 'react'

import './ranking.scss'

import frame49 from './static/ico_frame_49.png'
import frame492x from './static/ico_frame_49@2x.png'
import people1 from './static/people1.png'
import medalGold from './static/ico-medal-gold.png'
import medalGold2x from './static/ico-medal-gold@2x.png'
import medalSilver from './static/ico-medal-silver.png'
import medalSilver2x from './static/ico-medal-silver@2x.png'
import medalBronze from './static/ico-medal-bronze.png'
import medalBronze2x from './static/ico-medal-bronze@2x.png'
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
import female from './static/ico-female.png'
import female2x from './static/ico-female@2x.png'
import male from './static/ico-male.png'
import male2x from './static/ico-male@2x.png'
import hint from './static/ico-hint.png'
import hint2x from './static/ico-hint@2x.png'

const index = () => {
  return (
    <>
      <div>
        <div className="rankTopBox respansiveBox">
          <div className="rankTab">
            <button className="rankTab__btn">DJ</button>
            <button className="rankTab__btn rankTab__btn--active">팬</button>
          </div>

          <div className="rankTopBox__update">
            16:00 <img src={hint} srcSet={`${hint} 1x, ${hint2x} 2x`} />
          </div>
        </div>

        <div className="todayList">
          <button className="todayList__btn todayList__btn--active">오늘</button>
          <button className="todayList__btn">일간</button>
          <button className="todayList__btn">주간</button>
          <button className="todayList__btn">월간</button>
        </div>

        <div className="myRanking">
          <div className="myRanking__left">
            <p className="myRanking__left--title">내 랭킹</p>
            <p className="myRanking__left--now">1290</p>
            <p className="rankingChange">
              <span className="rankingChange__up">230</span>
            </p>
            <p className="myRanking__left--point">
              <img src={point} srcSet={`${point} 1x, ${point2x} 2x`} /> 45
            </p>
          </div>

          <div className="myRanking__right">
            <div className="myRanking__rightWrap">
              <div className="thumbBox">
                <img src={frame49} srcSet={`${frame49} 1x, ${frame492x} 2x`} className="thumbBox__frame" />
                <img src={people1} className="thumbBox__pic" />
              </div>

              <div>
                <p className="levelBox levelBox__lv5">
                  Lv<strong>49</strong>. 은메달
                </p>
                <p className="nickNameBox">상큼 레몬향기</p>
              </div>
            </div>

            <div className="countBox">
              <span className="countBox__item">
                <img src={moon} srcSet={`${moon} 1x, ${moon2x} 2x`} /> 4,534
              </span>
              <span className="countBox__item">
                <img src={time} srcSet={`${time} 1x, ${time2x} 2x`} /> 2,181
              </span>
            </div>
          </div>
        </div>

        <div className="userRanking">
          <div className="TopBox">
            <div className="TopBox__item">
              <div className="thumbBox">
                <img src={frame49} srcSet={`${frame49} 1x, ${frame492x} 2x`} className="thumbBox__frame" />
                <img src={people1} className="thumbBox__pic" />
              </div>

              <div>
                <p className="levelBox levelBox__lv4">
                  Lv<strong>39</strong>. 황금트로피
                </p>
                <p className="nickNameBox">
                  상큼 레몬향기 <img src={korea} srcSet={`${korea} 1x, ${korea2x} 2x`} />{' '}
                  <img src={female} srcSet={`${female} 1x, ${female2x} 2x`} />
                </p>
              </div>

              <div className="countBox">
                <span className="countBox__item">
                  <img src={point} srcSet={`${point} 1x, ${point2x} 2x`} /> 45
                </span>
                <span className="countBox__item">
                  <img src={moon} srcSet={`${moon} 1x, ${moon2x} 2x`} /> 4,534
                </span>
                <span className="countBox__item">
                  <img src={time} srcSet={`${time} 1x, ${time2x} 2x`} /> 2,181
                </span>
              </div>

              <div className="medalBox">
                <img src={medalGold} srcSet={`${medalGold} 1x, ${medalGold2x} 2x`} />
                <br />
                <p className="rankingChange">
                  <span className="rankingChange__new">NEW</span>
                </p>
              </div>
              <div className="liveBox">
                <img src={live} srcSet={`${live} 1x, ${live2x} 2x`} />
                <br />
                LIVE
              </div>
            </div>

            <div className="TopBox__item">
              <div className="thumbBox">
                <img src={frame49} srcSet={`${frame49} 1x, ${frame492x} 2x`} className="thumbBox__frame" />
                <img src={people1} className="thumbBox__pic" />
              </div>

              <div>
                <p className="levelBox levelBox__lv3">
                  Lv<strong>39</strong>. 황금트로피
                </p>
                <p className="nickNameBox">
                  상큼 레몬향기
                  <br /> <img src={korea} srcSet={`${korea} 1x, ${korea2x} 2x`} />{' '}
                  <img src={female} srcSet={`${female} 1x, ${female2x} 2x`} />
                </p>
              </div>

              <div className="countBox">
                <span className="countBox__item">
                  <img src={point} srcSet={`${point} 1x, ${point2x} 2x`} /> 45
                </span>
                <br />
                <span className="countBox__item">
                  <img src={moon} srcSet={`${moon} 1x, ${moon2x} 2x`} /> 4,534
                </span>
                <span className="countBox__item">
                  <img src={time} srcSet={`${time} 1x, ${time2x} 2x`} /> 2,181
                </span>
              </div>

              <div className="medalBox">
                <img src={medalSilver} srcSet={`${medalSilver} 1x, ${medalSilver2x} 2x`} />
                <br />
                <p className="rankingChange">
                  <span className="rankingChange__down">230</span>
                </p>
              </div>

              <div className="liveBox">
                <img src={live} srcSet={`${live} 1x, ${live2x} 2x`} />
                <br />
                LIVE
              </div>
            </div>

            <div className="TopBox__item">
              <div className="thumbBox">
                <img src={frame49} className="thumbBox__frame" />
                <img src={people1} className="thumbBox__pic" />
              </div>

              <div>
                <p className="levelBox levelBox__lv2">
                  Lv<strong>39</strong>. 황금트로피
                </p>
                <p className="nickNameBox">
                  상큼 레몬향기 <br />
                  <img src={korea} srcSet={`${korea} 1x, ${korea2x} 2x`} />{' '}
                  <img src={female} srcSet={`${female} 1x, ${female2x} 2x`} />
                </p>
              </div>

              <div className="countBox">
                <span className="countBox__item">
                  <img src={point} srcSet={`${point} 1x, ${point2x} 2x`} /> 45
                </span>
                <br />
                <span className="countBox__item">
                  <img src={moon} srcSet={`${moon} 1x, ${moon2x} 2x`} /> 4,534
                </span>
                <span className="countBox__item">
                  <img src={time} srcSet={`${time} 1x, ${time2x} 2x`} /> 2,181
                </span>
              </div>

              <div className="medalBox">
                <img src={medalBronze} srcSet={`${medalBronze} 1x, ${medalBronze2x} 2x`} />
                <br />
                <p className="rankingChange">
                  <span className="rankingChange__stop"></span>
                </p>
              </div>
            </div>
          </div>

          <div className="myRanking rankingList">
            <div className="myRanking__left">
              <p className="myRanking__left--ranking">4</p>
              <p className="rankingChange">
                <span className="rankingChange__down">230</span>
              </p>
              <p className="myRanking__left--point">
                <img src={point} srcSet={`${point} 1x, ${point2x} 2x`} /> 45
              </p>
            </div>

            <div className="myRanking__right">
              <div className="myRanking__rightWrap">
                <div className="thumbBox">
                  <img src={people1} className="thumbBox__pic" />
                </div>

                <div>
                  <p className="nickNameBox">
                    뜻밖의 미모
                    <br />
                    <img src={korea} srcSet={`${korea} 1x, ${korea2x} 2x`} />{' '}
                    <img src={female} srcSet={`${female} 1x, ${female2x} 2x`} />
                    <span className="specialDj">스페셜DJ</span>
                  </p>
                </div>
              </div>

              <div className="countBox">
                <span className="countBox__item">
                  <img src={moon} srcSet={`${moon} 1x, ${moon2x} 2x`} /> 4,534
                </span>
                <span className="countBox__item">
                  <img src={time} srcSet={`${time} 1x, ${time2x} 2x`} /> 2,181
                </span>
              </div>
            </div>
          </div>

          <div className="myRanking rankingList">
            <div className="myRanking__left">
              <p className="myRanking__left--ranking">5</p>
              <p className="rankingChange">
                <span className="rankingChange__up">230</span>
              </p>
              <p className="myRanking__left--point">
                <img src={point} srcSet={`${point} 1x, ${point2x} 2x`} /> 45
              </p>
            </div>

            <div className="myRanking__right">
              <div className="myRanking__rightWrap">
                <div className="thumbBox">
                  <img src={people1} className="thumbBox__pic" />
                </div>

                <div>
                  <p className="nickNameBox">
                    상큼 레몬향기
                    <br />
                    <img src={korea} srcSet={`${korea} 1x, ${korea2x} 2x`} />{' '}
                    <img src={female} srcSet={`${female} 1x, ${female2x} 2x`} />
                  </p>
                </div>
              </div>

              <div className="countBox">
                <span className="countBox__item">
                  <img src={moon} srcSet={`${moon} 1x, ${moon2x} 2x`} /> 4,534
                </span>
                <span className="countBox__item">
                  <img src={time} srcSet={`${time} 1x, ${time2x} 2x`} /> 2,181
                </span>
              </div>

              <div className="liveBox">
                <img src={live} srcSet={`${live} 1x, ${live2x} 2x`} />
                <br />
                LIVE
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default index
