import React, {useState, useEffect, useContext, useRef} from 'react'

import point from '../static/ico-point.png'
import moon from '../static/cashmoon_g_s.svg'
import time from '../static/time_g_s.svg'
import start from '../static/cashstar_g_s.svg'
import people from '../static/people_g_s.svg'
import like from '../static/like_g_s.svg'

//context
import {Context} from 'context'

const profile = (props) => {
  const context = useContext(Context)
  const myProfile = props.myProfile
  const myDjRank = props.MyDjRank
  const myFanRank = props.MyFanRank
  const rankType = props.rankType
  const {holder, profImg, grade, level, nickNm} = myProfile

  const makeContents =()=> {
      return (
        <div className="myRanking"
        onClick={() => {window.location.href = `/mypage/profile`}}>

        <div className="myRanking__left">
          <p className="myRanking__left--title">내 랭킹</p>
          <p className="myRanking__left--now">
            {rankType == 'dj' && (<>  {myDjRank.myRank !== undefined && myDjRank.myRank.toLocaleString()}</>)}
            {rankType == 'fan' && (<>  {myFanRank.myRank !== undefined && myFanRank.myRank.toLocaleString()}</>)}
                    </p>
          <p className="rankingChange">
            <span className="rankingChange__up"></span>

            {rankType == 'dj' && (<>
              {
              myDjRank.upDown === 'new' ? (<span className="rankingChange__new">NEW</span>)
              : myDjRank.upDown < 0 ? (<span className="rankingChange__up">{Math.abs(myDjRank.upDown)}</span>) 
              : myDjRank.upDown > 0 ? (<span className="rankingChange__down">{Math.abs(myDjRank.upDown)}</span>)
              : (<span className="rankingChange__stop"></span>)
            }
            </>)}

            {rankType == 'fan' && (<>
              {
              myFanRank.upDown === 'new' ? (<span className="rankingChange__new">NEW</span>)
              : myFanRank.upDown < 0 ? (<span className="rankingChange__up">{Math.abs(myFanRank.upDown)}</span>) 
              : myFanRank.upDown > 0 ? (<span className="rankingChange__down">{Math.abs(myFanRank.upDown)}</span>)
              : (<span className="rankingChange__stop"></span>)
            }
            </>)}
          </p>
          <p className="myRanking__left--point">
          <img src={point} />
          
          {rankType == 'dj' && (<>  {myDjRank.myPoint !== undefined && myDjRank.myPoint.toLocaleString()}</>)}
          {rankType == 'fan' && (<>  {myFanRank.myPoint !== undefined && myFanRank.myPoint.toLocaleString()}</>)}
        
          </p>

        </div>
        <div className="myRanking__right">
          <div className="myRanking__rightWrap">
            <div className="thumbBox">
              <img src={holder} className="thumbBox__frame" />
              {profImg !== undefined && <img src={profImg.thumb336x336} className="thumbBox__pic" />}
              
            </div>

            <div>
              <p className="levelBox levelBox__lv5">
          Lv<strong>{level}.</strong> {grade}
              </p>
          <p className="nickNameBox">{nickNm}</p>
            </div>
          </div>

          <div className="countBox">
              {rankType == 'dj' && (
              <>
              <span className="countBox__item">
                <img src={start} />
                {myDjRank.myGiftPoint !== undefined && myDjRank.myGiftPoint.toLocaleString()}
                </span>
                <span className="countBox__item">
                <img src={people} />
                {myDjRank.myListenerPoint !== undefined && myDjRank.myListenerPoint.toLocaleString()}
                </span>
                <span className="countBox__item">
                <img src={like} />
                {myDjRank.myLikePoint !== undefined && myDjRank.myLikePoint.toLocaleString()}
                </span>
                <span className="countBox__item">
                <img src={time} />
                {myDjRank.myBroadPoint !== undefined && myDjRank.myBroadPoint.toLocaleString()}
                </span>
              </>
              )}

              {rankType == 'fan' && (
              <>
              <span className="countBox__item">
                <img src={moon} />
                {myFanRank.myGiftPoint !== undefined && myFanRank.myGiftPoint.toLocaleString()}
                </span>
                <span className="countBox__item">
                <img src={time} />
                {myFanRank.myListenPoint !== undefined && myFanRank.myListenPoint.toLocaleString()}
                </span>
              </>
              )}
          </div>
        </div>
      </div>
      )
   
  }

  return (<>
       {makeContents()}
  </>);
};

export default profile;