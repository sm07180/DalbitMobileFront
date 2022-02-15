import React, {useState, useEffect, useContext} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import {Context} from 'context'

import Api from 'context/api'

import './style.scss'
import Header from "components/ui/header/Header";
import MyInfo from "pages/remypage/components/MyInfo";
import MyMenu from "pages/remypage/components/MyMenu";
import Allim from "pages/remypage/contents/notice/Allim";
import Report from "./contents/report/Report"
import Clip from "./contents/clip/clip"

import {Hybrid, isHybrid} from "context/hybrid";

const myMenuItem = [
  {menuNm: '리포트', path:'report'},
  {menuNm: '클립', path:'clip'},
  {menuNm: '설정', path:'setting'},
  {menuNm: '공지사항', path:'notice'},
  {menuNm: '고객센터', path:'customer'},
]

const Remypage = () => {
  const history = useHistory()
  const params = useParams()
  const settingCategory = params.category;
  //context
  const context = useContext(Context)
  const {splash, token, profile} = context;

  const settingProfileInfo = async (memNo) => {
    const {result, data, message, code} = await Api.profile({params: {memNo: memNo}})
    if (result === 'success') {
      context.action.updateProfile(data);
    } else {
      if (code === '-5') {
        context.action.alert({
          callback: () => history.goBack(),
          msg: message
        })
      } else {
        context.action.alert({
          callback: () => history.goBack(),
          msg: '회원정보를 찾을 수 없습니다.'
        })
      }
    }
  }

  const logout = () => {
    Api.member_logout().then(res => {
      if (res.result === 'success') {
        if (isHybrid()) {
          Hybrid('GetLogoutToken', res.data)
        }
        context.action.updateToken(res.data)
        context.action.updateProfile(null)
        // props.history.push('/')
        window.location.href = '/'
      } else if (res.result === 'fail') {
        context.action.alert({
          title: '로그아웃 실패',
          msg: `${res.message}`
        })
      }
    });
  }

  // 프로필 페이지로 이동
  const goProfile = () => history.push('/myProfile');

  // 페이지 셋팅
  useEffect(() => {
    if (!token.isLogin) {
      return history.replace('/login')
    }

    if(profile.memNo) {
      settingProfileInfo(profile.memNo)
    }
  }, [])

  // 페이지 시작
  switch (settingCategory) {
    case 'report' :
      return(<Report />)
    case 'clip' :
      return(<Clip />)
    case 'notice' :
      return(<Allim />)
    default :
      return(
        <>
        <div id="remypage">
          <Header title={'MY'} />
          <section className="myInfo" onClick={goProfile}>
            <MyInfo data={profile} />
          </section>
          <section className='mydalDetail'>
            <div className="dalCount">{profile?.dalCnt}달</div>
            <div className="buttonGroup">
              <button>내 지갑</button>
              <button className='charge'>충전하기</button>
            </div>
          </section>
          <section className="myMenu">
            <MyMenu data={myMenuItem} memNo={profile?.memNo}/>
            {isHybrid() &&
            <div className="versionInfo">
              <span className="title">버전정보</span>
              <span className="version">현재 버전 {splash?.version}</span>
            </div>
            }
          </section>
          <section className="buttonWrap">
            <button className='logout' onClick={logout}>로그아웃</button>
          </section>
        </div>
      </>
      )
  }
}

export default Remypage
