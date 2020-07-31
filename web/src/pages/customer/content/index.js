/**
 * @file 모바일/index.js
 * @brief 고객센터 index
 *
 */
import React, {useState, useEffect, useContext} from 'react'
import {Switch, Route} from 'react-router-dom'

import styled from 'styled-components'
//context
import {CustomerStore} from '../store'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import useResize from 'components/hooks/useResize'
//components
import Banner from './banner'
import Tab from './tab'
import Notice from './notice/list'
import NoticeDetail from './notice/detail'
// import Faq from './faq/index';
import Faq from './faq/list'
import FaqDetail from './faq/detail'
import Personal from './personal/index'
import QnaDetail from './personal/qna-detail'
import AppInfo from './app_info'
import AppInfoRoute from './app_info/route'
import Header from './header'

import Layout from 'pages/common/layout/new_layout'
//

const Index = (props) => {
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
    case 'faq':
      header = 'FAQ'
      break
    case 'personal':
      header = '1:1 문의'
      break
    case 'appInfo':
      header = '앱정보'
      if (num === 'service') {
        header = '서비스 이용 약관'
      } else if (num === 'privacy') {
        header = '개인정보 취급방침'
      } else if (num === 'youthProtect') {
        header = '청소년 보호정책'
      } else if (num === 'operating') {
        header = '운영정책'
      } else {
        header = '앱정보'
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

  //---------------------------------------------------------------------
  return (
    <Layout {...props} status="no_gnb" header={header}>
      <Container>
        {/* <Header>
          <div className="category-text">고객센터</div>
        </Header> */}
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
          <Route path="/customer/faq" exact component={Faq} />
          <Route path="/customer/faq/:number" exact component={FaqDetail} />
          <Route path="/customer/personal" exact component={Personal} />
          <Route path="/customer/qnaList" exact component={Personal} />
          <Route path="/customer/qnaList/:number" exact component={QnaDetail} />
          <Route path="/customer/appInfo" exact component={AppInfo} />
          <Route path="/customer/appInfo/:title" exact component={AppInfoRoute} />
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
  width: 1210px;
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
