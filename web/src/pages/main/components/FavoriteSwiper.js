import React, {useCallback, useEffect, useMemo} from 'react';

import Swiper from 'react-id-swiper';

import {useHistory} from "react-router-dom";
import {RoomValidateFromClipMemNo} from "common/audio/clip_func";
import {useDispatch, useSelector} from "react-redux";

const FavoriteSwiper = (props) => {
  const {data, swiperRefresh, pullToRefreshPause, myStarCnt} = props;
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const history = useHistory();
  const common = useSelector(state => state.common);

  // 스와이퍼 포토 내부 컴포넌트
  const SwiperPhotoComponent = useCallback((props) => {
    const {list} = props;
    // myStar 가 방송중일 때
    const goLive = (item) => {
      RoomValidateFromClipMemNo(item.roomNo, item.memNo, dispatch, globalState, history, item.nickNm);
    }
    // myStar 가 방송중이 아닐 때
    const goProfile = (memNo) => {
      if (memNo !== undefined && memNo > 0) history.push(`/profile/${memNo}`)
    }
    return (
      <div className="listColumn">
        <div
          className={`photo ${list.roomNo !== "0" ? "" : "off"}`}
          onClick={() => {
            if (list.roomNo !== "0") goLive(list)
            else goProfile(list.memNo)
          }}>
          <img src={list['profImg'] ?
            list['profImg'].thumb292x292
            :
            'https://image.dalbitlive.com/images/listNone-userProfile.png'}
          />
        </div>
        <p>{list.nickNm}</p>
      </div>
    )
  }, []);
  
  // 스와이퍼 리플레쉬 액션
  const swiperParams = useMemo(() => {
    let tempResult = { slidesPerView: 'auto'}
    return tempResult;
  }, []);

  useEffect(() => {
    if (!pullToRefreshPause) { // 데이터 변경될때(탭 이동)
      swiperRefresh();
    }
  }, [pullToRefreshPause]);

  useEffect(() => {
    if(common.isRefresh && data.length > 0) { // refresh 될때
      swiperRefresh();
    }
  }, [common.isRefresh]);

  return (
    <section className="favorites">
    {data && data.length > 0 &&
      <Swiper {...swiperParams}>
      {data.map((item,index) => {
        return (
          <div key={index}>
            <SwiperPhotoComponent list={item} />
          </div>
        )
      })}
      {myStarCnt > 10 &&
        <div>
          <div className="listMoreBox" onClick={() => {history.push('/recentstar')}}>
            +{myStarCnt - 10}
          </div>
        </div>
      }
      </Swiper>
    }
    </section>
  )
}

export default FavoriteSwiper;
