/**
 * @file 모바일/customer/index.js
 * @brief 고객센터
 * @todo
 */

import React from 'react'
import {useHistory, useParams} from 'react-router-dom'

import Header from 'components/ui/header/Header'
//Content
import Faq from './contents/faq/Faq'
import Question from './contents/question/Question'

import './style.scss'
import {useDispatch, useSelector} from "react-redux";

const Customer = () => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  let history = useHistory()
  const params = useParams();
  const categoty = params.type;
  const {token, profile} = globalState;

  const golink = (path) => {
    history.push("/customer/" + path);
  }

  return (
    <div id='customer'>
      {
        !categoty ?
          <>
            <Header position={'sticky'} type={'back'}/>
            <div className='content'>
              <div className='mainText'>
                {!token.isLogin ? <span>달라에게</span> : <span><strong>{profile.nickNm}</strong>님,</span>}
                <span>궁금한게 있으시다구요?</span>
              </div>
              <div className='subText'>
                고객센터 <span>전화문의</span> 또는 <span>1:1문의</span>로 접수해주세요.<br/>
                최대한 빨리 답변 드릴게요!
              </div>
              <div className='categotyWrap'>
                <div className='categotyList'>
                  <div className='categotyImg'></div>
                  <div className='categotyName'>FAQ</div>
                </div>
                <div className='categotyList'>
                  <div className='categotyImg'></div>
                  <div className='categotyName'>운영정책</div>
                </div>
                <div className='categotyList'>
                  <div className='categotyImg'></div>
                  <div className='categotyName'>1:1문의</div>
                </div>
              </div>
            </div>
          </>
        :
        categoty === "faq" ?
          <Faq/>
        :
        categoty === "question" ?
          <Question/>
        :
          <></>
      }
    </div>
  )
}

export default Customer
