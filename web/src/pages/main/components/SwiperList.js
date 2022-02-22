import React, {useContext, useEffect} from 'react'

import Swiper from 'react-id-swiper'

// global components
// components
// css
import {useHistory} from "react-router-dom";
import {RoomValidateFromClip} from "common/audio/clip_func";
import {Context, GlobalContext} from "context";
import {useSelector} from "react-redux";

const SwiperList = (props) => {
  const {data, profImgName, type, pullToRefreshPause} = props;
  const { globalState } = useContext(GlobalContext);
  const context = useContext(Context);
  const history = useHistory();
  const common = useSelector(state => state.common);

  const swiperParams = {
    slidesPerView: 'auto',
  }

  const onClickAction = (item) => {
    if(type === 'top10') {
      if (!globalState.baseData.isLogin) {
        history.push("/login")
      }else{
        history.push(`/profile/${item.memNo}`);
      }
    }else if(type === 'daldungs' || type === 'favorites') {
      RoomValidateFromClip(item.roomNo, context, history, item.bjNickNm);
    }
  }

  const swiperRefresh = () => {
    const swiper = document.querySelector(`.${type} .swiper-container`)?.swiper;
    swiper?.update();
    swiper?.slideTo(0);
  }

  useEffect(() => {
    if (data.length > 0 && !pullToRefreshPause) { // 데이터 변경될때(탭 이동)
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
              <div className="photo">
                <img src={item[profImgName].thumb150x150 ? item[profImgName].thumb150x150
                  : 'https://image.dalbitlive.com/images/listNone-userProfile.png'} />
                {item.rank && <div className={`rank-${item.rank}`}></div>}
                {item.type_media === 'v' && <div className="video" />}
              </div>
              <p className='userNick'>{item.nickNm ? item.nickNm : item.bj_nickName}</p>
            </div>
          </div>
        )
      })}
    </Swiper>
    }
    </>
  )
}

export default SwiperList
