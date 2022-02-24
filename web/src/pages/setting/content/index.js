import React, {useContext} from 'react'
import styled from 'styled-components'
//context
import {SettingStore} from '../store'
import {COLOR_MAIN} from 'context/color'
import {WIDTH_MOBILE} from 'context/config'
import {useHistory} from 'react-router-dom'
//ui
import Accordion from './accordian'
import Use from './use'
import Header from 'components/ui/new_header'
import {useDispatch, useSelector} from "react-redux";
//
const Index = (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const history = useHistory()

  const store = useContext(SettingStore)
  Index.store = store

  const checklogin = () => {
    if (globalState.token.isLogin === true) {
      history.push(`/secession`)
    } else if (globalState.token.isLogin === false) {
      history.push('/login')
    }
  }

  //---------------------------------------------------------------------
  return (
    <Container>
      <Header title="설정" />
      <div>
        {/* <Accordion title="알림설정" content={<h1>adasdas</h1>} /> */}
        <div className="accordian-box">
          <Accordion title="약관 및 정책">
            <Use />
          </Accordion>
        </div>
        {/* if (context.token.isLogin === false) {
    context.action.updatePopup('LOGIN') */}
        {/* <Accordion title="로그아웃" content="3" />
        <Accordion title="회원 탈퇴" content="4" />
        <Accordion title="버전관리" content="5" /> */}
        {/* <button className="otherbtn" onClick={() => check()}>
          로그아웃
        </button> */}
        <button className="otherbtn" onClick={() => checklogin()}>
          회원탈퇴
        </button>
        {/* <button className="otherbtn">
          버전관리
          <span>현재 버전 1.1.20</span>
        </button>  */}
      </div>
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
  /* width: 1210px; */
  margin: 76px auto 0 auto;
  color: #616161;
  > div {
    width: 600px;
    margin: 0 auto;
    @media (max-width: 1240px) {
      width: 100%;
    }
  }
  & .otherbtn {
    margin-top: 20px;
    position: relative;
    width: 100%;
    display: block;
    padding: 19px 10px;
    font-size: 17px;
    font-weight: 700;
    letter-spacing: -0.5px;
    color: #9e9e9e;
    text-align: left;
    & span {
      position: absolute;
      top: calc(50% - 9px);
      right: 10px;
      transform: translateY(-50%);
      font-size: 14px;
      color: #bdbdbd;

      letter-spacing: -0.35px;
      transform: skew(-0.03deg);
    }
  }
  & h1 {
    margin: 30px 0;
    text-align: center;
    color: ${COLOR_MAIN};
    font-size: 20px;
    font-weight: 600;
    letter-spacing: -0.7px;
  }

  @media (max-width: 1240px) {
    width: 100%;
    padding: 0 16px;
  }
  @media (max-width: ${WIDTH_MOBILE}) {
    margin: 0px auto 138px auto;
  }
`
