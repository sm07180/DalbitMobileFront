import React, {useContext, useEffect, useMemo} from 'react';

import Swiper from 'react-id-swiper';
import Lottie from 'react-lottie';

import {useHistory} from "react-router-dom";
import {Context, GlobalContext} from "context";
import {IMG_SERVER} from 'context/config';
import {RoomValidateFromClipMemNo, RoomValidateFromListenerFollow,} from "common/audio/clip_func";
import {useSelector} from "react-redux";

const ToptenSwiper = (props) => {
  const {data, type, pullToRefreshPause, topRankType, children} = props;
  const { globalState } = useContext(GlobalContext);
  const context = useContext(Context);
  const history = useHistory();
  const common = useSelector(state => state.common);
  const isDesktop = useSelector((state)=> state.common.isDesktop)
  let locationStateHistory = useHistory();

  const swiperParams = useMemo(() => {
    let tempResult = { slidesPerView: 'auto' }
    if (isDesktop) {
      tempResult.navigation = {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      };
    }
    return tempResult;
  }, []);
  
  /* NOW TOP 10 Link */
  const nowTopLink = () => {
    if (topRankType === 'DJ') {
      history.push({
        pathname: '/rank',
        state: {tabState: 'time'}
      })
    } else {
      history.push('/rank')
    }
  };

  // 프로필 상세 페이지 이동
  const onClickAction = (item) => {
    if (!globalState.baseData.isLogin) {
      history.push("/login")
    } else {
      history.push(`/profile/${item.memNo}`);
    }
  };
  // 팀 상세 페이지 이동
  const goTeamDetailPage = (e) => {
    const { teamNo } = e.currentTarget.dataset;

    if (teamNo !== undefined) {
      history.push(`/team/detail/${teamNo}`);
    };
  };

  const swiperRefresh = () => {
    const swiper = document.querySelector(`.${type} .swiper-container`)?.swiper;
    swiper?.update();
    swiper?.slideTo(0);
  };

  useEffect(() => {
    if (data?.length > 0 && !pullToRefreshPause) { // 데이터 변경될때(탭 이동)
      swiperRefresh();
    }
  }, [data, pullToRefreshPause]);

  useEffect(() => {
    if(common.isRefresh && data.length > 0) { // refresh 될때
      swiperRefresh();
    }
  }, [common.isRefresh]);

  return (
    <section className='top10'>
      <div className="cntTitle">
        <h2 onClick={nowTopLink}>🏆 NOW TOP 10 &nbsp;&gt;</h2>
        {children}
      </div>
      {data && data.length > 0 &&
      <Swiper {...swiperParams}>
        {topRankType !== 'TEAM' && data.map((item,index) => {
          return (
            <div key={index}>
              <div className="listColumn" onClick={() => onClickAction(item)}>
                <div className="photo">
                  <img src={item.profImg && item.profImg.thumb292x292 ? 
                    item.profImg.thumb292x292
                    :
                    'https://image.dalbitlive.com/images/listNone-userProfile.png'
                  }/>
                  {item.rank && <div className={`rank-${item.rank}`}></div>}
                  {!item.listenRoomNo && item.roomNo &&
                    <div className='livetag' onClick={(e) => {
                      e.stopPropagation();
                      RoomValidateFromClipMemNo(item.roomNo, item.memNo,context, locationStateHistory, item.nickNm);
                    }}>
                      <Lottie
                        options={{
                          loop: true,
                          autoPlay: true,
                          path: `${IMG_SERVER}/dalla/ani/live_icon_ranking.json`
                        }}
                      />
                    </div>
                  }
                  {!item.roomNo && item.listenRoomNo && item.listenOpen !== 2 &&
                    <div className='listenertag' onClick={(e) => {
                      e.stopPropagation();
                      RoomValidateFromListenerFollow({
                        memNo:item.memNo, history:locationStateHistory, context, nickNm:item.nickNm, listenRoomNo:item.listenRoomNo
                      });
                    }}>
                      <Lottie
                        options={{
                          loop: true,
                          autoPlay: true,
                          path: `${IMG_SERVER}/dalla/ani/main_headset_icon.json`
                        }}
                      />
                    </div>
                  }
                  {item.type_media === 'v' && <div className="video" />}
                </div>
                <p>{item.nickNm ? item.nickNm : item.bj_nickName}</p>
              </div>
            </div>
          )
        })}

        {topRankType === 'TEAM' && data.map((list, index) => {
          return (
            <div key={index}>
              <div className="listColumn" data-team-no={list.team_no} onClick={goTeamDetailPage}>
                <div className="teamSymbol">
                  <img src={`${IMG_SERVER}/team/parts/B/${list.team_bg_code}.png`} alt="" />
                  <img src={`${IMG_SERVER}/team/parts/E/${list.team_edge_code}.png`} alt="" />
                  <img src={`${IMG_SERVER}/team/parts/M/${list.team_medal_code}.png`} alt="" />
                  <div className={`rank-${index + 1}`}></div>
                </div>
                <p>{list.team_name}</p>
              </div>
            </div>
          );
        })}
      </Swiper>
      }
    </section>
  )
}

export default ToptenSwiper;
