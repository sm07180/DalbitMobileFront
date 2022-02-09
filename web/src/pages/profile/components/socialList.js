import React from 'react'

// global components
import DataCnt from 'components/ui/dataCnt/DataCnt'
// css
import './socialList.scss'
import ListRowComponent from "./ListRowComponent";

const SocialList = (props) => {
  const {socialList, openShowSlide, isMyProfile, type} = props

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
      {socialList.map((item, index) => {
        return (
          <React.Fragment key={item.noticeIdx ? item.noticeIdx : item.replyIdx}>
            <ListRowComponent item={item} isMyProfile={isMyProfile} index={index} type="feed" />
            <div className="socialContent">
              <div className="text">
                {item.contents}
              </div>
              {type === 'feed' && (item.photoInfoList.length > 1 ?
                <div className="swiperPhoto" onClick={() => openShowSlide(item.photoInfoList)}>
                  <Swiper {...swiperFeeds}>
                    {item.photoInfoList.map((photo) => {
                      return (
                        <div>
                          <div className="photo">
                            <img src={photo.profImg?.thumb500x500} alt="" />
                          </div>
                        </div>
                      )
                    })}
                  </Swiper>
                </div>
                : item.photoInfoList.length === 1 ?
                  <div className="swiperPhoto" onClick={() => openShowSlide(item.profImg, "n")}>
                    <div className="photo">
                      <img src={item.photoInfoList[0].profImg?.thumb190x190} alt="" />
                    </div>
                  </div>
                    : <></>
              )}
              <div className="info">
                <DataCnt type={"replyCnt"} value={item.replyCnt} />
              </div>
            </div>
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default SocialList
