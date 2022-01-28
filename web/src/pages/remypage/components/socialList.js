import React from 'react'
import {IMG_SERVER} from 'context/config'

import Swiper from 'react-id-swiper'
// global components
import ListRow from 'components/ui/listRow/ListRow'
// css
import './socialList.scss'

const SocialList = (props) => {
  const {data,picture} = props
  
  // 스와이퍼
  const swiperFeeds = {
    slidesPerView: 'auto',
    spaceBetween: 8,
    pagination: {
      el: '.swiper-pagination',
      type: 'fraction'
    }
  }

  return (
    <div className="socialList">
      <ListRow photo={data.profImg.thumb50x50}>
        <div className="listContent">
          <div className="nick">{data.nickNm}</div>
          <div className="time">3시간전</div>
        </div>
        <button>
          <img src={`${IMG_SERVER}/mypage/dalla/btn_more.png`} alt="더보기" />
        </button>
      </ListRow>
      <div className="socialContent">
        <div className="text">
          일주년 일부 방송 끝!<br/>
          신년이기도 하고 1일이라 바쁘신 분들도 많으실텐데<br/>
          와주신 모든 분들 너무 감사합니다!<br/>
          내일 오후에는 정규 시간, 룰렛으로  만나요 : )
        </div>
        {picture &&
          <div className="swiperPhoto">
            <Swiper {...swiperFeeds}>
              <div>
                <div className="photo">
                  <img src={data && data.profImg && data.profImg.thumb500x500} alt="" />
                </div>
              </div>
              <div>
                <div className="photo">
                  <img src={data && data.profImg && data.profImg.thumb500x500} alt="" />
                </div>
              </div>
            </Swiper>
          </div>
        }
        <div className="info">
          <i className='like active'></i>
          <span>123</span>
          <i className='comment'></i>
          <span>321</span>
        </div>
      </div>
    </div>
  )
}

export default SocialList
