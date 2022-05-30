import React, {useEffect, useState} from 'react'

import Api from 'context/api';
import Swiper from 'react-id-swiper';

import {useHistory, withRouter} from "react-router-dom";
import {RoomValidateFromClipMemNo, RoomValidateFromListenerFollow,} from "common/audio/clip_func";
import {IMG_SERVER} from 'context/config'
import LayerPopup from 'components/ui/layerPopup/LayerPopup'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";
import {setCache, setRankTopSwiperNum} from "redux/actions/rank";

const TopRanker = (props) => {
  const {data, tab} = props;

  const history = useHistory();
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const rankState = useSelector(state => state.rankCtx)
  const [popup, setPopup] = useState(false);
  const [rankSetting, setRankSetting] = useState();

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
    initialSlide: rankState.rankTopSwiperNum,
    rebuildOnUpdate: true
  };

  // 팬 랭킹참여 버튼
  const fetchRankSetting = (set) => {
    const params = {isRankData: set};
    Api.postRankSetting(params).then((res) => {
      if (res.result === 'success') {
        dispatch(setGlobalCtxMessage({type:'toast',msg: `FAN랭킹 참여 상태를 변경했습니다.`}));
        fetchRankApply();
      }
    });
  };

  // 팬랭킹 참여 여부 값
  const fetchRankApply = () => {
    Api.rankApply().then((res) => {
      if (res.result === 'success') {
        if (res.data.apply_ranking === 1) {
          setRankSetting(true);
        } else {
          setRankSetting(false);
        }
      }
    });
  };

  const clickRankSetting = () => {
    dispatch(setGlobalCtxMessage({
      type: 'confirm',
      callback: () => {
        fetchRankSetting(!rankSetting)
      },
      msg: `${rankSetting ? `<strong>미참여중</strong>으로 설정되어있는 동안 나의 활동이 FAN랭킹에 반영되지 않습니다 변경하시겠습니까?` :
        `지금부터 나의 활동이 FAN랭킹에 반영됩니다. 변경하시겠습니까?`}`
    }));
  };

  // 팀 상세 페이지 이동
  const goTeamDetailPage = (e) => {
    const { teamNo, swiperNum } = e.currentTarget.dataset;
    if (!globalState.token.isLogin) {
      history.push('/login');
    } else if (teamNo !== undefined) {
      dispatch(setRankTopSwiperNum(swiperNum));
      dispatch(setCache(true));
      history.push(`/team/detail/${teamNo}`);
    }
  };

  // 팬랭킹페이지 들어왔을 경우 참여 여부 값
  useEffect(() => {
    if (tab.slct === "fan") fetchRankApply()
  },[tab.slct]);

  return (
    <>
      {/*?(선정) 버튼*/}
      <div className="topItems">
        {globalState.token.isLogin && tab.slct === "fan" &&
        <button className={`fanSettingBtn ${rankSetting ? 'active' : ''}`}
                onClick={() => clickRankSetting()}>{`${rankSetting ? '랭킹 참여중' : '미참여중'}`}</button>
        }
        <span className='questionMark' onClick={() => setPopup(true)}/>
      </div>

      {/*DJ, FAN, CUPID TOP3*/}
      {(data && data.length > 0 && tab.slct !== 'team') &&
      <Swiper {...swiperParams}>
        {data.map((list, index) => {
          let swiperNum = index;
          return (
            <div className='rankingTop3' key={index}>
              <div className='topHeader'>
                {
                  index === 0 ?
                    tab.type === "time" ? `${index + 1}회차` : tab.type === "today" ? "어제" : tab.type === "week" ? "지난주" : tab.type === "month" ? "지난달" : "작년"
                    :
                    index === 1 ?
                      tab.type === "time" ? `${index + 1}회차` : tab.type === "today" ? "오늘" : tab.type === "week" ? "이번주" : tab.type === "month" ? "이번달" : "올해"
                      :
                      `${index + 1}회차`
                } TOP3
              </div>
              <div className='topContent'>
                {list.map((data, index) => {
                  if (data.isEmpty) {
                    return (
                      <div className="ranker" key={index}>
                        <div className="listColumn">
                          <div className="photo">
                            <img src={"https://image.dallalive.com/images/listNone-userProfile.png"} alt=""/>
                          </div>
                          <div className='rankerNick'>-</div>
                        </div>
                        {tab.slct === "cupid" &&
                        <div className='cupidWrap'>
                          <div className='cupidHeader'>HONEY</div>
                          <div className='cupidContent'>
                            <div className='cupidThumb'>
                              <img src={"https://image.dallalive.com/images/listNone-userProfile.png"}/>
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
                        <div className="listColumn" onClick={() => {
                          dispatch(setRankTopSwiperNum(swiperNum));
                          dispatch(setCache(true));
                          history.push(`/profile/${data.memNo}`)
                        }}>
                          <div className="photo">
                            <img src={data.profImg.thumb292x292} alt=""/>
                            <div className={`rankerRank index${index + 1}`}/>
                          </div>
                          <div className='rankerNick'>{data.nickNm}</div>
                        </div>
                        {
                          tab.slct === "cupid" && data.djProfImg &&
                          <div className='cupidWrap' onClick={() => {
                            dispatch(setRankTopSwiperNum(swiperNum));
                            dispatch(setCache(true));
                            history.push(`/profile/${data.djMemNo}`)
                          }}>
                            <div className='cupidHeader'>HONEY</div>
                            <div className='cupidContent'>
                              <div className='cupidThumb'>
                                <img src={data.djProfImg.thumb292x292} alt={data.nickNm}/>
                              </div>
                              <div className='cupidNick'>{data.djNickNm}</div>
                            </div>
                          </div>
                        }
                        <>
                          {
                            !data.listenRoomNo && data.roomNo &&
                            <div className='badgeLive' onClick={(e) => {
                              e.stopPropagation();
                              RoomValidateFromClipMemNo(data.roomNo, data.memNo, dispatch, globalState, history, data.nickNm);
                            }}>
                              <span className='equalizer'>
                                <img src={`${IMG_SERVER}/ranking/dalla/ico_equalizer.gif`} style={{height:"11px", width:"12px"}}/>
                              </span>
                              <span className='liveText'>LIVE</span>
                            </div>
                          }
                          {
                            !data.roomNo && data.listenRoomNo && data.listenOpen !== 2 &&
                            <div className='badgeListener' onClick={(e) => {
                              e.stopPropagation();
                              RoomValidateFromListenerFollow({
                                memNo: data.memNo,
                                history,
                                globalState,
                                dispatch,
                                nickNm: data.nickNm,
                                listenRoomNo: data.listenRoomNo
                              });
                            }}>
                                <span className='headset'>
                                  <img src={`${IMG_SERVER}/ranking/dalla/ico_headset.gif`} style={{height:"11px", width:"12px"}}/>
                                </span>
                              <span className='ListenerText'>LIVE</span>
                            </div>
                          }
                        </>
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

      {/*TEAM TOP3*/}
      {data && data.length > 0 && tab.slct === 'team' &&
      <Swiper {...swiperParams}>
        {data.map((list, index) => {
          let swiperNum = index;
          return (<div className='rankingTop3' key={index}>
            <div className='topHeader'>{(index === 0 && data.length > 1) ? '지난주' : '이번주'} TOP3</div>
            <div className='topContent'>
              {list.map((value, index) => {
                if (value.isEmpty) {
                  return (<div className="ranker" key={index}>
                    <div className="listColumn none" data-type={index}/>
                  </div>);
                }
                return (
                  <div className="ranker" key={index} data-team-no={value.team_no} data-swiper-num={swiperNum} onClick={goTeamDetailPage}>
                    <div className="listColumn" data-type={index}>
                      <div className="teamWrapBox">
                        <div className="teamSymbol">
                          <img src={`${IMG_SERVER}/team/parts/B/${value.team_bg_code}.png`} alt=""/>
                          <img src={`${IMG_SERVER}/team/parts/E/${value.team_edge_code}.png`} alt=""/>
                          <img src={`${IMG_SERVER}/team/parts/M/${value.team_medal_code}.png`} alt=""/>
                        </div>
                        <div className={`rankerRank index${index + 1}`}/>
                      </div>
                      <div className='rankerNick'>{value.team_name}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>);
        })}
      </Swiper>
      }

      {/*랭킹 선정기준 팝업*/}
      {popup &&
      <LayerPopup setPopup={setPopup}>
        {
          tab.slct === "dj" &&
          <>
            <div className='popTitle'>DJ 랭킹 선정 기준</div>
            <div className='popSubTitle'>받은 별, 청취자 수, 받은 좋아요 <br/>(부스터 포함)의 종합 순위입니다.</div>
          </>
        }
        {
          tab.slct === "fan" &&
          <>
            <div className='popTitle'>FAN 랭킹 선정 기준</div>
            <div className='popSubTitle'>보낸 달과 보낸 좋아요(부스터 포함)의 <br/>종합 순위입니다.<br/></div>
            <div className='popText'>참여중/미참여중 버튼을 눌러,<br/>나의 FAN랭킹 참여 상태를 변경할 수 있습니다.</div>
          </>
        }
        {
          tab.slct === "cupid" &&
          <>
            <div className='popTitle'>CUPID 랭킹이란?</div>
            <div className='popSubTitle'>보낸 좋아요 개수 (부스터 포함)<br/>1~200위의 순위입니다.</div>
            <div className='popText'>
              <span>HONEY</span>(허니)는 랭커로부터 가장 많은 <br/>좋아요 (부스터 포함)를 받은 유저입니다.
            </div>
          </>
        }
        {
          tab.slct === "team" &&
          <>
            <div className='popTitle'>TEAM 랭킹 선정 기준</div>
            <div className='popSubTitle'>선물한 달(부스터 포함), 받은 별(부스터 포함),<br/> 신규팬, 방송 시간의 종합 순위입니다.</div>
          </>
        }
      </LayerPopup>
      }

    </>
  )
};

export default withRouter(TopRanker);