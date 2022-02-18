import React, {useContext} from 'react'

// global components
import DataCnt from 'components/ui/dataCnt/DataCnt'
// css
import './socialList.scss'
import ListRowComponent from "./ListRowComponent";
import Swiper from "react-id-swiper";
import {useHistory} from "react-router-dom";
import {goProfileDetailPage} from "pages/profile/contents/profileDetail/profileDetail";
import {Context} from "context";

const SocialList = (props) => {
  const {socialList, openShowSlide, isMyProfile, type, openBlockReportPop, deleteContents, profileData} = props
  const history = useHistory();
  const context = useContext(Context);
  const {profile} = context;

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
    <div className="socialListWrap">
      {socialList.map((item, index) => {
        const memNo = type==='feed'? profileData.memNo : item?.writerMemNo; //글 작성자
        const detailPageParam = {history, action:'detail', type, index: item.noticeIdx ? item.noticeIdx : item.replyIdx, memNo: profileData.memNo};
        const modifyParam = {history, action:'modify', type, index: item.noticeIdx ? item.noticeIdx : item.replyIdx, memNo:profileData.memNo };
        return (
          <div className='socialList' key={item.noticeIdx ? item.noticeIdx : item.replyIdx}>
            <ListRowComponent item={item} isMyProfile={isMyProfile} index={index} type="feed" openBlockReportPop={openBlockReportPop}
                              modifyEvent={() => {memNo === profile.memNo && goProfileDetailPage(modifyParam)}}
                              deleteEvent={() => deleteContents(type, item.noticeIdx ? item.noticeIdx : item.replyIdx, profileData.memNo )}
            />
            <div className="socialContent">
              <div className="text" onClick={() => goProfileDetailPage(detailPageParam)}>
                {item.contents}
              </div>
              {type === 'feed' && (item.photoInfoList.length > 1 ?
                <div className="swiperPhoto" onClick={() => openShowSlide(item.photoInfoList, 'y', 'imgObj')}>
                  <Swiper {...swiperFeeds}>
                    {item.photoInfoList.map((photo, index) => {
                      return (
                        <div key={index}>
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
                <DataCnt type={"replyCnt"} value={item.replyCnt} clickEvent={() => goProfileDetailPage(detailPageParam)}/>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default SocialList
