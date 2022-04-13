import React, {useContext, useState, useEffect, useCallback} from 'react'

import Api from 'context/api';
import Lottie from 'react-lottie';
import Swiper from 'react-id-swiper';

import {useHistory, withRouter} from "react-router-dom";
import {getDeviceOSTypeChk} from "common/DeviceCommon";
import {RoomValidateFromClip, RoomValidateFromClipMemNo} from "common/audio/clip_func";
import {RoomJoin} from "context/room";
import {IMG_SERVER} from 'context/config'
import {Context, GlobalContext} from "context";
import LayerPopup from 'components/ui/layerPopup/LayerPopup'
// global components

const TopRanker = (props) => {
  const {data, rankSlct, rankType} = props

  const history = useHistory();
  const context = useContext(Context);
  const gtx = useContext(GlobalContext);

  const [popup, setPopup] = useState(false);
  const [rankSetting, setRankSetting] = useState(false);

  // 스와이퍼
  const swiperParams = {
    slidesPerView: 'auto',
    centeredSlides: true,
    spaceBetween: 16,
    loop: false,
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    initialSlide: 2,
    rebuildOnUpdate: true
  };
  const rankSettingBtn = useCallback((v) => {
    const fetchRankSetting = (set) => {
      const params = {
        isRankData: set,
      };
      Api.postRankSetting(params).then((res) => {
        if (res.result === 'success') {
          context.action.toast({msg: res.message});
        }
      });
    };
    fetchRankSetting(v);
  },[rankSetting]);

  const clickRankSetting = () => {
    context.action.confirm({
      callback: () => {
        setRankSetting(!rankSetting);
        rankSettingBtn(!rankSetting ? true : false);
      },
      msg: `${rankSetting ? "랭킹참여 취소" : "랭킹참여 승인"}`
    });
  };

  const goLive = (roomNo, memNo, nickNm, listenRoomNo) => {
    if (context.token.isLogin === false) {
      context.action.alert({
        msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
        callback: () => {
          history.push('/login')
        }
      })
    } else {
      if (getDeviceOSTypeChk() === 3){
        if(listenRoomNo){
          RoomValidateFromClipMemNo(listenRoomNo,memNo, gtx, history, nickNm);
        } else {
          RoomValidateFromClipMemNo(roomNo,memNo, gtx, history, nickNm);
        }
      } else {
        if (roomNo !== '') {
          RoomJoin({roomNo: roomNo, memNo:memNo,nickNm: nickNm})
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
                return RoomJoin({roomNo: listenRoomNo,memNo:memNo, listener: 'listener'})
              }
            })
          }
        }
      }
    }
  };

  // useEffect(() => {
  //   fetchRankSetting(rankSetting);
  // },[rankSetting]);

  return (
    <React.Fragment>
      <div className="topItems">
        {rankSlct === "FAN" &&
          <button className={`fanSettingBtn ${rankSetting ? 'active': ''}`} onClick={() => clickRankSetting()}>{`${rankSetting ? '랭킹 참여중' : '미참여중'}`}</button>
        }
        <span className='questionMark' onClick={() => setPopup(true)}></span>
      </div>
      {data && data.length > 0 &&    
        <Swiper {...swiperParams}>
          {data.map((list, index) => {
            return (
              <div className='rankingTop3' key={index}>
                <div className='topHeader'>
                  {
                  index === 0 ?
                    rankType === 0 ? `${index + 1}회차` : rankType === 1 ? "어제" : rankType === 2 ? "저번주" : rankType === 3 ? "저번달" : "작년"
                    :
                  index === 1 ?
                    rankType === 0 ? `${index + 1}회차` : rankType === 1 ? "오늘" : rankType === 2 ? "이번주" : rankType === 3 ? "이번달" : "올해"
                    :
                    `${index + 1}회차`
                  } TOP3
                </div>
                <div className='topContent'>
                  {list.map((data,index) => {
                    if (data.isEmpty){
                      return (
                        <div className="ranker" key={index}>
                          <div className="listColumn">
                            <div className="photo">
                              <img src={"https://image.dalbitlive.com/images/listNone-userProfile.png"} alt="" />
                            </div>
                            <div className='rankerNick'>-</div>
                          </div>
                          {rankSlct === "CUPID" &&
                            <div className='cupidWrap'>
                              <div className='cupidHeader'>HONEY</div>
                              <div className='cupidContent'>
                                <div className='cupidThumb'>
                                  <img src={"https://image.dalbitlive.com/images/listNone-userProfile.png"} />
                                </div>
                                <div className='cupidNick'>-</div>
                              </div>
                            </div>
                          }
                        </div>
                      )
                    } else {
                      return (
                        <div className="ranker" key={index}>
                          <div className="listColumn" onClick={() => props.history.push(`/profile/${data.memNo}`)}>
                            <div className="photo">
                              <img src={data.profImg.thumb292x292} alt="" />
                              <div className={`rankerRank index${index + 1}`}></div>
                            </div>
                            <div className='rankerNick'>{data.nickNm}</div>
                          </div>
                          {rankSlct === "CUPID" && data.djProfImg ?
                            <div className='cupidWrap' onClick={() => props.history.push(`/profile/${data.djMemNo}`)}>
                              <div className='cupidHeader'>HONEY</div>
                              <div className='cupidContent'>
                                <div className='cupidThumb'>
                                  <img src={data.djProfImg.thumb292x292} alt={data.nickNm} />
                                </div>
                                <div className='cupidNick'>{data.djNickNm}</div>
                              </div>
                            </div>
                            :
                            <>
                              {
                                data.roomNo &&
                                  <div className='badgeLive' onClick={(e) => {
                                    e.stopPropagation();
                                    goLive(data.roomNo, data.memNo, data.nickNm, data.listenRoomNo);
                                  }}>                                    
                                    <span className='equalizer'>
                                      <Lottie
                                        options={{
                                          loop: true,
                                          autoPlay: true,
                                          path: `${IMG_SERVER}/dalla/ani/equalizer_pink.json`
                                        }}
                                      />
                                    </span>
                                    <span className='liveText'>LIVE</span>
                                  </div>
                              }
                              {/* {
                                data.listenRoomNo !== "" &&
                                  <div className='badgeListener' onClick={(e) => {
                                    e.stopPropagation();
                                    goLive(data.roomNo, data.memNo, data.nickNm, data.listenRoomNo);
                                  }}>                     
                                    <span className='headset'>                          
                                      <Lottie
                                          options={{
                                            loop: true,
                                            autoPlay: true,
                                            path: `${IMG_SERVER}/dalla/ani/ranking_headset_icon.json`
                                          }}
                                        />
                                    </span>      
                                    <span className='ListenerText'>LIVE</span>
                                  </div>                                  
                              } */}
                            </>
                          }
                        </div>
                      )
                    }
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
            rankSlct === "DJ" &&
            <>
              <div className='popTitle'>DJ 랭킹 선정 기준</div>
              <div className='popSubTitle'>
                받은 별, 청취자 수, 받은 좋아요 <br/>(부스터 포함)의 종합 순위입니다.
              </div>
            </>

          }
          {
            rankSlct === "FAN" &&
            <>
              <div className='popTitle'>FAN 랭킹 선정 기준</div>
              <div className='popSubTitle'>
              보낸 달과 보낸 좋아요(부스터 포함)의 <br/>종합 순위입니다.<br/>
              </div>
              <div className='popText'>
              참여중/미참여중 버튼을 눌러,<br/>
              나의 FAN랭킹 참여 상태를 변경할 수 있습니다.
              </div>
            </>

          }
          {
            rankSlct === "CUPID" &&
            <>
              <div className='popTitle'>CUPID 랭킹이란?</div>
              <div className='popSubTitle'>
              보낸 좋아요 개수 (부스터 포함)<br/>1~200위의 순위입니다.
              </div>
              <div className='popText'>
                <span>HONEY</span>(허니)는 랭커로부터 가장 많은 <br/>좋아요 (부스터 포함)를 받은 유저입니다.
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
