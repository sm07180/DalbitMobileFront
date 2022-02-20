import React, {useContext} from 'react'
import Swiper from 'react-id-swiper'

// global components
import ListColumn from 'components/ui/listColumn/ListColumn'
import BadgeItems from 'components/ui/badgeItems/BadgeItems'
import {useHistory} from "react-router-dom";
import {RoomValidateFromClip} from "common/audio/clip_func";
import {Context} from "context";

const MainSlide = (props) => {
  const {data} = props
  const context = useContext(Context);
  const history = useHistory();

  const swiperParams = {
    loop: true,
    autoplay: {
      delay: 10000,
      disableOnInteraction: false
    },
    on:{
      click: (s, e) => {
        let evt = e ? e : s; // 스와이프 버전에 따라 달라서 임시 처리
        if(evt.type === 'touchend' || evt.type === 'pointerup') {
          evt.preventDefault();
          evt.stopPropagation();
          const paths = evt.path || evt.composedPath();
          let swiperIndex = "";
          paths.forEach(dom => {
            if(dom.dataset && dom.dataset.swiperIndex) {
              swiperIndex = dom.dataset.swiperIndex;
              const target = data[parseInt(swiperIndex)];
              if(target.nickNm === 'banner' && target.roomType === 'link') {
                history.push(target.roomNo);
              }else {
                // 방송방으로 이동
                RoomValidateFromClip(target.roomNo, context, history, target.nickNm);
              }
            }
          })
        }
      },
    }
  }

  return (
    <>
      {data.length > 0 ?
        <Swiper {...swiperParams}>
          {data.map((list, index) => {
            return (
              <div key={index}>
                {list.bannerUrl && list.nickNm === "banner" && list.roomType === 'link' ?
                  <ListColumn photo={list.bannerUrl} index={index} />
                  :
                  <ListColumn photo={list.bannerUrl} index={index}>
                    <div className='info'>
                      <div className="badgeGroup">
                        <BadgeItems data={list} type='isBadge' />
                      </div>
                      <span className="title">{list.title}</span>
                      <span className="nick">{list.nickNm}</span>
                    </div>
                  </ListColumn>
                }
              </div>
            )
          })}
        </Swiper>
        : data.length === 0 &&
        <div className="empty"></div>
      }
    </>
  )
}

export default MainSlide
