import React, {useState, useEffect, useContext} from 'react'
import {useHistory, useParams} from 'react-router-dom'

import Header from 'components/ui/header/Header'
//Content
import Policy from './contents/policy/Policy'
import Privacy from './contents/privacy/Privacy'
import Minor from './contents/minor/Minor'
import Terms from './contents/terms/Terms'
import Secession from './contents/secession/Secession'

import './style.scss'
import {useDispatch, useSelector} from "react-redux";

const Rule = () => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  let history = useHistory()
  const params = useParams();

  const {token, profile} = globalState
  const category = params.category;

  const golink = (path) => {
    history.push("/rule/" + path);
  }

  return (
    <div id='rule'>
      {!category ?
        <>
          <Header position={'sticky'} title={`${globalState.token.isLogin ? "운영 정책 / 회원탈퇴" : "운영 정책"}`} type={'back'}/>
          <div className='content'>
            <div className='menuWrap'>
              <div className='menuList' onClick={() => {golink("termsT")}}>
                <div className='menuName'>서비스 이용약관</div>
                <span className='arrow'></span>
              </div>
              <div className='menuList' onClick={() => {golink("privacy")}}>
                <div className='menuName'>개인정보 취급방침</div>
                <span className='arrow'></span>
              </div>
              <div className='menuList' onClick={() => {golink("minor")}}>
                <div className='menuName'>청소년 보호정책</div>
                <span className='arrow'></span>
              </div>
              <div className='menuList' onClick={() => {golink("policy")}}>
                <div className='menuName'>운영정책</div>
                <span className='arrow'></span>
              </div>
              {
                globalState.token.isLogin &&
                <>
                  <div className='menuList' onClick={() => {golink("secession")}}>
                    <div className='menuName'>회원탈퇴</div>
                    <span className='arrow'></span>
                  </div>
                  <div className='menuList uid'>
                    <div className='menuName'>사용자 ID</div>
                    <span className='uid'>{profile.memId}</span>
                  </div>
                </>
              }
            </div>
          </div>
        </>
        :
        category === "policy" ?
          <Policy/>
          :
          category === "privacy" ?
            <Privacy/>
            :
            category === "minor" ?
              <Minor/>
              :
              category === "secession" ?
                <Secession/>
                :
                (category === "terms" || category === "termsT") &&
                <Terms/>
      }
    </div>
  )
}

export default Rule
