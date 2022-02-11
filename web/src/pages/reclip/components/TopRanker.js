import React, {useState} from 'react'
import Swiper from 'react-id-swiper'
// global components

const TopRanker = () => {
  // 스와이퍼
  const swiperParams = {
    slidesPerView: 'auto',
  }

  return (
    <React.Fragment> 
      <div className='rankingTop3'>
        <div className='topHeader'>오늘의 TOP3</div>
        <Swiper {...swiperParams}>
          <div>
            <div className="ranker">
              <div className="listColumn">
                <div className="photo">
                  <img src="" alt="" />
                  <div className='rankerRank'>1</div>
                  <span className="play"></span>
                </div>
                <div className='rankerName'>이름------------------</div>
                <div className='rankerNick'>11111111111111111</div>
              </div>
            </div>
            <div className="ranker">
              <div className="listColumn">
                <div className="photo">
                  <img src="" alt="" />
                  <div className='rankerRank'>2</div>
                  <span className="play"></span>
                </div>
                <div className='rankerName'>이름------------------</div>
                <div className='rankerNick'>222222222222222222</div>
              </div>
            </div>
            <div className="ranker">
              <div className="listColumn">
                <div className="photo">
                  <img src="" alt="" />
                  <div className='rankerRank'>3</div>
                  <span className="play"></span>
                </div>
                <div className='rankerName'>이름------------------</div>
                <div className='rankerNick'>333333333333333333333</div>
              </div>
            </div>
          </div>
        </Swiper>
      </div>
    </React.Fragment>
  )
}

export default TopRanker
