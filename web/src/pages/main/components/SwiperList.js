import React, {useEffect} from 'react'

import Swiper from 'react-id-swiper'

// global components
// components
// css
import {useHistory} from "react-router-dom";
import {RoomValidateFromClip} from "common/audio/clip_func";
import {useDispatch, useSelector} from "react-redux";

const SwiperList = (props) => {
  const {data, profImgName, type} = props;
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const dispatch = useDispatch();
  const history = useHistory();

  const swiperParams = {
    slidesPerView: 'auto',
  }

  const onClickAction = (item) => {
    if (type === 'top10' || type === 'myStar') {
      if (!globalState.baseData.isLogin) {
        history.push("/login");
      }else{
        history.push(`/profile/${item.memNo}`);
      }
    }else if(type === 'daldungs') {
      RoomValidateFromClip(item.roomNo, dispatch, globalState, history, item.bjNickNm);
    }
  }

  useEffect(() => {
    if (data.length > 0) {
      const swiper = document.querySelector('.top10 .swiper-container')?.swiper;
      swiper?.update();
      swiper?.slideTo(0);
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
      : data.length === 0 &&
      <div className="empty">
        데이터가 없습니다.
      </div>
    }
    </>
  )
}

export default SwiperList
