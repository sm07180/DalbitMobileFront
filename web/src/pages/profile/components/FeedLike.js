import React, {useCallback, useEffect, useRef, useState} from 'react';

import Api from 'context/api';
import Utility from "components/lib/utility";
import {IMG_SERVER} from "context/config";
import {useDispatch, useSelector} from "react-redux";
import {goProfileDetailPage} from "pages/profile/contents/profileDetail/profileDetail";
import {setProfileDetailData} from "redux/actions/profile";

const FeedLike = (props) => {
  const {data,  type, likeType, detailPageParam, detail} = props;
  const infoRef = useRef();
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const detailData = useSelector(state => state.detail);

  const [tooltipEvent, setTooltipEvent] = useState(true);
  const [scrollTooltipEvent, setScrollTooltipEvent] = useState(false);

  {/* 좋아요 툴팁 스크롤 이벤트 */}
  const tooltipScrollEvent = useCallback(() => {
    const infoNode = infoRef.current;
    const infoPosition = infoNode?.offsetTop;
    const scrollBottom = window.scrollY + document.documentElement.clientHeight - 100;
    if (scrollBottom > infoPosition) {
      setScrollTooltipEvent(true);
      setTooltipEvent(false);
    }
  }, []);

  {/* 좋아요 */}
  const fetchHandleLike = async (regNo, mMemNo, like) => {
    if(type === 'notice') {
      const params = {
        regNo: regNo,
        mMemNo: mMemNo,
        vMemNo: globalState.profile.memNo
      };
      if(like === "n") {
        await Api.profileFeedLike(params).then((res) => {
          if(res.result === "success") {
            let temp = data;
            temp.like_yn = "y";
            temp.rcv_like_cnt++;
            dispatch(setProfileDetailData({...detailData, list: temp}));
          }
        }).catch((e) => console.log(e));
      } else if(like === "y") {
        await Api.profileFeedLikeCancel(params).then((res) => {
          if(res.result === "success") {
            let temp = data;
            temp.like_yn = "n";
            temp.rcv_like_cnt--;
            dispatch(setProfileDetailData({...detailData, list: temp}));
          }
        }).catch((e) => console.log(e));
      }
    } else if(type === "feed") {
      const params = {
        feedNo: regNo,
        mMemNo: mMemNo,
        vMemNo: globalState.profile.memNo
      };
      if(like === "n") {
        await Api.myPageFeedLike(params).then((res) => {
          if(res.result === "success") {
            let temp = data;
            temp.like_yn = "y";
            temp.rcv_like_cnt++;
            dispatch(setProfileDetailData({...detailData, list: temp}));
          }
        }).catch((e) => console.log(e));
      } else if(like === "y") {
        await Api.myPageFeedLikeCancel(params).then((res) => {
          if(res.result === "success") {
            let temp = data;
            temp.like_yn = "n";
            temp.rcv_like_cnt--;
            dispatch(setProfileDetailData({...detailData, list: temp}));
          }
        }).catch((e) => console.log(e));
      }
    }
  };

  {/* 좋아요 클릭 이벤트 */}
  const onClick = (e) => {
    const index = e.currentTarget.dataset.index;
    fetchHandleLike((data.noticeIdx ? data.noticeIdx : data.reg_no), data.mem_no, data.like_yn, likeType, index);
  };

  useEffect(() => {
    document.addEventListener('scroll', tooltipScrollEvent);
    return () => {
      document.removeEventListener('scroll', tooltipScrollEvent);
    }
  },[])

  return (
    <div className="info" ref={infoRef}>
      {/* 좋아요 */}
      {type !== "fanBoard" &&
        <i className={`${data?.like_yn === "n" ? "likeOff" : "likeOn"}`} onClick={onClick} data-index={data.noticeIdx ? data.noticeIdx : data.reg_no}>
          {data.rcv_like_cnt ? Utility.printNumber(data.rcv_like_cnt) : 0}
          {tooltipEvent && data?.like_yn === "n" && detail &&
            <div className="likeTooltip"><img src={`${IMG_SERVER}/profile/likeTooltip-fix.png`} alt="좋아요를 눌러주세요" /></div>
          }
          {scrollTooltipEvent && data?.like_yn === "n" && detail &&
            <div className="likeTooltip"><img src={`${IMG_SERVER}/profile/likeTooltip-fix.png`} alt="좋아요를 눌러주세요" /></div>
          }
        </i>
      }
      {/* 댓글 */}
      <i className="cmt" onClick={detail ? null : () => goProfileDetailPage(detailPageParam)}>{(data.replyCnt ? data.replyCnt : data.tail_cnt) ? Utility.printNumber(data.replyCnt ? data.replyCnt : data.tail_cnt) : 0}</i>
      {/* 시간 */}
      {type === "notice" && !detail &&
        <span className="time">{Utility.writeTimeDffCalc(data.writeDate)}</span>
      }
    </div>
  );
};

export default FeedLike;