import React, {useEffect, useState, useContext, useRef} from 'react';

import Api from "context/api";
// global components
import Header from '../../../../components/ui/header/Header';
import NoResult from "../../../../components/ui/noResult/NoResult";
// components
import {BroadcastNoticeWrap} from "../../components/ProfileInfo";
// scss
import './noticeDetail.scss';
import {useHistory, useLocation} from 'react-router-dom';
import {IMG_SERVER} from 'context/config';
// redux
import {useDispatch, useSelector} from "react-redux";
import {setProfileNoticeData, setProfileNoticeFixData} from "redux/actions/profile";
import {goProfileDetailPage} from "pages/profile/contents/profileDetail/profileDetail";
import {profilePagingDefault} from "redux/types/profileType";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

const NoticeDetail = () => {
  const history = useHistory();
  const location = useLocation();
  const {data, isMyProfile} = location.state;
  //context
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const {token} = globalState
  const dispatch = useDispatch();
  const noticeData = useSelector(state => state.brdcst);
  const noticeFixData = useSelector(state => state.noticeFix);

  const getFetchFixData = (pageNo) => {
    const apiParam = {
      memNo: data.memNo,
      pageNo: pageNo ? pageNo : noticeFixData.paging.next,
      pageCnt : noticeFixData.paging.records
    }
    Api.myPageNoticeFixList(apiParam).then((res) => {
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
        dispatch(setGlobalCtxMessage({type:'alert',msg: res.message}));
      }
    }).catch((e) => console.log(e));
  };

  const getFetchData = (pageNo) => {
    const apiParam = {
      memNo: data.memNo,
      pageNo: pageNo ? pageNo : noticeData.paging.next,
      pageCnt: noticeData.paging.records,
      topFix: 0
    }
    Api.mypage_notice_sel(apiParam).then((res) => {
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
        dispatch(setGlobalCtxMessage({type:'alert',msg: res.message}));
      }
    }).catch((e) => console.log(e));
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
          <div className="moreBtn" onClick={onClick}>
            <img src={`${IMG_SERVER}/profile/sectionEdit.png`} alt="" />
          </div>
          }
        </div>
      </Header>
      <section className="detailWrap">
        {noticeFixData.fixedFeedList.length !== 0 &&
        <BroadcastNoticeWrap  broadcastNoticeData={noticeFixData.fixedFeedList} type="fix" />}
        {noticeData.feedList.length !== 0 &&
        <BroadcastNoticeWrap  broadcastNoticeData={noticeData.feedList} />}
        {noticeFixData.fixedFeedList.length === 0 && noticeData.feedList.length === 0 &&
        <NoResult />
        }
      </section>
    </div>
  )
}

export default NoticeDetail;
