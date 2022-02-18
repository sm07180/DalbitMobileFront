import React, {useState, useEffect} from 'react'
import { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
// global components
import NoResult from "components/ui/noResult/NoResult";

const TopRanker = (props) => {
  const {data} = props

  console.log(data);
  const [targetPage, setTargetPage] = useState(1);

  // 스와이퍼
  const handleSwiper = (swiper) => {
    setTargetPage(swiper.realIndex);
  }

  // 왜 안되냐 ******
  /* <Swiper slidesPerView="auto" initialSlide={targetPage}
          pagination={pagination}
          onSwiper={(swiper) => console.log(swiper)}
          modules={[Pagination]}
          onSlideChange={handleSwiper}> initialSlide={targetPage}
  **/
  const pagination = {
    clickable: true,
    renderBullet: function (index, className) {
      return '<span class="active">' + (index + 1) + "</span>";
    },
  };

  return (
    <>
      <section className="topRanker">
        {data.length > 0 ?
          <>
            <Swiper initialSlide={targetPage}
                    onSlideChange={handleSwiper}>
              {data.map((list,index) => {
                return (
                <SwiperSlide key={index}>
                  <h2>{list.title}의 TOP3</h2>
                  <div className="rankerWrap">
                    {list.list.map((row,index2) => {
                      return (
                        <div className="ranker" key={`list-${index2}`}>
                          <div className="listColumn">
                            <div className="photo">
                              <img src={row.profImg.thumb100x100} alt="" />
                              <div className='rank'>{row.rank}</div>
                              <span className="play"/>
                            </div>
                            <div className='title'>{row.fileName}</div>
                            <div className='nick'>{row.nickName}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </SwiperSlide>
                )
              })}
            </Swiper>
            <div className="swiper-pagination">
              {data.length > 1 &&
                <>
                  <span className={`${targetPage === 0 ? 'active' : ''}`}/>
                  <span className={`${targetPage === 1 ? 'active' : ''}`}/>
                </>
              }
            </div>
          </>
          :
          <NoResult/>
        }
      </section>
    </>
  );
};

export default TopRanker;
