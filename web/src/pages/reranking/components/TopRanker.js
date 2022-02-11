import React, {useContext, useState} from 'react'

import Swiper from 'react-id-swiper'
import {useHistory, withRouter} from "react-router-dom";
import {getDeviceOSTypeChk} from "common/DeviceCommon";
import {RoomValidateFromClip} from "common/audio/clip_func";
import {RoomJoin} from "context/room";
import {Context, GlobalContext} from "context";
import LayerPopup from 'components/ui/layerPopup/LayerPopup'
// global components

const TopRanker = (props) => {
  const {data, rankSlct, rankType} = props

  const context = useContext(Context);

  const history = useHistory();

  const gtx = useContext(GlobalContext);

  const [popup, setPopup] = useState(false);

  // 스와이퍼
  const swiperParams = {
    slidesPerView: 'auto',
    centeredSlides: true,
    loop: false,
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    rtl: "rtl",
    rebuildOnUpdate: true
  }

  const goLive = (roomNo, nickNm, listenRoomNo) => {
    if (context.token.isLogin === false) {
      context.action.alert({
        msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
        callback: () => {
          history.push('/login')
        }
      })
    } else {
      if (getDeviceOSTypeChk() === 3){
        RoomValidateFromClip(roomNo, gtx, history, nickNm);
      } else {
        if (roomNo !== '') {
          RoomJoin({roomNo: roomNo, nickNm: nickNm})
        } else {
          let alertMsg
          if (isNaN(listenRoomNo)) {
            alertMsg = `${nickNm} 님이 어딘가에서 청취중입니다. 위치 공개를 원치 않아 해당방에 입장할 수 없습니다`
            context.action.alert({
              type: 'alert',
              msg: alertMsg
            })
          } else {
            alertMsg = `해당 청취자가 있는 방송으로 입장하시겠습니까?`
            context.action.confirm({
              type: 'confirm',
              msg: alertMsg,
              callback: () => {
                return RoomJoin({roomNo: listenRoomNo, listener: 'listener'})
              }
            })
          }
        }
      }
    }
  }

  const popOpen = () => {
    setPopup(true);
  }

  return (
    <React.Fragment>
      {data && data.length > 0 &&    
        <Swiper {...swiperParams}>
          {data.map((list, index) => {
            return (
              <div className='rankingTop3' key={index}>
                <div className='topHeader'>{
                index === 0 ?
                  rankType === 0 ? "회차" : rankType === 1 ? "오늘" : rankType === 2 ? "이번주" : rankType === 3 ? "이번달" : "올해"
                :
                  "dd"
                } TOP{list.length}
                  <span className='questionMark'></span>
                </div>
                <div className='topContent'>
                  {list.map((data,index) => {
                    return (
                      <div className="ranker" key={index}>
                        <div className="listColumn" onClick={() => props.history.push(`/profile/${data.memNo}`)}>
                          <div className="photo">
                            <img src={data.profImg.thumb190x190} alt="" />
                            <div className='rankerRank'>{data.rank}</div>
                          </div>
                          <div className='rankerNick'>{data.nickNm}</div>
                        </div>
                        {rankSlct === "LOVER" ?
                          <div className='cupidWrap' onClick={() => props.history.push(`/profile/${data.djMemNo}`)}>
                            <div className='cupidHeader'>CUPID</div>
                            <div className='cupidContent'>
                              <div className='cupidThumb'>
                                <img src={data.djProfImg.thumb190x190} alt={data.nickNm} />
                              </div>
                              <div className='cupidNick'>{data.djNickNm}</div>
                            </div>
                          </div>
                          :
                          <>
                            {data.roomNo && <div className='badgeLive' onClick={(e) => {
                              e.stopPropagation();
                              goLive(data.roomNo, data.nickNm, data.listenRoomNo);
                            }}>LIVE</div>}
                          </>
                        }
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </Swiper>
      }
      <>
      { popup &&
        <LayerPopup setPopup={setPopup}>
          {
            rankType === "dj" &&
            <>
              <div className='popTitle'>DJ 랭킹 선정 기준</div>
              <div className='popSubTitle'>
                받은 별, 청취자 수, 받은 좋아요 <br/>(부스터 포함)의 종합 순위입니다.
              </div>
            </>

          }
          {
            rankType === "fan" &&
            <>
              <div className='popTitle'>FAN 랭킹 선정 기준</div>
              <div className='popSubTitle'>
              보낸 달과 보낸 좋아요(부스터 포함)의 <br/>종합 순위입니다.
              </div>
            </>

          }
          {
            rankType === "lover" &&
            <>
              <div className='popTitle'>LOVER 랭킹이란?</div>
              <div className='popSubTitle'>
              보낸 좋아요 개수 (부스터 포함)<br/>1~200위의 순위입니다.
              </div>
              <div className='popText'>
                <span>CUPID</span>(큐피드)는 랭커로부터 가장 많은 <br/>좋아요 (부스터 포함)를 받은 유저입니다.
              </div>
            </>

          }
        </LayerPopup>
      }
      </>
    </React.Fragment>
  )
}

export default withRouter(TopRanker);
