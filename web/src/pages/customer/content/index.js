import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
//context
import {CustomerStore} from '../store'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import useResize from 'components/hooks/useResize'
//components
import Banner from './banner'
import Tab from './tab'
import Notice from './notice'
import Faq from './faq'
import Personal from './personal'
//
const Index = props => {
  console.log(props.match.params.title)

  //---------------------------------------------------------------------
  //context
  const store = useContext(CustomerStore)
  Index.store = store
  const {title} = props.match.params
  //resize page func
  useEffect(() => {
    if (window.innerWidth <= 600) {
      Store().action.updateCountPage(6)
    } else if (window.innerWidth > 600) {
      Store().action.updateCountPage(10)
    }
  }, [useResize()])
  //---------------------------------------------------------------------
  //makeContents
  // const makeContents = () => {
  //   switch (store.menuCode) {
  //     case 'notice': //------------------------공지사항
  //       return <Notice perPage={Store().page} />
  //     case 'faq': //---------------------------FAQ
  //       return <Faq perPage={Store().page} />
  //     case 'personal': //----------------------1:1문의
  //       return <Personal />
  //     case 'broadcast_guide': //---------------방송 가이드(미정)
  //       return <h1>미정_감출것인지</h1>
  //     default:
  //       break
  //   }
  // }

  function CustomerRoute() {
    switch (title) {
      case 'notice': //공지사항
        return <Notice perPage={Store().page} {...props} />
      case 'faq': //FAQ
        return <Faq perPage={Store().page} {...props} />
      case 'personal': //1:1문의
        return <Personal />
      case 'broadcast_guide': //방송 가이드(미정)
        return <h1>미정_감출것인지</h1>
      default:
        return <Notice perPage={Store().page} {...props} />
    }
  }
  //---------------------------------------------------------------------
  return (
    <Container>
      <h1>고객센터</h1>
      {/* <Banner /> */}
      {/* 탭설정 */}
      <Tab />
      {/* 컨텐츠설정 */}
      {CustomerRoute()}
    </Container>
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
  margin: 0 auto;
  & h1 {
    margin: 40px 0;
    text-align: center;
    color: ${COLOR_MAIN};
    font-size: 28px;
    font-weight: 600;
    letter-spacing: -0.7px;
  }
  @media (max-width: 1240px) {
    width: 95%;
  }
`
