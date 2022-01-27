import React, {useState, useEffect} from 'react'
import Swiper from 'react-id-swiper'

// global components
import ListColumn from 'components/ui/listColumn/ListColumn'
import BadgeItems from 'components/ui/badgeItems/BadgeItems'
import {useHistory} from "react-router-dom";
import MovePage from "components/module/MovePage";

const MainSlide = (props) => {
  const {data} = props
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
      click: (e) => {
        console.log(e);
        if(e.type === 'touchend') {
          const paths = e.path || e.composedPath();
          let swiperIndex = "";
          paths.forEach(dom => {
            if(dom.dataset && dom.dataset.swiperIndex) {
              swiperIndex = dom.dataset.swiperIndex;
              const target = data[parseInt(swiperIndex)];
              if(target.nickNm === 'banner' && target.roomType === 'link') {
                MovePage({url: target.roomNo, history});
              }else {
                MovePage({url: '/rank', history});
              }
              console.log(data[parseInt(swiperIndex)])
            }
          })
        }
      },
    }
  }

  return (
    <>
      {data.length > 0 &&
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
