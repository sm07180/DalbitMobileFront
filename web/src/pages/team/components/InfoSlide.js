import React, {useEffect, useState} from 'react'
import Swiper from 'react-id-swiper'
import {IMG_SERVER} from 'context/config'
// global components

const InfoSlide = (props) => {

  const slideItem = [{
      text: `우리팀 심볼은\n뭐가 좋을까?`,
      subText: `1,000가지의 심볼 조합`,
      imgSrc: `${IMG_SERVER}/team/slideImg-1.png`
    },
    {
      text: `활동배지와 추가 경험치를\n받아보세요!`,
      subText: "멤버 모두가 받게 되는 혜택",
      imgSrc: `${IMG_SERVER}/team/slideImg-2.png`
    },
    {
      text: `팀 랭킹에 오르면\n리워드 지급!`,
      subText: "리워드 역시 모든 멤버에게",
      imgSrc: ""
    },
    {
      text: `지금 팀 활동을\n시작하세요!`,
      subText: "",
      imgSrc: `${IMG_SERVER}/team/slideImg-4.png`
    }
  ];

  const swiperParams = {
    loop: true,
    speed: 700,
    autoplay: {
      delay: 7000,
      disableOnInteraction: false
    },
    parallax: true,
    pagination: {
      el: '.swiper-pagination'
    }
  };

  // 페이지 시작
  return (
    <>
    {slideItem && slideItem.length > 0 &&
      <Swiper {...swiperParams}>
        {slideItem.map((data,index) => {
          return (
            <div className="infoSlide" key={index}>
              <div className="slideTitle">
                <div className="title">{data.text}</div>
                <div className="subTitle">{data.subText}</div>
              </div>
              <div className="imgItem">
                <img src={data.imgSrc} />
              </div>
            </div>
          )
        })}
      </Swiper>
    }
    </>
  )
}

export default InfoSlide
