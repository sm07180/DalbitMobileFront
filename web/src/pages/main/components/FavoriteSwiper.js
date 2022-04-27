import React, {useContext, useEffect, useMemo} from 'react';

import Swiper from 'react-id-swiper';
// global components
// components
import {useHistory} from "react-router-dom";
import {RoomValidateFromClipMemNo} from "common/audio/clip_func";
import {useDispatch, useSelector} from "react-redux";

const FavoriteSwiper = (props) => {
  const {data, type, pullToRefreshPause, myStarCnt} = props;
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const history = useHistory();
  const common = useSelector(state => state.common);

  const swiperParams = useMemo(() => {
    let tempResult = { slidesPerView: 'auto'}
    return tempResult;
  }, []);

  // myStar 가 방송중일 때
  const goLive = (item) => {
    const memNick = type === 'daldungs' ? item.bj_nickName : item.nickNm
    RoomValidateFromClipMemNo(item.roomNo, item.memNo, dispatch, globalState, history, memNick);
  }
  // myStar 가 방송중이 아닐 때
  const goProfile = (memNo) => {
    if (memNo !== undefined && memNo > 0) {
      history.push(`/profile/${memNo}`)
    }
  };

  const swiperRefresh = () => {
    const swiper = document.querySelector(`.${type} .swiper-container`)?.swiper;
    swiper?.update();
    swiper?.slideTo(0);
  }

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
    <section className='favorites'>
    {data && data.length > 0 &&
      <Swiper {...swiperParams}>
        {data.map((item,index) => {
          return (
            <div key={index}>
              <div className="listColumn">
                {item.roomNo !== "0" ?
                  <div className="photo" onClick={() => {goLive(item)}}>
                    <img src={item['profImg'].thumb292x292 ? item['profImg'].thumb292x292
                      : 'https://image.dalbitlive.com/images/listNone-userProfile.png'} />
                  </div>
                :
                  <div className="photo off" onClick={() => {goProfile(item.memNo)}}>
                    <img src={item['profImg'].thumb292x292 ? item['profImg'].thumb292x292
                      : 'https://image.dalbitlive.com/images/listNone-userProfile.png'} />
                  </div>
                }
                <p>{item.nickNm}</p>
              </div>
            </div>
          )
        })}
        {myStarCnt > 10 &&
          <div>
            <div className="listMoreBox" onClick={() => {
              history.push('/recentstar')
            }}>
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
