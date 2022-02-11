/**
 * @file 모바일/customer/index.js
 * @brief 고객센터
 * @todo
 */

import React, {useState, useEffect, useContext} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import {Context} from 'context'

import Header from 'components/ui/header/Header'
//Content
import Faq from './contents/faq/Faq'
import Inquire from './contents/inquire'

import './style.scss'

const Customer = () => {
  let history = useHistory()
  const params = useParams();
  const category = params.title;
  const globalCtx = useContext(Context);
  const {token, profile} = globalCtx;
  const [categoryList, setCategory] = useState([
    {
      name : "FAQ",
      file : "customerMainList-faq",
      path : "faq"
    },
    {
      name : "운영정책",
      file : "customerMainList-policy",
      path : "policy"
    },
    {
      name : "1:1문의",
      file : "customerMainList-inquire",
      path : "inquire"
    },
  ]);

  const golink = (path) => {
    history.push("/customer/" + path);
  }

  return (
    <div id='customer'>
      {
        !category ?
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
              <div className='categoryWrap'>
                {
                  categoryList.map((list, index) => {
                    return (
                      <div className='categoryList' key={index} onClick={() => golink(list.path)}>
                        <div className='categoryImg'>
                          <img src={`https://image.dalbitlive.com/customer/main/${list.file}.png`} alt="FAQ" />
                        </div>
                        <div className='categoryName'>{list.name}</div>
                      </div>
                    )
                  })
                } 
              </div>
              <div className='infomation'>
                <div className='wait'>잠깐!!</div>
                <div className='textWrap'>
                  <span>자주 묻는 질문은 여기에 모아두었어요.</span>
                  <span onClick={() => golink("faq")}>FAQ 보러가기</span>
                </div>
                <div className='telWrap'>
                  <div className='telRow'>
                    <span className='telTitle'>고객센터(국내)</span>
                    <span className='telNum'>1522-0251</span>
                  </div>
                  <div className='telRow'>
                    <span className='telTitle'>고객센터(해외)</span>
                    <span className='telNum'>+82-1522-0251</span>
                  </div>
                </div>
                <div className='counselingTime'>상담시간 : 평일 10:00 ~ 18:00  토/일/공휴일 제외</div>
              </div>
            </div>
          </>
        :
        category === "faq" ?
          <Faq/>
        :
        category === "inquire" ?
          <Inquire/>
        :
          <></>
      }
    </div>
  )
}

export default Customer
