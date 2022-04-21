import React, {useState, useEffect} from 'react'
import { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
// global components
import NoResult from "components/ui/noResult/NoResult";

const TopRanker = (props) => {
  const {data, clipPlayHandler} = props

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

  const playAction = (e, listTitle) => {
    // playType = "today" | "yesterday" | "thisWeek" | "lastWeek"
    if(listTitle === '오늘') { // 오늘 1~3위 + 4위 ~
      clipPlayHandler(e, 'today');
    }else if(listTitle === '어제') { // 어제 1~3위 + 오늘 1~3위 + 4위~
      clipPlayHandler(e, 'yesterday');
    }else if(listTitle === '이번주') { // 이번주 1~3위 + 이번주 4위~
      clipPlayHandler(e, 'thisWeek');
    }else if(listTitle === '저번주') { // 지난주 1~3위 +
      clipPlayHandler(e, 'lastWeek');
    }
  }

  return (
    <>
      <section className="topRanker">
        {data.length > 0 ?
          <>
            <Swiper initialSlide={targetPage} onSlideChange={handleSwiper}>
              {data.map((list, index) => {
                return (
                <SwiperSlide key={index}>
                  <h2>{list.title}의 TOP3</h2>
                  <div className="rankerWrap">
                    {list.list.map((row, index2) => {
                      return (
                        <div className="ranker" key={`list-${index2}`} data-clip-no={row.clipNo} data-type={index}
                             onClick={(e) => playAction(e, list.title)}>
                          <div className="listColumn">
                            <div className="photo">
                              <img src={row.bgImg.thumb292x292} alt="" />
                              <div className={`rank  ${row.rank === 1 ? "first" : ""}`}>{row.rank}</div>
                              <span className="play"/>
                            </div>
                            <div className='title'>{row.title}</div>
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
