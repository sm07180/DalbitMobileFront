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
      type: 'fraction',
      clickable: true
    },
    on:{
      click: (s, e) => {
        let evt = e; // 스와이프 버전에 따라 달라서 임시 처리
        evt.preventDefault();
        evt.stopPropagation();

        const target = data[parseInt(s.realIndex)];
        if(target.nickNm === 'banner' && target.roomType === 'link') {
          history.push(target.roomNo);
        }else {
          // 방송방으로 이동
          setTimeout(() => {
            RoomValidateFromClip(target.roomNo, context, history, target.nickNm);
          }, 0)
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
        : <div className="empty" />
      }
    </>
  )
}

export default MainSlide
