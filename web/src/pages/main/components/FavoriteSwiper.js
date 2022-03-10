import React, {useContext, useState, useEffect, useMemo} from 'react'

import Swiper from 'react-id-swiper'
import Lottie from 'react-lottie'

// global components
// components
// css
import {useHistory} from "react-router-dom";
import {RoomValidateFromClip} from "common/audio/clip_func";
import {Context, GlobalContext} from "context";
import {useSelector} from "react-redux";
import {IMG_SERVER} from 'context/config'

const SwiperList = (props) => {

  const {data, profImgName, type, pullToRefreshPause} = props;
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
    const memNick = type === 'daldungs' ? item.bj_nickName : item.nickNm
    RoomValidateFromClip(item.roomNo, context, history, memNick);
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

  return (
    <>
    {data && data.length > 0 &&
    <Swiper {...swiperParams}>
      {data.map((item,index) => {
        return (
          <div key={index}>
            <div className="listColumn" onClick={() => onClickAction(item)}>
              {item.roomNo ?
                <div className="photo">
                  <img src={item[profImgName].thumb292x292 ? item[profImgName].thumb292x292
                    : 'https://image.dalbitlive.com/images/listNone-userProfile.png'} />
                </div>
               :
                <div className="photo off">
                  <img src={item[profImgName].thumb292x292 ? item[profImgName].thumb292x292
                    : 'https://image.dalbitlive.com/images/listNone-userProfile.png'} />
                </div>
              }
              <p className='userNick'>{item.nickNm ? item.nickNm : item.bj_nickName}</p>
            </div>
          </div>
        )
      })}
      <div className='listColumn' onClick={()=>{history.push('/recentstar')}}>
        <div className="listMore">
          +24
        </div>
      </div>
    </Swiper>
    }
    </>
  )
}

export default SwiperList
