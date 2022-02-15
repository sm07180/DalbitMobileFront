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
        history.push(`/profile/${memNo}`);
      }
    }else if(type === 'daldungs') {
      RoomValidateFromClip(item.roomNo, context, history, item.bjNickNm);
    }
  }

  useEffect(() => {
    if (data.length > 0) {
      const swiper = document.querySelector('.top10 .swiper-container').swiper;
      swiper.update();
      swiper.slideTo(0);
    }
  }, [data]);

  return (
    <>
    {data.length > 0 ?
      <Swiper {...swiperParams}>
        {data.map((item,index) => {
          return (
            <div key={index}>
              <div className="listColumn" onClick={() => onClickAction(item)}>
                <div className="photo">
                  <img src={item[profImgName].thumb150x150} />
                  {item.rank && <div className={`rank-${item.rank}`}></div>}
                  {true && <div className="video"></div>}
                </div>
                <p className='userNick'>{item.nickNm ? item.nickNm : item.bj_nickName}</p>
              </div>
            </div>
          )
        })}
      </Swiper>
      : data.length === 0 &&
      <div className="empty">
        데이터가 없습니다.
      </div>
    }
    </>
  )
}

export default SwiperList
