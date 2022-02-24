import React, {useContext, useEffect} from 'react'
import {IMG_SERVER} from 'context/config'

import Swiper from 'react-id-swiper'

import './topSwiper.scss'
import {Context} from "context";
import {RoomValidateFromProfile} from "common/audio/clip_func";
import {useHistory} from "react-router-dom";

const TopSwiper = (props) => {
  const {data, openShowSlide, webview, isMyProfile,
    disabledBadge, swiperParam, setPopHistory, type, listenOpen} = props; //listenOpen = 회원 방송 청취 정보 공개 여부(0,1 = 공개, 2 = 비공개) -> liveBag 보여주는 여부

  const context = useContext(Context);
  const history = useHistory();
  
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
    ...swiperParam
  }

  const roomJoinHandler = () => {
    const params = {
      roomNo: data.roomNo,
      history,
      context,
      nickNm: data.nickNm,
      listenRoomNo: data.listenRoomNo,
      webview
    }
    RoomValidateFromProfile(params);
  }


  /* 스페셜DJ 약력 팝업 생성 */
  const popupOpen = () => {
    setPopHistory(true);
  }

  useEffect(() => {
    console.log(listenOpen);
  })

  useEffect(() => {
    if (data.profImgList.length > 1) {
      const swiper = document.querySelector('.profileTopSwiper>.swiper-container')?.swiper;
      swiper?.update();
      swiper?.slideTo(0);
    }
  }, [data]);

  return (
    <>
      {data.profImgList.length > 1 ?
        <Swiper {...swiperPicture}>
          {data.profImgList.map((item, index) => {
            return (
              <div key={index} onClick={() => {openShowSlide(data.profImgList)}}>
                <div className="photo" style={{cursor:"pointer"}}>
                  <img src={item.profImg.thumb500x500} alt="" />
                </div>
              </div>
            )
          })}
        </Swiper>
        : data.profImgList.length === 1 ?
        <div onClick={() => openShowSlide(data.profImgList)}>
          <div className="photo">
            <img src={data.profImgList[0].profImg.thumb500x500} style={{width:'100%', height:'100%', objectFit:'cover'}} alt="" />
          </div>
        </div>
        :
        <div className="swiper-slide">
          <div className="photo" style={{backgroundColor:"#eee"}}>
            <img src={`${IMG_SERVER}/profile/photoNone.png`} alt="" />
          </div>
        </div>
      }
      {!disabledBadge &&
      <div className={`swiperBottom ${data.profImgList.length > 1 ? 'pagenation' : ''}`}>
        {data.specialDjCnt > 0 && type === 'profile' &&
          <div className="specialBdg" onClick={popupOpen}>
            <img src={`${IMG_SERVER}/profile/profile_specialBdg.png`} alt="" />
            <span>{data.specialDjCnt}회</span>
          </div>
        }
        {!isMyProfile && webview === '' && data.roomNo !== "" && listenOpen !== 2 &&
          <div className="liveBdg">
            <img src={`${IMG_SERVER}/profile/profile_liveBdg-1.png`} alt="LIVE" onClick={roomJoinHandler} />
          </div>
        }
        {!isMyProfile && webview === '' && data.listenRoomNo !== "" &&
          <div className="liveBdg">
            <img src={`${IMG_SERVER}/profile/profile_liveBdg-2.png`} alt="LIVE" onClick={roomJoinHandler} />
          </div>
        }
      </div>
      }
    </>
  )
}
TopSwiper.defaultProps = {
  openShowSlide: () => {},
  disabledBadge: false,  // 뱃지영역 사용안함 여부 [true: 사용 x, false : 사용 o ]
  swiperParam: {} // 스와이퍼 추가옵션이 필요한 경우
}
export default TopSwiper
