import React from 'react'

import Swiper from 'react-id-swiper'
// global components

const TopRanker = (props) => {
  const {data, rankingListType} = props

  // 스와이퍼
  const swiperParams = {
    slidesPerView: 'auto',
    centeredSlides: true,
    spaceBetween: 15,
    loop: false,
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    }
  }

  return (
    <React.Fragment>
      {data && data.length > 0 &&    
        <Swiper {...swiperParams}>
          {data.map((list, index) => {
            return (
              <div className='rankingTop3' key={index}>
                <div className='topHeader'>오늘 TOP3
                  <span className='questionMark'></span>
                </div>
                <div className='topContent'>
                  {list.map((data,index) => {
                    return (
                      <div className="ranker" key={index}>
                        <div className="listColumn">
                          <div className="photo">
                            <img src={data.profImg.thumb190x190} alt="" />
                            <div className='rankerRank'>{data.rank}</div>
                          </div>
                          <div className='rankerNick'>{data.nickNm}</div>
                        </div>
                        {rankingListType === "lover" ?
                          <div className='cupidWrap'>
                            <div className='cupidHeader'>CUPID</div>
                            <div className='cupidContent'>
                              <div className='cupidThumb'>
                                <img src={data.djProfImg.thumb190x190} alt={data.nickNm} />
                              </div>
                              <div className='cupidNick'>{data.djNickNm}</div>
                            </div>
                          </div>
                          :
                          <>
                            {data.roomNo && <div className='badgeLive'>LIVE</div>}
                          </>
                        }
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </Swiper>
      }
    </React.Fragment>
  )
}

export default TopRanker
