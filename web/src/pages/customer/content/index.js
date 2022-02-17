/**
 * @file 모바일/index.js
 * @brief 고객센터 index
 *
 */
import React, {useContext, useEffect} from 'react'
import {Route, Switch} from 'react-router-dom'

import styled from 'styled-components'
//context
import {CustomerStore} from '../store'
import {COLOR_MAIN} from 'context/color'
import useResize from 'components/hooks/useResize'
//components
import Notice from './notice/list'
import NoticeDetail from './notice/detail'
import Event from './event/index'
import Faq from './faq/list'
import FaqDetail from './faq/detail'
import Personal from './personal/index'
import QnaDetail from './personal/qna-detail'
import QanInfo from '../content/personal/qna_info.tsx'
import AppInfo from './app_info'
import AppInfoRoute from './app_info/route'

import Layout from 'pages/common/layout/new_layout'
import EventWinner from 'pages/customer/content/event/event_winner.js'
import WinnerInfoForm from 'pages/customer/content/event/winner_info_form.js'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxNoServiceInfo} from "redux/actions/globalCtx";
//

const Index = (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  //---------------------------------------------------------------------
  //context
  const store = useContext(CustomerStore)
  Index.store = store

  const {title, num} = props.match.params
  let header = ''

  switch (title) {
    case 'notice':
      header = '공지사항'
      break
    case 'event':
      if (num === undefined) {
        header = '이벤트'
      } else if (num === 'winnerInfo') {
        header = '추가 정보 입력'
      } else {
        header = '당첨자 발표'
      }
      break
    case 'faq':
      header = 'FAQ'
      break
    case 'personal':
      header = '1:1 문의'
      break
    case 'qnaList':
      header = '1:1 문의'
      break
    case 'qna_info':
      header = '소중한 의견을 기다립니다'
      break
    case 'appInfo':
      header = '운영 정책 / 회원 탈퇴'
      if (num === 'service') {
        header = '서비스 이용약관'
      } else if (num === 'privacy') {
        header = '개인정보 취급방침'
      } else if (num === 'youthProtect') {
        header = '청소년 보호정책'
      } else if (num === 'operating') {
        header = '운영정책'
      } else {
        header = '운영 정책 / 회원 탈퇴'
      }
      break
    default:
      header = '공지사항'
      break
  }
  //resize page func
  useEffect(() => {
    if (window.innerWidth <= 600) {
      //Store().action.updateCountPage(7)
    } else if (window.innerWidth > 600) {
      //Store().action.updateCountPage(10)
    }
  }, [useResize()])
  //---------------------------------------------------------------------

  function CustomerRoute() {
    switch (title) {
      case 'notice': //공지사항
        return <Notice {...props} />
      case 'faq':
        return <Faq {...props} />
      // case 'faq': //FAQ
      //   return <Faq perPage={Store().page} {...props} />
      // case 'personal': //1:1문의
      //   return <Personal perPage={Store().page} {...props} />
      // case 'broadcast_guide': //방송 가이드(미정)
      //   return <h1>미정_감출것인지</h1>
      default:
        return <Notice />
    }
  }

  useEffect(() => {
    const noServiceInfo = globalState.noServiceInfo;
    const isQnaPage = title === 'personal' || title === 'qnaList';

    if (globalState.token.isLogin) {
      if (noServiceInfo.americanAge >= noServiceInfo.limitAge) {
        dispatch(setGlobalCtxNoServiceInfo({...globalState.noServiceInfo, showPageYn: "n", passed: true}));
      } else if (globalState.profile.memJoinYn === 'o' || isQnaPage) {
        dispatch(setGlobalCtxNoServiceInfo({...globalState.noServiceInfo, showPageYn: "n"}));
      } else {
        dispatch(setGlobalCtxNoServiceInfo({...globalState.noServiceInfo, showPageYn: "y"}));
      }
    }
  }, [title]);

  //---------------------------------------------------------------------
  return (
    <Layout {...props} status="no_gnb" header={header}>
      <Container>
        {/* <h1>고객센터</h1> */}
        {/* <Banner /> */}
        {/* 탭설정 */}
        {/* <Tab /> */}
        {/* 컨텐츠설정 */}
        {/* {CustomerRoute()} */}
        <Switch>
          <Route path="/customer" exact component={Notice} />
          <Route path="/customer/notice" exact component={Notice} />
          <Route path="/customer/notice/:number" exact component={NoticeDetail} />
          <Route path="/customer/event" exact component={Event} />
          <Route path="/customer/event/winnerInfo" exact component={WinnerInfoForm} />
          <Route path="/customer/event/:number" exact component={EventWinner} />
          <Route path="/customer/faq" exact component={Faq} />
          <Route path="/customer/faq/:number" exact component={FaqDetail} />
          <Route path="/customer/personal" exact component={Personal} />
          <Route path="/customer/qnaList" exact component={Personal} />
          <Route path="/customer/qnaList/:number" exact component={QnaDetail} />
          <Route path="/customer/appInfo" exact component={AppInfo} />
          <Route path="/customer/appInfo/:title" exact component={AppInfoRoute} />
          <Route path="/customer/qna_info" exact component={QanInfo} />
        </Switch>
      </Container>
    </Layout>
  )
}
export default Index
//---------------------------------------------------------------------
/**
 * @title 스토어객체
 */
export const Store = () => {
  return Index.store
}
//---------------------------------------------------------------------
const Container = styled.div`
  margin: 0px auto 0 auto;
  background-color: #eeeeee;
  padding-top: 12px;
  & h1 {
    margin: 26px 0;
    text-align: center;
    color: ${COLOR_MAIN};
    font-size: 20px;
    font-weight: 600;
    letter-spacing: -0.7px;
  }
  @media (max-width: 1240px) {
    width: 100%;
  }
`
