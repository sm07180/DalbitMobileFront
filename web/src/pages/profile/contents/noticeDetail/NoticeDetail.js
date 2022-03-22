import React, {useEffect, useState, useContext, useRef} from 'react'
import {useHistory, useParams} from 'react-router-dom'
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
        <div className="noticeList">
          <div className="noticeBox">
            <div className="badge">Notice</div>
            <div className="text">세아의 팬닉입니다. 닉변은 피해줘요!
            다른 방을 청취하고 선물하는 것은 세아의 팬닉입니다. 닉변은 피해줘요!
            다른 방을 청취하고 선물하는 것은</div>
            <div className="info">
              <i className="like">156</i>
              <i className="cmt">123</i>
              <span className="time">3시간 전</span>
            </div>
            <button className="fixIcon">
              <img src={`${IMG_SERVER}/profile/bookmark-on.png`} />
            </button>
          </div>
        </div>
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
