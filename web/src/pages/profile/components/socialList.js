import React from 'react'
import {IMG_SERVER} from 'context/config'

import Swiper from 'react-id-swiper'
// global components
import ListRow from 'components/ui/listRow/ListRow'
import DataCnt from 'components/ui/dataCnt/DataCnt'
// css
import './socialList.scss'

const SocialList = (props) => {
  const {profileData, list} = props
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
      {list.map((item) => {
        return (
          <React.Fragment key={item.noticeIdx}>
            <ListRow photo={profileData.profImg ? profileData.profImg.thumb50x50 : ""}>
              <div className="listContent">
                <div className="nick">{item.nickName}</div>
                <div className="time">{item.writeDate}</div>
              </div>
              <button className='more'>
                <img src={`${IMG_SERVER}/mypage/dalla/btn_more.png`} alt="더보기" />
                <div className="isMore">
                  <button>수정하기</button>
                  <button>삭제하기</button>
                  <button>차단/신고하기</button>
                </div>
              </button>
            </ListRow>
            <div className="socialContent">
              <div className="text">
                {item.contents}
              </div>
              {item.photoInfoList.length > 1 ?
                <div className="swiperPhoto">
                  <Swiper {...swiperFeeds}>
                    {item.photoInfoList.map((photo) => {
                      return (
                        <div>
                          <div className="photo">
                            <img src={photo.profImg.thumb500x500} alt="" />
                          </div>
                        </div>
                      )
                    })}
                  </Swiper>
                </div>
                : !item.profImg.isDefaultImg ?
                  <div className="swiperPhoto">
                    <div className="photo">
                      <img src={item.profImg.thumb190x190} alt="" />
                    </div>
                  </div>
                  : <></>
              }

              <div className="info">
                {/*<DataCnt type={`${list.likeYn === "y" ? "rcvLikeCnt active" : "rcvLikeCnt"}`}
                         value={list.rcv_like_cnt ? list.rcv_like_cnt : 0}/>*/}
                <DataCnt type={"readCnt"} value={item.readCnt ? item.readCnt : 0} />
                <DataCnt type={"replyCnt"} value={item.replyCnt ? item.replyCnt : 0} />
              </div>
            </div>
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default SocialList
