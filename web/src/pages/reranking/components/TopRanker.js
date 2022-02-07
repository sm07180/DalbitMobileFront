import React, {useContext, useState} from 'react'
import {Context} from 'context'

import Swiper from 'react-id-swiper'
import LayerPopup from 'components/ui/layerPopup/LayerPopup'
// global components

const TopRanker = (props) => {
  const [popup, setPopup] = useState(false);
  const {data, rankingListType} = props
  const context = useContext(Context)

  // 스와이퍼
  const swiperParams = {
    slidesPerView: 'auto',
    centeredSlides: true,
    loop: false,
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    }
  }
  
  const popOpen = () => {  
    setPopup(true);
  }

  return (
    <React.Fragment>
      {data && data.length > 0 &&    
        <div className='rankingTop3'>
          <div className='topHeader'>오늘 TOP3
            <span className='questionMark' onClick={popOpen}></span>
          </div>
          {data.map((list, index) => {
            return (
              <Swiper {...swiperParams} key={index}>
                <div className='topContent'>
                  <div className="ranker">
                    <div className="listColumn">
                      <div className="photo">
                        <img src={list[0] ? list[0].profImg.thumb190x190 : "https://image.dalbitlive.com/images/listNone-userProfile.png"} alt="" />
                        {list[0].rank && <div className='rankerRank'>{list[0].rank}</div>}
                      </div>
                      <div className='rankerNick'>{list[0] ? list[0].nickNm : "-"}</div>
                    </div>
                    {rankingListType === "lover" ?
                      <div className='cupidWrap'>
                        <div className='cupidHeader'>CUPID</div>
                        <div className='cupidContent'>
                          <div className='cupidThumb'>
                            <img src={list[0] ? list[0].djProfImg.thumb190x190 : "https://image.dalbitlive.com/images/listNone-userProfile.png"} alt={list[0] ? list[0].nickNm : "해당유저가 없습니다."} />
                          </div>
                          <div className='cupidNick'>{list[0] ? list[0].djNickNm : "-"}</div>
                        </div>
                      </div>
                      :
                      <>
                        {list[0].roomNo && <div className='badgeLive'>LIVE</div>}
                      </>
                    }
                  </div>
                  <div className="ranker">
                    <div className="listColumn">
                      <div className="photo">
                        <img src={list[1] ? list[1].profImg.thumb190x190 : "https://image.dalbitlive.com/images/listNone-userProfile.png"} alt="" />
                        {list[1].rank && <div className='rankerRank'>{list[1].rank}</div>}
                      </div>
                      <div className='rankerNick'>{list[1] ? list[1].nickNm : "-"}</div>
                    </div>
                    {rankingListType === "lover" ?
                      <div className='cupidWrap'>
                        <div className='cupidHeader'>CUPID</div>
                        <div className='cupidContent'>
                          <div className='cupidThumb'>
                            <img src={list[1] ? list[1].djProfImg.thumb190x190 : "https://image.dalbitlive.com/images/listNone-userProfile.png"} alt={list[1] ? list[1].nickNm : "해당유저가 없습니다."} />
                          </div>
                          <div className='cupidNick'>{list[1] ? list[1].djNickNm : "-"}</div>
                        </div>
                      </div>
                      :
                      <>
                        {list[1].roomNo && <div className='badgeLive'>LIVE</div>}
                      </>
                    }
                  </div>
                  <div className="ranker">
                    <div className="listColumn">
                      <div className="photo">
                        <img src={list[2] ? list[2].profImg.thumb190x190 : "https://image.dalbitlive.com/images/listNone-userProfile.png"} alt="" />
                        {list[2] && <div className='rankerRank'>{list[2].rank}</div>}
                      </div>
                      <div className='rankerNick'>{list[2] ? list[2].nickNm : "-"}</div>
                    </div>
                    {rankingListType === "lover" ?
                      <div className='cupidWrap'>
                        <div className='cupidHeader'>CUPID</div>
                        <div className='cupidContent'>
                          <div className='cupidThumb'>
                            <img src={list[2] ? list[2].djProfImg.thumb190x190 : "https://image.dalbitlive.com/images/listNone-userProfile.png"} alt={list[2] ? list[2].nickNm : "해당유저가 없습니다."} />
                          </div>
                          <div className='cupidNick'>{list[2] ? list[2].djNickNm : "-"}</div>
                        </div>
                      </div>
                      :
                      <>
                        {list[2].roomNo && <div className='badgeLive'>LIVE</div>}
                      </>
                    }
                  </div>
                </div>
              </Swiper>
            )
          })}      
        </div>
      }
      <>
      { popup &&
        <LayerPopup setPopup={setPopup}>
          {
            rankingListType === "dj" &&
            <>
              <div className='popTitle'>DJ 랭킹 선정 기준</div>
              <div className='popSubTitle'>
                받은 별, 청취자 수, 받은 좋아요 <br/>(부스터 포함)의 종합 순위입니다.
              </div>
            </>
            
          }
          {
            rankingListType === "fan" &&
            <>
              <div className='popTitle'>FAN 랭킹 선정 기준</div>
              <div className='popSubTitle'>
              보낸 달과 보낸 좋아요(부스터 포함)의 <br/>종합 순위입니다.
              </div>
            </>
            
          }
          {
            rankingListType === "lover" &&
            <>
              <div className='popTitle'>LOVER 랭킹이란?</div>
              <div className='popSubTitle'>
              보낸 좋아요 개수 (부스터 포함)<br/>1~200위의 순위입니다.
              </div>
              <div className='popText'>
                <span>CUPID</span>(큐피드)는 랭커로부터 가장 많은 <br/>좋아요 (부스터 포함)를 받은 유저입니다.
              </div>
            </>
            
          }
        </LayerPopup>
      }
      </>
    </React.Fragment>
  )
}

export default TopRanker
