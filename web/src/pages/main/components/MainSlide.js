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
    pagination: {
      el: '.swiper-pagination',
      type: 'fraction'
    },
    on:{
      click: (swiper, event) => {
        if(event.type === 'touchend' || event.type === 'pointerup') {
          const paths = event.path || event.composedPath();
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
      {data && data.length > 0 &&
        <Swiper {...swiperParams}>
          {data.map((list, index) => {
            return (
              <div key={index}>
                {list.bannerUrl && list.nickNm === "banner" && list.roomType === 'link' ?
                  <ListColumn photo={list.bannerUrl} index={index} />
                  :
                  <ListColumn photo={list.profImg.thumb500x500} index={index}>
                    <div className='info'>
                      <BadgeItems data={list.liveBadgeList} />
                      <span className="title">{list.title}</span>
                      <span className="nick">{list.nickNm}</span>
                    </div>
                  </ListColumn>
                }
              </div>
            )
          })}
        </Swiper>
      }
    </>
  )
}

export default MainSlide
