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

import './style.scss'
import InquireDetail from "pages/recustomer/contents/inquireDetail/InquireDetail";
import Faq from "pages/recustomer/contents/faq/FaqTest";
import Inquire from "pages/recustomer/contents/inquire/InquireTest";

const Customer = () => {
  const history = useHistory()
  const params = useParams();
  const context = useContext(Context);
  const [categoryList, setCategory] = useState([
    {name : "FAQ", file : "customerMainList-faq", path : "/customer/faq"},
    {name : "운영정책", file : "customerMainList-policy", path : "/rule"},
    {name : "1:1문의", file : "customerMainList-inquire", path : "/customer/inquire"}
  ]);

  const onClick = (e) => {
    const path = e.currentTarget.dataset.idx
    history.push(path);
  }

  return (
    <div id='customer'>
      {!params.title ?
        <>
          <Header position={'sticky'} type={'back'}/>
          <div className='content'>
            <div className='mainText'>
              {!context.token.isLogin ? <span>달라에게</span> : <span><strong>{context.profile.nickNm}</strong>님,</span>}
              <span>궁금한게 있으시다구요?</span>
            </div>
            <div className='subText'>
              고객센터 <span>전화문의</span> 또는 <span>1:1문의</span>로 접수해주세요.<br/>
              최대한 빨리 답변 드릴게요!
            </div>
            <div className='categoryWrap'>
              {categoryList.map((list, index) => {
                return (
                  <div className='categoryList' key={index} data-idx={list.path} onClick={onClick}>
                    <div className='categoryImg'>
                      <img src={`https://image.dalbitlive.com/customer/main/${list.file}.png`} alt={list.path} />
                    </div>
                    <div className='categoryName'>{list.name}</div>
                  </div>
                )
              })}
            </div>
            <div className='infomation'>
              <div className='wait'>잠깐!!</div>
              <div className='textWrap'>
                <span>자주 묻는 질문은 여기에 모아두었어요.</span>
                <span data-link="faq" onClick={onClick}>FAQ 보러가기</span>
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
        params.title === "faq" ?
        <Faq/>
        :
        (params.title === "inquire" && !params.num) ?
        <Inquire/>
        :
        (params.title === "inquire" && params.num) &&
        <InquireDetail/>
      }
    </div>
  )
}

export default Customer;
