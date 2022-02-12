import React,{useContext} from 'react'

// global components
import DataCnt from 'components/ui/dataCnt/DataCnt'
// css
import './socialList.scss'
import ListRowComponent from "./ListRowComponent";
import Swiper from "react-id-swiper";
import {useHistory} from "react-router-dom";
import {Context} from "context";

const SocialList = (props) => {
  const {socialList, openShowSlide, isMyProfile, type, openBlockReportPop} = props
  const history = useHistory();
  const context = useContext(Context);

  // 스와이퍼
  const swiperFeeds = {
    slidesPerView: 'auto',
    spaceBetween: 8,
    pagination: {
      el: '.swiper-pagination',
      type: 'fraction'
    }
  }
  
  // 피드, 팬보드 상세로 이동하기
  const goContentsDetail = (idx) => {
    history.push(`/profileDetail/${context.profile.memNo}/${type}/${idx}`);
  };

  return (
    <div className="socialList">
      {socialList.map((item, index) => {
        return (
          <React.Fragment key={item.noticeIdx ? item.noticeIdx : item.replyIdx}>
            <ListRowComponent item={item} isMyProfile={isMyProfile} index={index} type="feed" openBlockReportPop={openBlockReportPop}
                              photoClick={() => goContentsDetail(item.noticeIdx ? item.noticeIdx : item.replyIdx)}
            />
            <div className="socialContent">
              <div className="text">
                {item.contents}
              </div>
              {type === 'feed' && (item.photoInfoList.length > 1 ?
                <div className="swiperPhoto" onClick={() => openShowSlide(item.photoInfoList, 'y', 'imgObj')}>
                  <Swiper {...swiperFeeds}>
                    {item.photoInfoList.map((photo) => {
                      return (
                        <div>
                          <div className="photo">
                            <img src={photo?.imgObj?.thumb500x500} alt="" />
                          </div>
                        </div>
                      )
                    })}
                  </Swiper>
                </div>
                : item.photoInfoList.length === 1 ?
                  <div className="swiperPhoto" onClick={() => openShowSlide(item?.photoInfoList[0]?.imgObj, 'n')}>
                    <div className="photo">
                      <img src={item?.photoInfoList[0]?.imgObj?.thumb190x190} alt="" />
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
