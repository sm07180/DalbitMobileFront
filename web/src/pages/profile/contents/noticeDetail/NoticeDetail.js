import React, {useEffect, useState, useContext, useRef} from 'react'
import {useHistory, useLocation, useParams} from 'react-router-dom'
import {Context} from 'context'
import {IMG_SERVER} from 'context/config'

import Header from 'components/ui/header/Header'
import './noticeDetail.scss'
import Utility from "components/lib/utility";
import {goProfileDetailPage} from "pages/profile/contents/profileDetail/profileDetail";
import API from "context/api";
import {useDispatch, useSelector} from "react-redux";
import {setProfileNoticeData, setProfileNoticeFixData} from "redux/actions/profile";
import {profilePagingDefault} from "redux/types/profileType";
import Api from "context/api";
import FeedLike from "pages/profile/components/FeedLike";
import NoResult from "components/ui/noResult/NoResult";

const NoticeDetail = () => {
  const history = useHistory()
  const location = useLocation();
  const {data, isMyProfile} = location.state;
  //context
  const context = useContext(Context)
  const {token} = context
  const dispatch = useDispatch();
  const noticeData = useSelector(state => state.brdcst);
  const noticeFixData = useSelector(state => state.noticeFix);

  const getFetchData = (pageNo) => {
    const apiParam = {
      memNo: data.memNo,
      pageNo: pageNo ? pageNo : noticeData.paging.next,
      pageCnt: noticeData.paging.records,
      topFix: 0
    }
    API.mypage_notice_sel(apiParam).then((res) => {
      if(res.result === "success") {
        const data = res.data;
        const callPageNo = data.paging?.page;
        const isLastPage = data.list.length > 0 ? data.paging.totalPage === callPageNo : true;
        dispatch(setProfileNoticeData({
          ...noticeData,
          feedList: data.paging?.page > 1 ? noticeData.feedList.concat(data.list) : data.list,
          paging: data.paging ? data.paging : profilePagingDefault,
          isLastPage
        }));
      } else {
        context.action.alert({msg: res.message});
      }
    }).catch((e) => console.log(e));
  }

  const getFetchFixData = (pageNo) => {
    const apiParam = {
      memNo: data.memNo,
      pageNo: pageNo ? pageNo : noticeFixData.paging.next,
      pageCnt : noticeFixData.paging.records
    }
    API.myPageNoticeFixList(apiParam).then((res) => {
      if(res.result === "success") {
        const data = res.data;
        const callPageNo = data.paging?.page;
        const isLastPage = data.fixList.length > 0 ? data.paging.totalPage === callPageNo : true;
        dispatch(setProfileNoticeFixData({
          ...noticeFixData,
          fixedFeedList: data.paging?.page > 1 ? noticeFixData.fixedFeedList.concat(data.fixList) : data.fixList,
          fixCnt: data.fixList.length,
          paging: data.paging ? data.paging : profilePagingDefault,
          isLastPage
        }));
      } else {
        context.action.alert({msg: res.message});
      }
    }).catch((e) => console.log(e));
  }

  const fetchHandleLike = async (regNo, mMemNo, like, type) => {
    const params = {
      regNo: regNo,
      mMemNo: mMemNo,
      vMemNo: context.profile.memNo
    };
    if(like === "n") {
      Api.profileFeedLike(params).then((res) => {
        if(res.result === "success") {
          if(type === "nonFix") {
            getFetchData(1);
          } else if(type === "fix") {
            getFetchFixData(1);
          }
        } else {
          context.action.toast({msg: res.message});
        }
      }).catch((e) => console.log(e));
    } else if(like === "y") {
      Api.profileFeedLikeCancel(params).then((res) => {
        if(res.result === "success") {
          if(type === "nonFix") {
            getFetchData(1);
          } else if(type === "fix") {
            getFetchFixData(1);
          }
        } else {
          context.action.toast({msg: res.message});
        }
      }).catch((e) => console.log(e));
    }
  };

  const onClick = () => {
    goProfileDetailPage({history, action: 'write', type: 'notice', memNo: data.memNo});
  }

  useEffect(() => {
    if(!token.isLogin) {
      history.push("/login");
    }
    getFetchData(1);
    getFetchFixData(1);
  }, []);

  return (
    <div id="noticeDetail">
      <Header title="방송공지" type="back">
        <div className="buttonGroup">
          {isMyProfile &&
          <div className='moreBtn' onClick={onClick}>
            <img src={`${IMG_SERVER}/profile/sectionEdit.png`} alt="" />
          </div>
          }
        </div>
      </Header>
      <section className='detailWrap'>
        {noticeFixData.fixedFeedList.length !== 0 &&
        noticeFixData.fixedFeedList.map((v, idx) => {
          const detailPageParam = {history, action: 'detail', type: 'notice', index: v.noticeIdx, memNo: v.mem_no}
          return (
            <div className="noticeList" key={idx}>
              <div className="noticeBox">
                <div className="badge">Notice</div>
                <div className="text" onClick={() => goProfileDetailPage(detailPageParam)}>{v.contents}</div>
                <FeedLike data={v} fetchHandleLike={fetchHandleLike} likeType={"fix"} type={"notice"} detailPageParam={detailPageParam} />
              </div>
            </div>
          )
        })}
        {noticeData.feedList.length !== 0 &&
        noticeData.feedList.map((v, idx) => {
          const detailPageParam = {history, action: 'detail', type: 'notice', index: v.noticeIdx, memNo: v.mem_no}
          return (
            <div className="noticeList" key={idx}>
              <div className="noticeBox">
                <div className="badge">Notice</div>
                <div className="text" onClick={() => goProfileDetailPage(detailPageParam)}>{v.contents}</div>
                <FeedLike data={v} fetchHandleLike={fetchHandleLike} likeType={"nonFix"} type={"notice"} detailPageParam={detailPageParam} />
              </div>
            </div>
          )
        })}
        {noticeFixData.fixedFeedList.length === 0 && noticeData.feedList.length === 0 &&
        <NoResult />
        }
      </section>
    </div>
  )
}

export default NoticeDetail;
