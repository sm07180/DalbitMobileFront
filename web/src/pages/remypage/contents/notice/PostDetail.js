import React, {useEffect, useState, useContext, useRef} from 'react'
import {useHistory, useLocation} from 'react-router-dom'

import Api from 'context/api'
import Utility from 'components/lib/utility'
// global components
import Header from 'components/ui/header/Header'
import moment from "moment";
// components
// css
import '../../style.scss'
import "./notice.scss"
import {Context} from "context";

const PostDetail = () => {
  const location = useLocation();
  const context = useContext(Context);
  const history = useHistory();
  const noticeIdx = location.state;
  const [postDetailInfo, setPostDetailInfo] = useState([]);

  //공지사항 상제 정보 조회
  const fetchPostDetailInfo = () => {
    Api.notice_list_detail({params: {noticeIdx: noticeIdx}}).then((res) => {
      if (res.result === 'success') {setPostDetailInfo(res.data);};
    }).catch((e) => console.log(e));
  };

  //요일 데이터 가공
  const changeDay = (date) => {
    return moment(date, "YYYYMMDDhhmmss").format("YY.MM.DD");
  };

  const contentsClicked = (event) => {
    Utility.contentClickEvent(event, context)
  }

  //해당 공지사항 내용 조회시 공지사항 idx를 로컬에 저장 -> post에서 불어옴
  if (new Date().getMilliseconds() / 1000 - postDetailInfo.writeTs < 7 * 24 * 3600) {
    let mypageNewStg = localStorage.getItem('mypageNew')
    if (mypageNewStg === undefined || mypageNewStg === null || mypageNewStg === '') {
      mypageNewStg = {}
    } else {
      mypageNewStg = JSON.parse(mypageNewStg)
    }
  if (mypageNewStg.notice === undefined || mypageNewStg.notice === null || mypageNewStg.notice === '') {
    mypageNewStg.notice = [parseInt(noticeIdx)]
  } else {
    if (mypageNewStg.notice.find((e) => e === noticeIdx) === undefined) {
      mypageNewStg.notice.push(parseInt(noticeIdx))
    }
  }
  localStorage.setItem('mypageNew', JSON.stringify(mypageNewStg))
  }

  useEffect(() => {
    fetchPostDetailInfo();
  }, []);

  useEffect(() => {
    if(!(context.token.isLogin)) {history.push("/login")}
  }, []);

  return (
    <>
      <div id="notice">
        <div className="postDetail">
          <Header title={'공지사항'} type={'back'}/>
          <section className="detailView">
            <div className="titleWrap">
              <div className="title">{postDetailInfo.title}</div>
              <div className="date">{changeDay(postDetailInfo.writeDt)}</div>
            </div>
            <div className="detailContent" onClick={contentsClicked} >
              {/*<>태그값 정상적으로 출력해주기 위해 사용*/}
              <p dangerouslySetInnerHTML={{__html: postDetailInfo.contents}}/>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

export default PostDetail;
