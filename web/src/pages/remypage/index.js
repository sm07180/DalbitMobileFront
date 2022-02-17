import React, {useEffect} from 'react'
import {useHistory, useParams} from 'react-router-dom'

import Api from 'context/api'

import './style.scss'
import Header from "components/ui/header/Header";
import MyInfo from "pages/remypage/components/MyInfo";
import MydalDetail from "pages/remypage/components/MydalDetail";
import MyMenu from "pages/remypage/components/MyMenu";
import Report from "./contents/report/report"
import {Hybrid, isHybrid} from "context/hybrid";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage, setGlobalCtxUpdateProfile, setGlobalCtxUpdateToken} from "redux/actions/globalCtx";

const myMenuItem = [
  {menuNm: '리포트', path: 'report'},
  {menuNm: '클립'},
  {menuNm: '설정'},
  {menuNm: '공지사항'},
  {menuNm: '고객센터'},
]

const Remypage = () => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const history = useHistory()
  const params = useParams()
  const settingCategory = params.category;
  const {splash, token, profile} = globalState;

  const settingProfileInfo = async (memNo) => {
    const {result, data, message, code} = await Api.profile({params: {memNo: memNo}})
    if (result === 'success') {
      console.log(data);
      dispatch(setGlobalCtxUpdateProfile(data));
    } else {
      if (code === '-5') {
        dispatch(setGlobalCtxMessage({
          type: "alert",
          callback: () => history.goBack(),
          msg: message
        }))
      } else {
        dispatch(setGlobalCtxMessage({
          type: "alert",
          callback: () => history.goBack(),
          msg: '회원정보를 찾을 수 없습니다.'
        }))
      }
    }
  }

  const logout = () => {
    Api.member_logout().then(res => {
      if (res.result === 'success') {
        if (isHybrid()) {
          Hybrid('GetLogoutToken', res.data)
        }
        dispatch(setGlobalCtxUpdateToken(res.data));
        dispatch(setGlobalCtxUpdateProfile(null))
        // props.history.push('/')
        window.location.href = '/'
      } else if (res.result === 'fail') {
        dispatch(setGlobalCtxMessage({
          type: "alert",
          title: '로그아웃 실패',
          msg: `${res.message}`
        }))
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
    default :
      return(
        <>
          <div id="remypage">
            <Header title={'MY'} />
            <section className="myInfo" onClick={goProfile}>
              <MyInfo data={profile} />
            </section>
            <section className='mydalDetail'>
              <MydalDetail data={profile?.dalCnt} />
            </section>
            <section className="myMenu">
              <MyMenu data={myMenuItem} memNo={profile.memNo}/>
              {isHybrid() &&
              <div className="versionInfo">
                <span className="title">버전정보</span>
                <span className="version">현재 버전 {splash?.version}</span>
              </div>
              }
            </section>
            <button className='logout' onClick={logout}>로그아웃</button>
          </div>
        </>
      )
  }
}

export default Remypage
