import React, {useContext, useEffect} from 'react'
import {IMG_SERVER, OS_TYPE} from 'context/config'

import Swiper from 'react-id-swiper'

import './topSwiper.scss'
import Utility from "components/lib/utility";
import {Hybrid, isHybrid, isIos} from "context/hybrid";
import {RoomJoin} from "context/room";
import {Context} from "context";
import {isDesktop} from "lib/agent";
import {RoomValidateFromClip} from "common/audio/clip_func";
import {useHistory} from "react-router-dom";

const TopSwiper = (props) => {
  const {data, openShowSlide, webview} = props
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
  }

  const roomJoinHandler = () => {
    if(!context.token.isLogin) {
      return history.push('/login')
    }

    if(isDesktop()) {
      if(data.roomNo) {
        return RoomValidateFromClip(data.roomNo, context, history, data.nickNm);
      }else if(data.listenRoomNo) {
        if(isNaN(data.listenRoomNo)) {
          return context.action.alert({
            type: 'alert',
            msg: `${data.nickNm} 님이 어딘가에서 청취중입니다. 위치 공개를 원치 않아 해당방에 입장할 수 없습니다`
          })
        }else {
          context.action.confirm({
            type: 'confirm',
            msg: `해당 청취자가 있는 방송으로 입장하시겠습니까?`,
            callback: () => {
              return RoomValidateFromClip(data.listenRoomNo, context, history, data.nickNm);
            }
          })
        }
      }
    }else if(isHybrid()){
      //TODO 방입장 / 따라가기 네이티브랑 협의 후 수정 - 성민
      if (webview === 'new') {
        //IOS 웹뷰에서 같은 방 진입시
        if (isIos() && Utility.getCookie('listen_room_no') === data.listenRoomNo) {
          return Hybrid('CloseLayerPopup')
        }
        let alertMsg
        if (isNaN(data.listenRoomNo)) {
          alertMsg = `${data.nickNm} 님이 어딘가에서 청취중입니다. 위치 공개를 원치 않아 해당방에 입장할 수 없습니다`
          context.action.alert({
            type: 'alert',
            msg: alertMsg
          })
        } else {
          alertMsg = `해당 청취자가 있는 방송으로 입장하시겠습니까?`
          context.action.confirm({
            type: 'confirm',
            msg: alertMsg,
            callback: () => {
              return RoomJoin({roomNo: data.listenRoomNo, listener: 'listener'})
            }
          })
        }
      }

      if (webview === 'new' && Utility.getCookie('listen_room_no')) {
        return false
      }

      if (webview === 'new' && Utility.getCookie('clip-player-info') && isIos()) {
        return context.action.alert({msg: `클립 종료 후 청취 가능합니다.\n다시 시도해주세요.`})
      } else {
        if (webview === 'new' && Utility.getCookie('listen_room_no') && isIos()) {
          return false
        } else {
          let alertMsg
          if (isNaN(data.listenRoomNo)) {
            alertMsg = `${data.nickNm} 님이 어딘가에서 청취중입니다. 위치 공개를 원치 않아 해당방에 입장할 수 없습니다`
            context.action.alert({
              type: 'alert',
              msg: alertMsg
            })
          } else {
            alertMsg = `해당 청취자가 있는 방송으로 입장하시겠습니까?`
            context.action.confirm({
              type: 'confirm',
              msg: alertMsg,
              callback: () => {
                return RoomJoin({roomNo: data.listenRoomNo, listener: 'listener'})
              }
            })
          }
        }
      }
    }else {
      context.action.updatePopup('APPDOWN', 'appDownAlrt', 2)
    }
  }

  useEffect(() => {
    if (data.profImgList.length > 1) {
      const swiper = document.querySelector('.topSwiper>.swiper-container').swiper;
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
                <div className="photo">
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
        <div
          className='swiper-slide'
          style={{
            backgroundImage: `url("https://devphoto2.dalbitlive.com/profile_3/profile_m_200327.jpg")`,
            backgroundSize: 'cover'
          }}
        />
      }
      <div className="swiperBottom">
        {data.specialDjCnt > 0 &&
          <div className="specialBdg">
            <img src={`${IMG_SERVER}/profile/profile_specialBdg.png`} alt="" />
            <span>{data.specialDjCnt}회</span>
          </div>
        }
        {(data.roomNo !== "" || data.listenRoomNo !== "") &&
          <div className="liveBdg">
            <img src={`${IMG_SERVER}/profile/profile_liveBdg-1.png`} alt="LIVE" onClick={roomJoinHandler} />
          </div>
        }
      </div>
    </>
  )
}

export default TopSwiper
