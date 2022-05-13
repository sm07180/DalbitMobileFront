import React, {useEffect, useState, useRef, useCallback} from 'react';

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
import {useHistory, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {setProfileNoticeData,setProfileNoticeFixData} from "redux/actions/profile";
import {profilePagingDefault} from "redux/types/profileType";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";
import {goProfileDetailPage} from "pages/profile/contents/profileDetail/profileDetail";

// fan top 3, best cupid, team 박스 컴포넌트
export const InfoBox = (props) => {
  const {type, children, openSlidePop } = props; // top3, cupid, team
  return (
    <div className="box">
      <div className="title" data-target-type={type} onClick={openSlidePop}>
        <img src={`${IMG_SERVER}/profile/infoTitle-${type}.png`} alt={type} />
      </div>
      {children}
    </div>
  )
}

export const BroadcastNoticeWrap = (props) => {
  const {broadcastNoticeData, type} = props;
  return (
    <>
    {broadcastNoticeData?.map((v, idx) => {
      const detailPageParam = {history, action:'detail', type: 'notice', index: v.noticeIdx, memNo: v.mem_no};
      return (
        <div className="swiper-slide noticeList" key={idx}>
          <BroadcastNotice data={v} type={type} detailPageParam={detailPageParam} />
        </div>
      )
    })}
    </>
  )
}

export const BroadcastNotice = (props) => {
  const {data, type, detailPageParam} = props;
  return (
    <div className="noticeBox">
      <div className="badge">Notice</div>
      <div className="text" onClick={() => goProfileDetailPage(detailPageParam)}>{data.contents}</div>
      <FeedLike data={data} type={"notice"} detailPageParam={detailPageParam} />
      <i className="fixIcon">
        <img src={`${IMG_SERVER}/profile/bookmark-${type === "fix" ? 'on' : 'off'}.png`}/>
      </i>
    </div>
  )
}

export const BroadcastNoticeNone = (props) => {
  const { onClickNotice, defaultNotice } = props;
  return (
    <div className="broadcastNotice">
      <div className="title" onClick={onClickNotice}>방송공지</div>
      <div className="swiper-wrapper">
        <div className="swiper-slide" onClick={onClickNotice}>
          <div className="noticeBox cursor">
            <div className="badge">Notice</div>
            <div className="text">{defaultNotice.contents}</div>
            <div className="info">
              <i className="likeOff">{defaultNotice.rcv_like_cnt}</i>
              <i className="cmt">{defaultNotice.replyCnt}</i>
            </div>
            <button className="fixIcon">
              <img src={`${IMG_SERVER}/profile/fixmark-off.png`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const ProfileInfo = (props) => {
  const {data, goProfile, isMyProfile, openSlidePop} = props;
  const history = useHistory();
  const params = useParams();
  const swiperRef = useRef();
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const noticeFixData = useSelector(state => state.noticeFix);
  const noticeData = useSelector(state => state.brdcst);
  const memberRdx = useSelector((state)=> state.member);
  
  const [openBadge,setOpenBadge] = useState(false);
  const [badgeTotalCnt,setBadgeTotalCnt] = useState(0);
  const defaultNotice = {
    contents: "방송 공지를 등록해주세요.",
    rcv_like_cnt: 0,
    replyCnt: 0
  };
  // 뱃지 영역 열기/닫기
  const onOpenBdage = () => setOpenBadge(!openBadge);

  // 스와이퍼
  const swiperParams = {slidesPerView: 'auto'}

  const onClickNotice = () => {
    history.push({pathname: "/brdcst", state: {data: data, isMyProfile: isMyProfile}});
  }

  {/* 방송공지 데이터 호출 */}
  const getNoticeData = useCallback((isInit) => {
    const apiParams = {
      memNo: params.memNo ? params.memNo : memberRdx.memNo !== "" ? memberRdx.memNo : globalState.profile.memNo,
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
  },[]);

  {/* 방송공지(고정) 데이터 호출 */}
  const getNoticeFixData = (isInit) => {
    const apiParams = {
      memNo: params.memNo ? params.memNo : memberRdx.memNo !== "" ? memberRdx.memNo : globalState.profile.memNo,
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
        <InfoBox type="top3" openSlidePop={openSlidePop}>
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
                <img src={`${IMG_SERVER}/common/photoNone-bgGray.png`} alt="기본 이미지" />
              </div>
            )
          })}
          </div>
        </InfoBox>
        <InfoBox type="cupid" openSlidePop={openSlidePop}>
          <div className="photo cursor" onClick={() => goProfile(data.cupidMemNo)}>
          {data.cupidProfImg && data.cupidProfImg.path ?
            <img src={data.cupidProfImg.thumb62x62} alt="BEST CUPID"/>
            :
            <img src={`${IMG_SERVER}/common/photoNone-bgGray.png`} alt="기본 이미지" />
          }
          </div>
        </InfoBox>
      </div>

      {/* 팀 정보 */}
      {(data.teamInfo !== undefined && data.teamInfo.team_no !== 0) &&
      <div className="teamInfo" data-team-no={data.teamInfo.team_no} onClick={goTeamDetailPage}>
        <InfoBox type="team" openSlidePop={openSlidePop}>
          <TeamSymbol data={data.teamInfo} />
          <div className="teamName">{data.teamInfo.team_name}</div>
        </InfoBox>
        {/* 자신이 가입된 팀이 없고, 상대방 팀과 같지 않다면 가입 신청 버튼 출력 */}
        {getTeamJoinBtnVisibleYn() && <button data-team-no={data.teamInfo.team_no} onClick={reqTeamJoin}>가입신청</button> }
      </div>
      }

      {/* 코맨트 정보 */}
      {data.profMsg &&
      <div className="comment">
        <div className="title">코멘트</div>
        <div className="text" dangerouslySetInnerHTML={{__html: Utility.nl2br(data.profMsg)}} />
      </div>
      }

      {/* 방송공지 정보 */}
      {noticeFixData.fixedFeedList.length !== 0 || noticeData.feedList.length !== 0 ?
      <div className="broadcastNotice">
        <div className="title" onClick={onClickNotice}>방송공지</div>
        <Swiper {...swiperParams} ref={swiperRef}>
          <BroadcastNoticeWrap broadcastNoticeData={noticeFixData.fixedFeedList} type="fix" />
          <BroadcastNoticeWrap broadcastNoticeData={noticeData.feedList} />
        </Swiper>
      </div>
      : isMyProfile ?
      <BroadcastNoticeNone onClickNotice={onClickNotice} defaultNotice={defaultNotice} />
      :
      <></>
      }
    </section>
  )
}

export default ProfileInfo;
