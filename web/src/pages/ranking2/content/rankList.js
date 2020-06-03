import React from 'react'

import live from '../static/ico-circle-live.png'
import point from '../static/point.svg'
import moon from '../static/cashmoon_g_s.svg'
import time from '../static/time_g_s.svg'
import start from '../static/cashstar_g_s.svg'
import like from '../static/like_g_s.svg'
import people from '../static/people_g_s.svg'
import korea from '../static/ico-korea.png'
import female from '../static/ico-female.png'
import male from '../static/ico-male.png'

const rankList = props => {
  // console.log(props.list)
  const RankList = props.rankLists
  const rankType = props.rankType
  
  return (
    <div>
       {RankList && RankList.map((item, index) => {
          const {rank,grade,isSpecial, upDown,profImg,nickNm,gender,gift,broadcast,listeners,likes,listen} = item
          return (
          <div className="myRanking rankingList" key={index}>
            <div className="myRanking__left">
          <p className="myRanking__left--ranking">{rank}</p>
              <p className="rankingChange">
          <span className="rankingChange__up">{upDown}</span>
              </p>
              <p className="myRanking__left--point">
                <img src={point} /> 
              </p>
            </div>
            <div className="myRanking__right">
              <div className="myRanking__rightWrap">
                <div className="thumbBox">
                  <img src={profImg.thumb292x292} className="thumbBox__pic" />
                </div>
                <div>
                  <p className="nickNameBox">
                    {nickNm}<br/>
                    <img src={korea} />
                  {gender == 'm' && (<><img src={male} /></>)}
                  {gender == 'f' && (<><img src={female} /></>)}
                  </p>
                </div>
              </div>

              <div className="countBox">

                {rankType == 'dj' && (
                <>
                <span className="countBox__item">
                  <img src={start} />
                  {gift !== undefined && gift.toLocaleString()}
                  </span>
                  <span className="countBox__item">
                  <img src={people} />
                  {listeners !== undefined && listeners.toLocaleString()}
                  </span>
                  <span className="countBox__item">
                  <img src={like} />
                  {likes !== undefined && likes.toLocaleString()}
                  </span>
                  <span className="countBox__item">
                  <img src={time} />
                  {broadcast !== undefined && broadcast.toLocaleString()}
                  </span>
                </>
                )}

                {rankType == 'fan' && (
                <>
                <span className="countBox__item">
                  <img src={moon} />
                  {gift !== undefined && gift.toLocaleString()}
                  </span>
                  <span className="countBox__item">
                  <img src={time} />
                  {listen !== undefined && listen.toLocaleString()}
                  </span>
                </>
                )}

              </div>

              {isSpecial == 'true' && (
              <div className="liveBox">
                <img src={live} />
                <br />
                LIVE
              </div>
              )}


            </div>
          </div>
          )
        })}
    </div>
  );
};

export default rankList;  