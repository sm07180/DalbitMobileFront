import React, {useContext, useState, useEffect, useMemo} from 'react'

import Swiper from 'react-id-swiper'
import Lottie from 'react-lottie'

// global components
// components
// css
import {useHistory} from "react-router-dom";
import {RoomValidateFromClip, RoomValidateFromClipMemNo} from "common/audio/clip_func";
import {Context, GlobalContext} from "context";
import {useSelector} from "react-redux";
import {IMG_SERVER} from 'context/config'

const SwiperList = (props) => {

  const {data, profImgName, type, pullToRefreshPause, topRankType} = props;
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

  const onClickAction = (item) => {
    if(type === 'top10') {
      if (!globalState.baseData.isLogin) {
        history.push("/login")
      }else{
        history.push(`/profile/${item.memNo}`);
      }
    }else if(type === 'daldungs' || type === 'favorites') {
      const memNick = type === 'daldungs' ? item.bj_nickName : item.nickNm
      RoomValidateFromClipMemNo(item.roomNo, item.memNo,context, history, memNick);
    }
  }

  const swiperRefresh = () => {
    const swiper = document.querySelector(`.${type} .swiper-container`)?.swiper;
    swiper?.update();
    swiper?.slideTo(0);
  }

  // 팀 상세 페이지 이동
  const goTeamDetailPage = (e) => {
    const { teamNo } = e.currentTarget.dataset;

    if (teamNo !== undefined) {
      history.push(`/team/detail/${teamNo}`);
    };
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
    <>
    {data && data.length > 0 &&
    <Swiper {...swiperParams}>
      {topRankType !== 'TEAM' && data.map((item,index) => {
        return (
          <div key={index}>
            <div className="listColumn" onClick={() => onClickAction(item)}>
              <div className="photo">
                <img src={item[profImgName].thumb292x292 ? item[profImgName].thumb292x292
                  : 'https://image.dalbitlive.com/images/listNone-userProfile.png'} />
                {item.rank && <div className={`rank-${item.rank}`}></div>}
                {
                  item.roomNo &&
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
                {item.type_media === 'v' && <div className="video" />}
              </div>
              <p className='userNick'>{item.nickNm ? item.nickNm : item.bj_nickName}</p>
            </div>
          </div>
        )
      })}


      {topRankType === 'TEAM' && data.map((list, index) => {
        return (
          <div key={index}>
            <div className="listColumn" data-team-no={list.team_no} onClick={goTeamDetailPage}>
              <div className="teamSymbol">
                <img src={`${IMG_SERVER}/team/parts/E/${list.team_bg_code}.png`} alt="" />
                <img src={`${IMG_SERVER}/team/parts/B/${list.team_edge_code}.png`} alt="" />
                <img src={`${IMG_SERVER}/team/parts/M/${list.team_medal_code}.png`} alt="" />
                <div className={`rank-${index + 1}`}></div>
              </div>
              <span className="nick">{list.team_name}</span>
            </div>
          </div>
        );
      })}
    </Swiper>
    }
    </>
  )
}

export default SwiperList
