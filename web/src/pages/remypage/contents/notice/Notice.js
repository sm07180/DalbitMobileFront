import React, {useEffect, useState, useContext, useRef} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'

import Api from 'context/api'

// global components
import Header from 'components/ui/header/Header'
import TabBtn from '../../components/TabBtn'
// components

// contents

import './notice.scss'
import Allim from "pages/remypage/contents/notice/Allim";
import Post from "pages/remypage/contents/notice/Post";
import {useDispatch, useSelector} from "react-redux";
import {setNoticeTab} from "redux/actions/notice";


const NoticePage = () => {
  const noticeTabmenu = ['알림','공지사항'];
  const [allimNew, setAllimNew] = useState(0);
  const {tab} = useSelector((state) => state.notice);
  const dispatch = useDispatch();
  const history = useHistory()
  const context = useContext(Context)

  const fetchAllimData = () => {
    let params = {page: 1, records: 1000};
    Api.my_notification(params).then((res) => {
      if(res.result === "success") {
        setAllimNew(res.data.newCnt);
      }
    });
  };

  // const fetchPostData = () => {
  //   let params = {page: 1, records: 1000};
  //   Api.noticeList(params).then((res) => {
  //     if(res.result === "success") {
  //       if(postPageInfo.page !== 1) {
  //         let temp = []
  //         res.data.list.forEach((value) => {
  //           if(postListInfo.list.findIndex((target) => target.noticeIdx == value.noticeIdx) === -1) { //list의 인덱스가 현재 noticeIdx-1일경우 그 값을 temp에 담아줌
  //             temp.push(value);
  //           }
  //         })
  //         //cnt: noticeIdx, list: 스크롤시 출력되는 list, totalPage: 전체 페이지
  //         setPostListInfo({cnt: res.data.list.noticeIdx, list: postListInfo.list.concat(temp), totalPage: res.data.paging.totalPage});
  //       } else {
  //         setPostListInfo({cnt: res.data.list.noticeIdx, list: res.data.list, totalPage: res.data.paging.totalPage});
  //       }
  //     } else {
  //       setPostListInfo({cnt: 0, list: [], totalPage: 0});
  //       context.action.alert({msg: res.message});
  //     }
  //   }).catch((e) => console.log(e));
  // };

  // 로그인 토큰값 확인
  useEffect(() => {
    if(!(context.token.isLogin)) {
      history.push("/login")
    }
    fetchAllimData();
  }, []);

  return (
    <div id="notice">
      <Header type="back"/>
      <section className="noticeWrap">
        <ul className="tabmenu">
          {noticeTabmenu.map((data,index) => {
            const param = {
              item: data,
              tab: tab,
              setTab: (val) => dispatch(setNoticeTab(val))
            }
            return (
              <TabBtn param={param} key={index} />
            )
          })}
          <div className="underline"/>
        </ul>
        {tab === noticeTabmenu[0] ?
          <Allim />
          :
          <Post />
        }
      </section>
    </div>
  )
}

export default NoticePage;
