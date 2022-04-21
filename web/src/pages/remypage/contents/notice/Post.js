import React, {useEffect, useState, useContext, useRef, useReducer, useCallback} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'

import Api from 'context/api'
// components
import moment from "moment";
import './notice.scss'
import TabBtn from "components/ui/tabBtn/TabBtn";
import Header from "components/ui/header/Header";
import {useSelector} from "react-redux";

const Post = (props) => {
  const {onClick, postListInfo} = props
  const context = useContext(Context);
  const history = useHistory();
  const imgFile = {noticeImg: "ico_notice", eventImg: "ico_event", showImg: "ico_show"} //아이콘 이미지
  const isDesktop = useSelector((state)=> state.common.isDesktop)

  //요일 데이터 가공
  const changeDay = (date) => {
    return moment(date, "YYYYMMDDhhmmss").format("YY.MM.DD");
  };

  //태그, nbsp제거
  const deleteTag = (data) => {
    const regTag = data.replace(/(<([^>]+)>)/ig, "").replace(/&nbsp;/g, "").replace(/&lt;/g, "").replace(/&gt;/g, "");
    return regTag;
  };

  useEffect(() => {
    if(!(context.token.isLogin)) {history.push("/login")}
  }, []);

  return (
    <div className="post">
      {postListInfo.list.map((list,index) => {
        return (
          <div className="listRow" key={index}>
            {/* noticeType 1 = 공지사항, 2 = 이벤트, 3 = 정기정검, 4 = 업데이트, 5 = 언론보도 */}
            <div className="photo">
              <img src={list.noticeType === 1 || list.noticeType === 5 ? `https://image.dalbitlive.com/mypage/dalla/notice/${imgFile.noticeImg}.png`
                : list.noticeType === 2 ? `https://image.dalbitlive.com/mypage/dalla/notice/${imgFile.eventImg}.png`
                  : list.noticeType === 3 || list.noticeType === 4 ? `https://image.dalbitlive.com/mypage/dalla/notice/${imgFile.showImg}.png` : ""} alt=""/>
              {list.isNew && list.read_yn === "n" && <span className="newBadge">N</span>}
            </div>
            <div className="listContent" data-num={list.noticeIdx} data-read={list.read_yn} onClick={onClick}>
              <div className="title">{list.title}</div>
              <div className="text">{deleteTag(list.contents)}</div>
              <div className="date">{changeDay(list.writeDt)}</div>
            </div>
            <button className='listViewBtn'/>
          </div>
        )
      })}
    </div>
  )
}

export default Post;
