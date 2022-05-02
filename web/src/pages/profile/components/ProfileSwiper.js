import React, {useEffect, useRef} from 'react';

import Lottie from 'react-lottie'
import Swiper from 'react-id-swiper'

import './profileSwiper.scss'
import {
  RoomValidateFromListenerFollow,
  RoomValidateFromProfile
} from "common/audio/clip_func";
import {IMG_SERVER} from 'context/config';
import {useHistory} from "react-router-dom";
import {setCommonPopupOpenData} from "redux/actions/common";
import {useDispatch, useSelector} from "react-redux";

const ProfileSwiper = (props) => {
  const {data, openShowSlide, webview,
    disabledBadge, swiperParam, type, listenOpen} = props; //listenOpen = 회원 방송 청취 정보 공개 여부(0 = 공개-따라가기X,1 = 공개-따라가기ㅇ, 2 = 비공개) -> liveBag 보여주는 여부

  const history = useHistory();
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const popup = useSelector(state => state.popup);
  const topSwiperRef = useRef(null);

  const swiperPicture = {
    slidesPerView: 'auto',
    spaceBetween: 8,
    autoplay: {
      delay: 100000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'fraction'
    },
    on: {
      init: function () {
        topSwiperRef.current = this;
      }
    }
  }

  /* 스페셜DJ 약력 팝업 생성 */
  const popupOpen = () => {
    dispatch(setCommonPopupOpenData({...popup, historyPopup: true}))
  }

  useEffect(() => {
    if (data.profImgList.length > 1) {
      const swiper = document.querySelector('.profileTopSwiper>.swiper-container')?.swiper;
      swiper?.update();
      swiper?.slideTo(0);
    }
  }, [data]);

  return (
    <section className='profileSwiper'>
    {data.profImgList.length > 1 ?
      <Swiper {...swiperPicture}>
        {data.profImgList.map((item, index) => {
          return (
            <div key={index} onClick={() => openShowSlide(data.profImgList, 'y', 'profImg', topSwiperRef.current?.activeIndex)}>
              <div className="photo" style={{cursor:"pointer"}}>
                <img src={item.profImg.thumb500x500} alt="" />
              </div>
            </div>
          )
        })}
      </Swiper>
      : data.profImgList.length === 1 ?
      <div onClick={() => openShowSlide(data.profImgList, 'y', 'profImg', topSwiperRef.current?.activeIndex)}>
        <div className="photo">
          <img src={data.profImgList[0].profImg.thumb500x500} style={{width:'100%', height:'100%', objectFit:'cover'}} alt="" />
        </div>
      </div>
      :
      <div className="swiper-slide">
        <div className="photo" style={{backgroundColor:"#eee", height: '480px'}}>
          <img src={`${IMG_SERVER}/profile/photoNone.png`} alt="" />
        </div>
      </div>
    }
    {!disabledBadge &&
      <div className={`swiperBottom ${data.profImgList.length > 1 ? 'pagenation' : ''}`}>
        {type === 'profile' && webview === '' && data.roomNo !== "" && !data.listenRoomNo &&
          <div className='badgeLive' onClick={()=>{
            RoomValidateFromProfile({
              memNo:data.memNo, history, globalState, dispatch, nickNm:data.nickNm, roomNo:data.roomNo, webview
            });
          }}>
            <span className='equalizer'>
              <Lottie
                options={{
                  loop: true,
                  autoPlay: true,
                  path: `${IMG_SERVER}/dalla/ani/equalizer_pink.json`
                }}
              />
            </span>
            <span className='liveText'>LIVE</span>
          </div>
        }
        {type === 'profile' && webview === '' && data.listenRoomNo !== "" && listenOpen !== 2 && !data.roomNo &&
          <div className='badgeListener' onClick={()=>{
            RoomValidateFromListenerFollow({
              memNo:data.memNo, history, globalState, dispatch, nickNm:data.nickNm, listenRoomNo:data.listenRoomNo
            });
          }}>
            <span className='headset'>
              <Lottie
                  options={{
                    loop: true,
                    autoPlay: true,
                    path: `${IMG_SERVER}/dalla/ani/ranking_headset_icon.json`
                  }}
                />
            </span>
            <span className='ListenerText'>LIVE</span>
          </div>
        }
      </div>
    }
    </section>
  )
}
ProfileSwiper.defaultProps = {
  openShowSlide: () => {},
  disabledBadge: false,  // 배지영역 사용안함 여부 [true: 사용 x, false : 사용 o ]
  swiperParam: {} // 스와이퍼 추가옵션이 필요한 경우
}
export default ProfileSwiper;