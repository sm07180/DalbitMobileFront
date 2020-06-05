import React from 'react'

import people1 from '../static/people1.png'
import medalGold from '../static/ico-medal-gold.png'
import medalSilver from '../static/ico-medal-silver.png'
import medalBronze from '../static/ico-medal-bronze.png'

import live from '../static/ico-circle-live.png'
import frame49 from '../static/ico_frame_49.png'
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
  const RankList = props.rankLists
  const rankType = props.rankType

    return (
    <div className="TopBox">
       {RankList && RankList.map((item, index) => {

          const {rank,grade,dj,fan,holder, memNo, isSpecial,upDown,profImg,nickNm,gender,gift,broadcast,listeners,likes,listen,level} = item
          return (

            <div className="TopBox__item" key={index} onClick={() => {window.location.href = `/mypage/${memNo}`}}>
              <div className="thumbBox">
              {rank == '1' && (<>
                <img src={holder}className="thumbBox__frame" />
                <img src={profImg.thumb292x292} className="thumbBox__pic" />
              </>)}

              {rank == '2' && (<>
                <img src={holder}className="thumbBox__frame thumbBox__frame--small" />
                <img src={profImg.thumb292x292} className="thumbBox__pic thumbBox__pic--small" />
              </>)}

              {rank == '3' && (<>
                <img src={holder}className="thumbBox__frame thumbBox__frame--small" />
                <img src={profImg.thumb292x292} className="thumbBox__pic thumbBox__pic--small" />
              </>)}

              </div>
              <div>
              {rank == '1' && (<>
                <p className="levelBox levelBox__lv1">
              Lv<b>{level}.aaaaa</b> {grade}
                </p>
              </>)}
              {rank == '2' && (<>
                <p className="levelBox levelBox__lv2">
              Lv<b>{level}.aaa</b> {grade}
                </p>
              </>)}
              {rank == '3' && (<>
                <p className="levelBox levelBox__lv3">
              Lv<b className="levelBox__bold">{level}.dddd</b> {grade}
                </p>
              </>)}
                <p className="nickNameBox">
                  {nickNm} 
                  {gender == 'm' && (<><img src={male} /></>)}
                  {gender == 'f' && (<><img src={female} /></>)}
                </p>
              </div>
              <div className="countBox">
              {rankType == 'dj' && (
                <>

                  <span className="countBox__item">
                  <img src={point} />
                  {dj !== undefined && dj.toLocaleString()}
                  </span>

                  {rank == '2' && (<><br/> </>)}
                  {rank == '3' && (<><br/> </>)}

                <span className="countBox__item">
                  <img src={start} />
                  {gift !== undefined && gift.toLocaleString()}
                  </span>
                  <span className="countBox__item">
                  <img src={people} />
                  {listeners !== undefined && listeners.toLocaleString()}
                  </span>

                  {rank == '2' && (<><br/> </>)}
                  {rank == '3' && (<><br/> </>)}

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
                <img src={point} />
                {fan !== undefined && fan.toLocaleString()}       
                </span>

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

              <div className="medalBox">
              {rank == '1' && (<><img src={medalGold} /> </>)}
              {rank == '2' && (<><img src={medalSilver} /> </>)}
              {rank == '3' && (<><img src={medalBronze} /> </>)}     

                <br />
                <p className="rankingChange">
                {
                upDown === 'new' ? (<span className="rankingChange__new">NEW</span>)
                : upDown < 0 ? (<span className="rankingChange__up">{Math.abs(upDown)}</span>) 
                : upDown > 0 ? (<span className="rankingChange__down">{Math.abs(upDown)}</span>)
                : (<span className="rankingChange__stop"></span>)
              }
                </p>
              </div>


              {isSpecial == 'true' && (<>
                <div className="liveBox">
                <img src={live}  />
                <br />
                LIVE
              </div>
               </>)}  
              

            </div>
        
          )
        })}
    </div>
  );
};

export default rankList;  