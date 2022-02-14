import React, {useState} from 'react'
import Swiper from 'react-id-swiper'
// global components

const TopRanker = (props) => {
  const {data} = props

  const pagination = () => {
    const {targetSlideIndex} = e.currentTarget.dataset;

  }

  // 스와이퍼
  const swiperParams = {
    slidesPerView: 'auto',
  }

  return (
    <React.Fragment>
      <section className="topRanker">
        <h2>오늘의 TOP3</h2>
        {data.length > 0 &&
          <>
            <Swiper {...swiperParams}>
              {data.map((list,index) => {
                return (
                <div key={index}>
                  <div className="rankerWrap">
                    {data.map((data,index) => {
                      return (
                        <>
                          {index < 3 &&
                          <div className="ranker" key={`list-${index}`}>
                            <div className="listColumn">
                              <div className="photo">
                                <img src={data.profImg.thumb100x100} alt="" />
                                <div className='rank'>{data.rank}</div>
                                <span className="play"></span>
                              </div>
                              <div className='title'>{data.nickNm}</div>
                              <div className='nick'>{data.nickNm}</div>
                            </div>
                          </div>
                          }
                        </>
                      )
                    })}
                  </div>
                </div>
                )
              })}
            </Swiper>    
            <div className="swiper-pagination">
              <span className="active"></span>
              <span></span>
            </div>
          </>
        }
      </section>
    </React.Fragment>
  )
}

export default TopRanker
