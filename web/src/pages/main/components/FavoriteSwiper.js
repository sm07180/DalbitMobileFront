import React, {useContext, useEffect, useMemo} from 'react'

import Swiper from 'react-id-swiper'

// global components
// components
// css
import {useHistory} from "react-router-dom";
import {RoomValidateFromClip, RoomValidateFromClipMemNo} from "common/audio/clip_func";
import {Context, GlobalContext} from "context";
import {useSelector} from "react-redux";

const SwiperList = (props) => {

  const {data, profImgName, type, pullToRefreshPause, myStarCnt} = props;
  const { globalState } = useContext(GlobalContext);
  const context = useContext(Context);
  const history = useHistory();
  const common = useSelector(state => state.common);
  const isDesktop = useSelector((state)=> state.common.isDesktop)
  let locationStateHistory = useHistory();

  const swiperParams = useMemo(() => {
    let tempResult = { slidesPerView: 'auto'}
    if (isDesktop) {
      tempResult.navigation = {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      };
    }
    return tempResult;
  }, []);

  const goLive = (item) => {
    const memNick = type === 'daldungs' ? item.bj_nickName : item.nickNm
    RoomValidateFromClipMemNo(item.roomNo, item.memNo, context, history, memNick);
  }

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

  const goProfile = (memNo) => {
    if (memNo !== undefined && memNo > 0) {
      history.push(`/profile/${memNo}`)
    }
  }

  return (
    <>
    {data && data.length > 0 &&
    <Swiper {...swiperParams}>
      {data.map((item,index) => {
        return (
          <div key={index}>
            <div className="listColumn">
              {item.roomNo !== "0" ?
                <div className="photo" onClick={() => {goLive(item)}}>
                  <img src={item[profImgName].thumb292x292 ? item[profImgName].thumb292x292
                    : 'https://image.dalbitlive.com/images/listNone-userProfile.png'} />
                </div>
               :
                <div className="photo off" onClick={() => {goProfile(item.memNo)}}>
                  <img src={item[profImgName].thumb292x292 ? item[profImgName].thumb292x292
                    : 'https://image.dalbitlive.com/images/listNone-userProfile.png'} />
                </div>
              }
              <p className='userNick'>{item.nickNm ? item.nickNm : item.bj_nickName}</p>
            </div>
          </div>
        )
      })}
      {myStarCnt > 10 &&
        <div className='listColumn' onClick={() => {
          history.push('/recentstar')
        }}>
          <div className="listMoreBox">
            <div className="listMore">
              +{myStarCnt - 10}
            </div>
          </div>
        </div>
      }
    </Swiper>
    }
    </>
  )
}

export default SwiperList;
