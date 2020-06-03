import React, {useState, useEffect, useContext, useRef} from 'react'

import frame49 from '../static/ico_frame_49.png'
import people1 from '../static/people1.png'
import point from '../static/ico-point.png'
import moon from '../static/ico-moon-g-s.png'
import time from '../static/ico-time-g-s.png'
import start from '../static/cashstar_g_s.png'
import people from '../static/people_g_s.png'

//context
import {Context} from 'context'
// {gift !== undefined && gift.toLocaleString()}
const profile = (props) => {

  const context = useContext(Context)
  // const {url, name, memNo, link, myProfile} = props

  const myInfo = props.myProfile;
  const myRankNum =props.list
  return (<>
        {/* {myRankNum && myRankNum.map(item,index => {

        }))} */}
        <div className="myRanking" onClick={() => {window.location.href = link}}>
          <div className="myRanking__left">
            <p className="myRanking__left--title">내 랭킹</p>
            <p className="myRanking__left--now">{myRankNum}</p>
            <p className="rankingChange">
              <span className="rankingChange__up">230</span>
            </p>
            <p className="myRanking__left--point">
              <img src={point} /> 45
            </p>
          </div>

          <div className="myRanking__right">
            <div className="myRanking__rightWrap">
              <div className="thumbBox">
                <img src={frame49} className="thumbBox__frame" />
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
                <img src={moon} /> 4,534
              </span>
              <span className="countBox__item">
                <img src={time}  /> 2,181
              </span>
            </div>
          </div>
        </div>
  </>);
};

export default profile;