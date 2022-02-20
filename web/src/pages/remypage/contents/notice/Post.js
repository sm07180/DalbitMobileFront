import React, {useEffect, useState, useContext, useRef, useReducer} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'

import Api from 'context/api'
// global components
import ListRow from 'components/ui/listRow/ListRow'
// components
import moment from "moment";
import './notice.scss'
import TabBtn from "components/ui/tabBtn/TabBtn";
import Header from "components/ui/header/Header";

const Post = () => {
  const context = useContext(Context);
  const history = useHistory();
  const [postListInfo, setPostListInfo] = useState({cnt: 0, list: [], totalPage: 0}); //공지사항 리스트
  const [postPageInfo, setPostPageInfo] = useState({noticeType: 0, page: 1, records: 20}); //페이지 스크롤
  const imgFile = {noticeImg: "ico_notice", eventImg: "ico_event", showImg: "ico_show"} //아이콘 이미지

  // 조회 API
  const fetchData = () => {
    Api.noticeList(postPageInfo).then((res) => {
      if(res.result === "success") {
        if(postPageInfo.page !== 1) {
          let temp = []
          res.data.list.forEach((value) => {
            if(postListInfo.list.findIndex((target) => target.noticeIdx == value.noticeIdx) === -1) { //list의 인덱스가 현재 noticeIdx-1일경우 그 값을 temp에 담아줌
              temp.push(value);
            }
          })
          //cnt: noticeIdx, list: 스크롤시 출력되는 list, totalPage: 전체 페이지
          setPostListInfo({cnt: res.data.list.noticeIdx, list: postListInfo.list.concat(temp), totalPage: res.data.paging.totalPage});
        } else {
          setPostListInfo({cnt: res.data.list.noticeIdx, list: res.data.list, totalPage: res.data.paging.totalPage});
        }
      } else {
        setPostListInfo({cnt: 0, list: [], totalPage: 0});
        context.action.alert({msg: res.message});
      }
    }).catch((e) => console.log(e));
  };

  //스크롤 이벤트
  const scrollEvt = () => {
    const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight
    const body = document.body
    const html = document.documentElement
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
    const windowBottom = windowHeight + window.pageYOffset;

    if(postListInfo.totalPage > postPageInfo.page && windowBottom >= docHeight -300) { //totalPage가 현재 page보다 클경우
      setPostPageInfo({...postPageInfo, page: postPageInfo.page+1});
      window.removeEventListener("scroll", scrollEvt);
    } else if(postListInfo.list.noticeIdx === postListInfo.list.length) {
      window.removeEventListener("scroll", scrollEvt);
    }
  }

  //요일 데이터 가공
  const changeDay = (date) => {
    return moment(date, "YYYYMMDDhhmmss").format("YY.MM.DD");
  };

  //공지사항 세부페이지 이동
  const onClick = (e) => {
    const {num} = e.currentTarget.dataset
    history.push({pathname: `/notice/${num}`, state: num});
  };

  //태그, nbsp제거
  const deleteTag = (data) => {
    const regTag = data.replace(/(<([^>]+)>)/ig, "").replace(/&nbsp;/g, "").replace(/&lt;/g, "").replace(/&gt;/g, "");
    return regTag;
  };

  const tabClick = () => {

  }

  useEffect(() => {
    fetchData();
  }, [postPageInfo]);

  useEffect(() => {
    window.addEventListener("scroll", scrollEvt);
    return () => {
      window.removeEventListener("scroll", scrollEvt);
    }
  }, [postListInfo]);

  useEffect(() => {
    if(!(context.token.isLogin)) {history.push("/login")}
  }, []);

  return (
    <div id="notice">
      <section className="noticeWrap">
        <div className="post">
          {postListInfo.list.map((list,index) => {
            return (
              <div key={index}>
                {/* noticeType 1 = 공지사항, 2 = 이벤트, 3 = 정기정검, 4 = 업데이트, 5 = 언론보도 */}
                <ListRow photo={list.noticeType === 1 || list.noticeType === 5 ? `https://image.dalbitlive.com/mypage/dalla/notice/${imgFile.noticeImg}.png`
                  : list.noticeType === 2 ? `https://image.dalbitlive.com/mypage/dalla/notice/${imgFile.eventImg}.png`
                    : list.noticeType === 3 || list.noticeType === 4 ? `https://image.dalbitlive.com/mypage/dalla/notice/${imgFile.showImg}.png` : ""}>
                  <div className="listContent" data-num={list.noticeIdx} onClick={onClick}>
                    <div className="title">{list.title}</div>
                    <div className="text">{deleteTag(list.contents)}</div>
                    <div className="date">{changeDay(list.writeDt)}</div>
                  </div>
                  <button className='listViewBtn'/>
                </ListRow>
              </div>
            )
          })}
        </div>
      </section>
    </div>

  )
}

export default Post;
