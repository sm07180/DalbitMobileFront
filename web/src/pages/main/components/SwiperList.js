import React, {useContext, useEffect} from 'react'

import Swiper from 'react-id-swiper'

// global components
// components
// css
import {useHistory} from "react-router-dom";
import {RoomValidateFromClip} from "common/audio/clip_func";
import {Context, GlobalContext} from "context";

const SwiperList = (props) => {
  const {data, profImgName, type} = props;
  const { globalState, globalAction } = useContext(GlobalContext);
  const context = useContext(Context);
  const history = useHistory();

  const swiperParams = {
    slidesPerView: 'auto',
  }

  const onClickAction = (item) => {
    if(type === 'top10' || type === 'myStar') {
      if (!globalState.baseData.isLogin) {
        history.push("/login");
      }else{
        history.push(`/profile/${item.memNo}`);
      }
    }else if(type === 'daldungs') {
      RoomValidateFromClip(item.roomNo, context, history, item.bjNickNm);
    }
  }

  useEffect(() => {
    if (data.length > 0) {
      const swiper = document.querySelector('.favorites .swiper-container')?.swiper;
      swiper?.update();
      swiper?.slideTo(0);
    }
  }, [data]);

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
