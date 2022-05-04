import React, {useEffect, useState, useRef} from 'react';

import Api from "context/api";
import Utility from 'components/lib/utility';
import Swiper from 'react-id-swiper'
// global components
import BadgeItems from '../../../components/ui/badgeItems/BadgeItems';
import TeamSymbol from '../../../components/ui/teamSymbol/TeamSymbol';
// components
import FeedLike from "pages/profile/components/FeedLike";
// css
import {IMG_SERVER} from 'context/config';
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {setProfileNoticeData,setProfileNoticeFixData} from "redux/actions/profile";
import {profilePagingDefault} from "redux/types/profileType";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";
import {goProfileDetailPage} from "pages/profile/contents/profileDetail/profileDetail";

const ProfileInfo = (props) => {
  const {data, goProfile, isMyProfile, openSlidePop, noticeData, noticeFixData} = props;
  const history = useHistory();
  const swiperRef = useRef();
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const memberRdx = useSelector((state)=> state.member);
  
  const [openBadge,setOpenBadge] = useState(false);
  const [badgeTotalCnt,setBadgeTotalCnt] = useState(0);
  const defaultNotice = [{
    contents: "방송 공지를 등록해주세요.",
    rcv_like_cnt: 0,
    replyCnt: 0
  }]
  //
  const onOpenBdage = () => setOpenBadge(!openBadge)

  // 스와이퍼
  const swiperParams = {slidesPerView: 'auto'}

  const onClickNotice = () => {
    history.push({pathname: "/brdcst", state: {data: data, isMyProfile: isMyProfile}});
  }

  {/* 방송공지 데이터 호출 */}
  const getNoticeData = (isInit) => {
    const apiParams = {
      memNo: data.memNo ? data.memNo : memberRdx.memNo !== "" ? memberRdx.memNo : globalState.profile.memNo,
      pageNo: isInit ? 1 : noticeData.paging.next,
      pageCnt: isInit? 20: noticeData.paging.records,
      topFix: 0,
    }
    Api.mypage_notice_sel(apiParams).then(res => {
      if (res.result === 'success') {
        const data = res.data;
        const callPageNo = data.paging?.page;
        const isLastPage = data.list.length > 0 ? data.paging.totalPage === callPageNo : true;
        dispatch(setProfileNoticeData({
          ...noticeData,
          feedList: data.paging?.page > 1 ? noticeData.feedList.concat(data.list) : data.list, // 피드(일반)
          paging: data.paging ? data.paging : profilePagingDefault, // 호출한 페이지 정보
          isLastPage,
        }));
      } else {
        dispatch(setGlobalCtxMessage({type:'alert',
          msg: res.message
        }))
      }
    })
  };

  {/* 방송공지(고정) 데이터 호출 */}
  const getNoticeFixData = (isInit) => {
    const apiParams = {
      memNo: data.memNo ? data.memNo : memberRdx.memNo !== "" ? memberRdx.memNo : globalState.profile.memNo,
      pageNo: isInit ? 1 : noticeFixData.paging.next,
      pageCnt: isInit? 20: noticeFixData.paging.records,
    }
    Api.myPageNoticeFixList(apiParams).then((res) => {
      if(res.result === "success") {
        const data = res.data;
        const callPageNo = data.paging?.page;
        const isLastPage = data.fixList.length > 0 ? data.paging.totalPage === callPageNo : true;
        dispatch(setProfileNoticeFixData({
          ...noticeFixData,
          fixedFeedList: data.paging?.page > 1 ? noticeFixData.fixedFeedList.concat(data.fixList) : data.fixList,
          paging: data.paging ? data.paging : profilePagingDefault,
          isLastPage
        }));
      } else {
        dispatch(setGlobalCtxMessage({type:'alert',msg: res.message}));
      }
    }).catch((e) => console.log(e));
  };

  {/* 방송공지 좋아요 */}
  const fetchHandleLike = async (regNo, mMemNo, like, likeType, index) => {
    const params = {
      regNo: regNo,
      mMemNo: mMemNo,
      vMemNo: globalState.profile.memNo
    };
    if(like === "n") {
      await Api.profileFeedLike(params).then((res) => {
        if(res.result === "success") {
          if(likeType === "fix") {
            let tempIndex = noticeFixData.fixedFeedList.findIndex(value => value.noticeIdx === parseInt(index));
            let temp = noticeFixData.fixedFeedList.concat([]);
            temp[tempIndex].like_yn = "y";
            temp[tempIndex].rcv_like_cnt++;
            dispatch(setProfileNoticeFixData({...noticeFixData, fixedFeedList: temp}))
          } else {
            let tempIndex = noticeData.feedList.findIndex(value => value.noticeIdx === parseInt(index));
            let temp = noticeData.feedList.concat([]);
            temp[tempIndex].like_yn = "y";
            temp[tempIndex].rcv_like_cnt++;
            dispatch(setProfileNoticeData({...noticeData, feedList: temp}))
          }
        }
      }).catch((e) => console.log(e));
    } else if(like === "y") {
      await Api.profileFeedLikeCancel(params).then((res) => {
        if(res.result === "success") {
          if(likeType === "fix") {
            let tempIndex = noticeFixData.fixedFeedList.findIndex(value => value.noticeIdx === parseInt(index));
            let temp = noticeFixData.fixedFeedList.concat([]);
            temp[tempIndex].like_yn = "n";
            temp[tempIndex].rcv_like_cnt--;
            dispatch(setProfileNoticeFixData({...noticeFixData, fixedFeedList: temp}))
          } else {
            let tempIndex = noticeData.feedList.findIndex(value => value.noticeIdx === parseInt(index));
            let temp = noticeData.feedList.concat([]);
            temp[tempIndex].like_yn = "n";
            temp[tempIndex].rcv_like_cnt--;
            dispatch(setProfileNoticeData({...noticeData, feedList: temp}))
          }
        }
      }).catch((e) => console.log(e));
    }
  };

  useEffect(() => {
    getNoticeData(true);
    getNoticeFixData(true);
  },[])

  useEffect(() => {
    let badgeLength = 0;
    if(data.badgeSpecial > 0) {
      badgeLength++
      setBadgeTotalCnt(badgeLength)
    }
    if(data.badgePartner) {
      badgeLength++
      setBadgeTotalCnt(badgeLength)
    }
    if(data.isSpecial) {
      badgeLength++
      setBadgeTotalCnt(badgeLength)
    }
    /* 컨텐츠 Dj 뱃지 */
    if(data.isConDj) {
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

    if (data.teamInfo !== undefined &&
        data.teamInfo.team_no != 0 &&
        data.teamInfo.bg_cnt < 5 &&
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
      memName:memberRdx.data.nickNm,
      memNo: globalState.token.memNo,
      reqSlct: 'r' //신청구분 [r:가입신청, i:초대]
    };

    Api.getTeamMemReqIns(param).then((res)=>{
      if(res.code === "00000"){
        dispatch(setGlobalCtxMessage({type:'toast',
          msg: '팀 가입신청이 완료 되었습니다.'
        }));
      } else {
        dispatch(setGlobalCtxMessage({type:'toast', msg: res.message }));
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
  
  {/* 내부 컴포넌트 */}
  // fan top 3, best cupid, team 박스 컴포넌트
  const InfoBox = (props) => {
    const {type, children} = props; // top3, cupid, team
    return (
      <div className="box">
        <div className="title" data-target-type={type} onClick={openSlidePop}>
          <img src={`${IMG_SERVER}/profile/infoTitle-${type}.png`} alt={type} />
        </div>
        {children}
      </div>
    )
  }

  // 방송공지 컴포넌트
  const BroadcastNotice = (props) => {
    return (
      <div className="broadcastNotice">
        <div className="title" onClick={onClickNotice}>방송공지</div>
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
                <div className="noticeBox cursor">
                  <div className="badge">Notice</div>
                  <div className="text">{v.contents}</div>
                  <FeedLike data={v} type={"notice"} likeType={"nonFix"} />
                </div>
              </div>
            )
          })
        }
        </Swiper>
      </div>
    )
  }

  {/* 컴포넌트 시작 */}
  return (
    <section className="profileInfo">
      {/* 뱃지 영역 */}
      {badgeTotalCnt !== 0 &&
      <div className={`badgeInfo ${openBadge ? 'isOpen' : ''}`}>
        <div className="title">배지</div>
        <div className="badgeGroup">
          <BadgeItems data={data} type="isBadgeMultiple" />
          <BadgeItems data={data} type="commonBadgeList" />
        </div>
        {badgeTotalCnt > 3 &&
          <button onClick={onOpenBdage}>열기/닫기</button>
        }
      </div>
      }

      {/* 랭킹 정보 */}
      <div className="rankInfo">
        <InfoBox type="top3">
          <div className="photoGroup">
          {data.fanRank.map((item, index) => {
            return (
              <div className="photo cursor" key={index} onClick={() => goProfile(item.memNo)}>
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
        </InfoBox>
        <InfoBox type="cupid">
          <div className="photo cursor" onClick={() => goProfile(data.cupidMemNo)}>
          {data.cupidProfImg && data.cupidProfImg.path ?
            <img src={data.cupidProfImg.thumb62x62} alt="BEST CUPID"/>
            :
            <img src={`${IMG_SERVER}/common/photoNone-2.png`} alt="기본 이미지" />
          }
          </div>
        </InfoBox>
      </div>

      {/* 팀 정보 */}
      {(data.teamInfo !== undefined && data.teamInfo.team_no !== 0) &&
      <div className="teamInfo" data-team-no={data.teamInfo.team_no} onClick={goTeamDetailPage}>
        <InfoBox type="team">
          <TeamSymbol data={data.teamInfo} />
          <div className="teamName">{data.teamInfo.team_name}</div>
        </InfoBox>
        {/* 자신이 가입된 팀이 없고, 상대방 팀과 같지 않다면 가입 신청 버튼 출력 */}
        {getTeamJoinBtnVisibleYn() && <button data-team-no={data.teamInfo.team_no} onClick={reqTeamJoin}>가입신청</button> }
      </div>
      }
      {data.profMsg &&
      <div className="comment">
        <div className="title">코멘트</div>
        <div className="text" dangerouslySetInnerHTML={{__html: Utility.nl2br(data.profMsg)}} />
      </div>
      }
      {noticeFixData.fixedFeedList.length !== 0 || noticeData.feedList.length !== 0 ?
      <BroadcastNotice />
      : isMyProfile ?
      <BroadcastNotice />
      :
      <></>
      }
    </section>
  )
}

export default ProfileInfo;
