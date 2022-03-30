import React, {useEffect, useState, useContext, useRef} from 'react'
import {useHistory, useLocation, useParams} from 'react-router-dom'
import {Context} from 'context'
import {IMG_SERVER} from 'context/config'

import Api from 'context/api'
import Header from 'components/ui/header/Header'
import './noticeDetail.scss'
import Utility from "components/lib/utility";
import ShowSwiper from "components/ui/showSwiper/ShowSwiper";
import PopSlide, {closePopup} from "components/ui/popSlide/PopSlide";
import BlockReport from "pages/profile/components/popSlide/BlockReport";
import {useDispatch, useSelector} from "react-redux";
import {setCommonPopupOpenData} from "redux/actions/common";

const NoticeDetail = (props) => {
  const history = useHistory()
  //context
  const context = useContext(Context)
  const {token, profile} = context
  const {memNo, type, index} = useParams();
  //memNo :글이 작성되있는 프로필 주인의 memNo
  const location = useLocation();
  const {feedData, noticeFixData} = location.state;

  return (
    <div id="noticeDetail">
      <Header title="방송공지" type="back">
        <div className="buttonGroup">
          <div className='moreBtn'>
            <img src={`${IMG_SERVER}/profile/sectionEdit.png`} alt="" />
          </div>
        </div>
      </Header>
      <section className='detailWrap'>
        {noticeFixData.fixedFeedList.length !== 0 &&
        noticeFixData.fixedFeedList.map((v, idx) => {
          return (
            <div className="noticeList" key={idx}>
              <div className="noticeBox">
                <div className="badge">Notice</div>
                <div className="text">{v.contents}</div>
                <div className="info">
                  <i className="like">{v.rcv_like_cnt}</i>
                  <i className="cmt">{v.replyCnt}</i>
                  <span className="time">{Utility.writeTimeDffCalc(v.writeDate)}</span>
                </div>
                <button className="fixIcon">
                  <img src={`${IMG_SERVER}/profile/bookmark-on.png`} />
                </button>
              </div>
            </div>
          )
        })}
        {feedData.feedList.length !== 0 &&
        feedData.feedList.map((v, idx) => {
          return (
            <div className="noticeList" key={idx}>
              <div className="noticeBox">
                <div className="badge">Notice</div>
                <div className="text">{v.contents}</div>
                <div className="info">
                  <i className="like">{v.rcv_like_cnt}</i>
                  <i className="cmt">{v.replyCnt}</i>
                  <span className="time">{Utility.writeTimeDffCalc(v.writeDate)}</span>
                </div>
                <button className="fixIcon">
                  <img src={`${IMG_SERVER}/profile/bookmark-off.png`} />
                </button>
              </div>
            </div>
          )
        })}
      </section>
    </div>
  )
}

/**
 * 프로필 상세 관련 주소이동 공통처리
 * @Param:
 * history : useHistory()
 * action : detail, write, modify
 * type : feed, fanBaord
 * index : 글번호
 * targetMemNo : 글주인 memNo
 * */
export const goProfileDetailPage = ({history, action = 'detail', type = 'feed',
                                    index, memNo}) => {
  if(!history) return;
  if (type !== 'feed' && type !== 'fanBoard') return;

  if (action === 'detail') { //상세 memNo : 프로필 주인의 memNo
      history.push(`/profileDetail/${memNo}/${type}/${index}`);
  } else if (action === 'write') { // 작성
    if(type=='feed'){ // 작성 memNo : 프로필 주인의 memNo
      history.push(`/profileWrite/${memNo}/${type}/write`);
    }else if(type ==='fanBoard'){ // 작성 memNo : 프로필 주인의 memNo
      history.push(`/profileWrite/${memNo}/${type}/write`);
    }
  } else if (action === 'modify') { // 수정 memNo : 프로필 주인의 memNo
      history.push(`/profileWrite/${memNo}/${type}/modify/${index}`);
  }
};

export default NoticeDetail
