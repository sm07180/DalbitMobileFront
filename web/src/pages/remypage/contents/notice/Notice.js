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
  const [allimNew, setAllimNew] = useState(false);
  const [postNew, setPostNew] = useState(false);
  const {tab} = useSelector((state) => state.notice);
  const dispatch = useDispatch();
  const history = useHistory()
  const context = useContext(Context)

  const fetchAllimData = () => {
    let params = {page: 1, records: 1000};
    Api.my_notification(params).then((res) => {
      if(res.result === "success") {
        if(res.data.newCnt !== 0){
          setAllimNew(true);
        } else {
          setAllimNew(false);
        }
      }
    });
  };

  const fetchPostData = () => {
    let params = {noticeType: 0, page: 1, records: 1000};
    Api.noticeList(params).then((res) => {
      if(res.result === "success") {
        if(res.data.list[0].isNew){
          setPostNew(true);
        } else {
          setPostNew(false);
        }
      }
    })
  };

  // 로그인 토큰값 확인
  useEffect(() => {
    if(!(context.token.isLogin)) {
      history.push("/login")
    }
    fetchAllimData();
    fetchPostData();
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
            let newTag = false;

            if(data === "알림") {
              newTag = allimNew
            } else {
              newTag = postNew
            }

            return (
              <TabBtn param={param} key={index} newTag={newTag}/>
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
