import React, {useEffect, useState, useContext, useRef} from 'react'
import {useHistory, useLocation} from 'react-router-dom'

import Api from 'context/api'
import Utility from 'components/lib/utility'
// global components
import Header from 'components/ui/header/Header'
import moment from "moment";
import './notice.scss'
// components

const PostDetail = () => {
  const location = useLocation();
  const noticeIdx = location.state;
  const [postDetailInfo, setPostDetailInfo] = useState([]);

  //공지사항 상제 정보 조회
  const fetchPostDetailInfo = () => {
    Api.notice_list_detail({
      params: {
        noticeIdx: noticeIdx
      }
    }).then((res) => {
      if (res.result === 'success') {
        setPostDetailInfo(res.data)
      };
    }).catch((e) => console.log(e));
  };

  //요일 데이터 가공
  const changeDay = (date) => {
    return moment(date, "YYYYMMDDhhmmss").format("YY.MM.DD");
  };

  useEffect(() => {
    fetchPostDetailInfo();
  }, []);

  return (
    <>
      <div id="notice">
        <section className="noticeWrap">
          <div className="postDetail">
            <Header title={'공지사항'} type={'back'} />
            <section className="detailView">
              <div className="titleWrap">
                <div className="title">{postDetailInfo.title}</div>
                <div className="date">{changeDay(postDetailInfo.writeDt)}</div>
              </div>
              <div className="detailContent">
                {/*<>태그값 정상적으로 출력해주기 위해 사용*/}
                <p dangerouslySetInnerHTML={{__html: postDetailInfo.contents}}/>
              </div>
            </section>
          </div>
        </section>
      </div>
    </>
  )
}

export default PostDetail;
