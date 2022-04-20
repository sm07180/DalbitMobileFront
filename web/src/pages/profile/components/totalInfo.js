import React, {useEffect, useState, useRef, useContext} from 'react'
import {IMG_SERVER} from 'context/config'
import Swiper from 'react-id-swiper'
// global components
import BadgeItems from 'components/ui/badgeItems/BadgeItems'
// components
// css
import './totalInfo.scss'
import {goProfileDetailPage} from "pages/profile/contents/profileDetail/profileDetail";
import {useHistory} from "react-router-dom";
import FeedLike from "pages/profile/components/FeedLike";
import {useSelector} from "react-redux";
import Api from "context/api";
import {Context} from "context";
import Utility from 'components/lib/utility';

const TotalInfo = (props) => {
  const history = useHistory();
  const {data, goProfile, openPopLike, isMyProfile, noticeData, fetchHandleLike, noticeFixData} = props
  const [openBadge,setOpenBadge] = useState(false);
  const [badgeTotalCnt,setBadgeTotalCnt] = useState(0);
  const profileData = useSelector(state => state.profile);
  const context = useContext(Context);
  const swiperRef = useRef();
  const defaultNotice = [{
    contents: "방송 공지를 등록해주세요.",
    rcv_like_cnt: 0,
    replyCnt: 0
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
    history.push({pathname: "/brdcst", state: {data: data, isMyProfile: isMyProfile}});
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

  // 팀 가입신청 버튼 출력 여부
  const getTeamJoinBtnVisibleYn = () => {
    let result = false;

    if (data.teamSymbolvo !== undefined &&
        data.teamSymbolvo.team_no != 0 &&
        data.teamSymbolvo.bg_cnt < 5 &&
        data.teamJoinCheck === 1) {
      //result = true;
    }

    return result;
  }

  // 팀 가입신청 요청
  const reqTeamJoin = (e) => {
    const { teamNo } = e.currentTarget.dataset;

    const param ={
      teamNo: teamNo,
      memNo: context.token.memNo,
      reqSlct: 'r' //신청구분 [r:가입신청, i:초대]
    };

    Api.getTeamMemReqIns(param).then((res)=>{
      if(res.code === "00000"){
        context.action.toast({
          msg: '팁 가입신청이 완료 되었습니다.'
        });
      } else {
        context.action.toast({ msg: res.message });
      }
    })
  }

  // 팀 상세 페이지 이동
  const goTeamDetailPage = (e) => {
    const { teamNo } = e.currentTarget.dataset;

    if (teamNo !== undefined) {
      history.push(`/team/detail/${teamNo}`);
    };
  };

  /* 피드 삭제시 스와이퍼 업데이트용 */
  useEffect(() => {
    if(swiperRef.current) {
      const swiper = swiperRef.current?.swiper;
      swiper?.update();
    }
      // swiper.slideTo(0);
  }, [noticeData, noticeFixData]);

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
      {(data.teamSymbolvo !== undefined && data.teamSymbolvo.team_no !== 0) &&
        <div className="teamInfo">
          <div className="wrapBox" data-team-no={data.teamSymbolvo.team_no} onClick={goTeamDetailPage}>
            <img src={`${IMG_SERVER}/profile/teamInfo-title.png`} alt="team" className="title" />
            <div className="teamSymbol">
              <img src={`${IMG_SERVER}/team/parts/E/${data.teamSymbolvo.team_bg_code}.png`} />
              <img src={`${IMG_SERVER}/team/parts/B/${data.teamSymbolvo.team_edge_code}.png`} />
              <img src={`${IMG_SERVER}/team/parts/M/${data.teamSymbolvo.team_medal_code}.png`} />
            </div>
            <div className="teamName">{data.teamSymbolvo.team_name}</div>
          </div>
          {/* 자신이 가입된 팀이 없고, 상대방 팀과 같지 않다면 가입 신청 버튼 출력 */}
          {getTeamJoinBtnVisibleYn() && <button data-team-no={data.teamSymbolvo.team_no} onClick={reqTeamJoin}>가입신청</button> }
        </div>
      }
      {data.profMsg &&
      <div className="comment">
        <div className="title">코멘트</div>
        <div className="text" dangerouslySetInnerHTML={{__html: Utility.nl2br(data.profMsg)}} />
      </div>
      }

      {noticeFixData.fixedFeedList.length !== 0 || noticeData.feedList.length !== 0 ?
        <div className="broadcastNotice">
          <div className="title" onClick={onClick}>방송공지</div>
          <Swiper {...swiperParams} ref={swiperRef}>
            {noticeFixData?.fixedFeedList.map((v, idx) => {
              const detailPageParam = {history, action:'detail', type: 'notice', index: v.noticeIdx, memNo: v.mem_no};
              return (
                <div key={idx}>
                  <div className="noticeBox">
                    <div className="badge">Notice</div>
                    <div className="text" onClick={() => goProfileDetailPage(detailPageParam)}>{v.contents}</div>
                    <FeedLike data={v} fetchHandleLike={fetchHandleLike} type={"notice"} likeType={"fix"} detailPageParam={detailPageParam} />
                  </div>
                </div>
              )
            })}
            {noticeData?.feedList.map((v, idx) => {
              const detailPageParam = {history, action:'detail', type: 'notice', index: v.noticeIdx, memNo: v.mem_no};
              return (
                <div key={idx}>
                  <div className="noticeBox">
                    <div className="badge">Notice</div>
                    <div className="text" onClick={() => goProfileDetailPage(detailPageParam)}>{v.contents}</div>
                    <FeedLike data={v} fetchHandleLike={fetchHandleLike} type={"notice"} likeType={"nonFix"} detailPageParam={detailPageParam} />
                  </div>
                </div>
              )
            })}
            {(noticeFixData.fixedFeedList.length === 0 && noticeData.feedList.length === 0) && isMyProfile &&
            defaultNotice.map((v, idx) => {
              return (
                <div key={idx}>
                  <div className="noticeBox">
                    <div className="badge">Notice</div>
                    <div className="text">{v.contents}</div>
                    <div className="info">
                      <i className="likeOff">{v.rcv_like_cnt}</i>
                      <i className="cmt">{v.replyCnt}</i>
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
        : isMyProfile ?
          <div className="broadcastNotice">
            <div className="title" onClick={onClick}>방송공지</div>
            <Swiper {...swiperParams} ref={swiperRef}>
              {defaultNotice.map((v, idx) => {
                return (
                  <div key={idx}>
                    <div className="noticeBox">
                      <div className="badge">Notice</div>
                      <div className="text">{v.contents}</div>
                      <div className="info">
                        <i className="likeOff">{v.rcv_like_cnt}</i>
                        <i className="cmt">{v.replyCnt}</i>
                      </div>
                      <button className="fixIcon">
                        <img src={`${IMG_SERVER}/profile/fixmark-off.png`}/>
                      </button>
                    </div>
                  </div>
                )
              })}
            </Swiper>
          </div>
          :
        <>
        </>
      }
    </>
  )
}

export default TotalInfo;
