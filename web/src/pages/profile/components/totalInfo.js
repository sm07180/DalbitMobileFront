import React, {useEffect, useState} from 'react'
import {IMG_SERVER} from 'context/config'
import Utility from "components/lib/utility";
import Swiper from 'react-id-swiper'
// global components
import BadgeItems from 'components/ui/badgeItems/BadgeItems'
// components
// css
import './totalInfo.scss'
import {goProfileDetailPage} from "pages/profile/contents/profileDetail/profileDetail";
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import noticeFix from "redux/reducers/profile/noticeFix";

const TotalInfo = (props) => {
  const {data, goProfile, openPopLike, isMyProfile, feedData, getFeedData, fetchHandleLike, noticeFixData, getNoticeFixData} = props
  const [openBadge,setOpenBadge] = useState(false);
  const [badgeTotalCnt,setBadgeTotalCnt] = useState(0);
  const history = useHistory();
  const defaultNotice = [{
    contents: "방송 공지를 등록해주세요."
  }]
  //
  const onOpenBdage = () => {
    setOpenBadge(!openBadge)
  }

  const openPopAction = (e) => {
    const tabState = {
      titleTab: 0,
      subTab: 0,
      subTabType: isMyProfile ? 'fanRank' : ''
    }
    openPopLike(e, tabState)
  }

  // 스와이퍼
  const swiperParams = {
    slidesPerView: 'auto',
  }

  const onClick = () => {
    history.push({pathname: "/brdcst", state: {feedData, noticeFixData}})
  }

  useEffect(() => {
    let badgeLength = 0;
    if(data.badgeSpecial > 0) {
      badgeLength++
      setBadgeTotalCnt(badgeLength)
    }
    if(data.isSpecial) {
      badgeLength++
      setBadgeTotalCnt(badgeLength)
    }
    if(data.commonBadgeList.length > 0) {
      for(let i = 0; i < data.commonBadgeList.length; i++){
        badgeLength++
        setBadgeTotalCnt(badgeLength)
      }
    }
  },[data])

  /* 피드 삭제시 스와이퍼 업데이트용 */
  useEffect(() => {
    if((feedData || noticeFixData) !== undefined) {
      const swiper = document.querySelector('.swiper-container').swiper;
      swiper.update();
      // swiper.slideTo(0);
    }
  }, [feedData, noticeFixData]);

  return (
    <>
      {badgeTotalCnt !== 0 &&
      <div className={`badgeInfo ${openBadge && 'isOpen'}`}>
        <div className="title">뱃지</div>
        <div className="badgeGroup">
          <BadgeItems data={data} type="commonBadgeList" />
          <BadgeItems data={data} type="isBadge" />
        </div>
        {badgeTotalCnt > 3 &&
        <button onClick={onOpenBdage}>열기/닫기</button>
        }
      </div>
      }
      <div className="rankInfo">
        <div className="box">
          <div className="title" style={{cursor: 'pointer'}}
               onClick={openPopAction}>
            <img src={`${IMG_SERVER}/profile/infoTitle-1.png`} />
          </div>
          <div className="photoGroup">
            {data.fanRank.map((item, index) => {
              return (
                <div className="photo" key={index} onClick={() => goProfile(item.memNo)}>
                  <img src={item.profImg.thumb62x62} alt="" />
                  <span className='badge'>{index+1}</span>
                </div>
              )
            })}
            {[...Array(3 - data.fanRank.length)].map((item, index) => {
              return (
                <div className="photo" key={index}>
                  <img src={`${IMG_SERVER}/common/photoNone-2.png`} alt="기본 이미지" />
                </div>
              )
            })}
          </div>
        </div>
        <div className="box" onClick={() => goProfile(data.cupidMemNo)}>
          <div className="title" style={{cursor: 'pointer'}} onClick={openPopLike}>
            <img src={`${IMG_SERVER}/profile/infoTitle-2.png`} alt="" />
          </div>
          {data.cupidProfImg && data.cupidProfImg.path ?
            <div className="photo">
              <img src={data.cupidProfImg.thumb62x62} alt=""/>
            </div>
            :
            <div className="photo">
              <img src={`${IMG_SERVER}/common/photoNone-2.png`} alt="기본 이미지" />
            </div>
          }
        </div>
      </div>
      {data.profMsg &&
      <div className="comment">
        <div className="title">코멘트</div>
        <div className="text" dangerouslySetInnerHTML={{__html: Utility.nl2br(data.profMsg)}} />
      </div>
      }
      <div className="broadcastNotice">
        <div className="title" onClick={onClick}>방송공지</div>
        <Swiper {...swiperParams}>
          {noticeFixData.fixedFeedList.length !== 0 &&
          noticeFixData.fixedFeedList.map((v, idx) => {
            const detailPageParam = {history, action:'detail', type: 'notice', index: v.noticeIdx, memNo: v.mem_no};
            return (
              <div key={idx}>
                <div className="noticeBox">
                  <div className="badge">Notice</div>
                  <div className="text" onClick={() => goProfileDetailPage(detailPageParam)}>{v.contents}</div>
                  <div className="info">
                    {v.like_yn === "n" ?
                      <i className="like" onClick={() => fetchHandleLike(v.noticeIdx, v.mem_no, v.like_yn)}>{v.rcv_like_cnt ? Utility.printNumber(v.rcv_like_cnt) : 0}</i>
                      : <i className="like" onClick={() => fetchHandleLike(v.noticeIdx, v.mem_no, v.like_yn)}>{v.rcv_like_cnt ? Utility.printNumber(v.rcv_like_cnt) : 0}</i>
                    }
                    <i className="cmt" onClick={() => goProfileDetailPage(detailPageParam)}>{v.replyCnt}</i>
                    <span className="time">{Utility.writeTimeDffCalc(v.writeDate)}</span>
                  </div>
                  <button className="fixIcon">
                    <img src={`${IMG_SERVER}/profile/fixmark-on.png`} />
                  </button>
                </div>
              </div>
            )
          })}
          {feedData.feedList.length !== 0 &&
          feedData.feedList.map((v, idx) => {
            const detailPageParam = {history, action:'detail', type: 'notice', index: v.noticeIdx, memNo: v.mem_no};
            return (
              <div key={idx}>
                <div className="noticeBox">
                  <div className="badge">Notice</div>
                  <div className="text" onClick={() => goProfileDetailPage(detailPageParam)}>{v.contents}</div>
                  <div className="info">
                    {v.like_yn === "n" ?
                      <i className="like" onClick={() => fetchHandleLike(v.noticeIdx, v.mem_no, v.like_yn)}>{v.rcv_like_cnt ? Utility.printNumber(v.rcv_like_cnt) : 0}</i>
                      : <i className="like" onClick={() => fetchHandleLike(v.noticeIdx, v.mem_no, v.like_yn)}>{v.rcv_like_cnt ? Utility.printNumber(v.rcv_like_cnt) : 0}</i>
                    }
                    <i className="cmt" onClick={() => goProfileDetailPage(detailPageParam)}>{v.replyCnt}</i>
                    <span className="time">{Utility.writeTimeDffCalc(v.writeDate)}</span>
                  </div>
                  <button className="fixIcon">
                    <img src={`${IMG_SERVER}/profile/fixmark-off.png`} />
                  </button>
                </div>
              </div>
            )
          })}
          {(noticeFixData.fixedFeedList.length === 0 && feedData.feedList.length === 0) && isMyProfile &&
          defaultNotice.map((v, idx) => {
            return (
              <div key={idx}>
                <div className="noticeBox">
                  <div className="badge">Notice</div>
                  <div className="text">{v.contents}</div>
                  <div className="info">
                    <i className="like">0</i>
                    <i className="cmt">0</i>
                  </div>
                  <button className="fixIcon">
                    <img src={`${IMG_SERVER}/profile/fixmark-off.png`} />
                  </button>
                </div>
              </div>
            )
          })

          }
        </Swiper>
      </div>
    </>
  )
}

export default TotalInfo;
