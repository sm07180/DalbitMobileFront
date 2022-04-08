import React from 'react';
import {useSelector} from "react-redux";

import {IMG_SERVER} from 'context/config'
import {Hybrid} from 'context/hybrid'

import Header from 'components/ui/header/Header'

import './style.scss'


const contentStar = () => {
  const isDesktop = useSelector((state)=> state.common.isDesktop)
  const form = () =>{
    if(isDesktop){
      window.open('https://docs.google.com/forms/d/e/1FAIpQLSeStgFZwGDjf9NEV373bGK65s5teMEmM3j6UZvBtpQVPS3YxA/viewform')
    }else{
      Hybrid('openUrl', `https://docs.google.com/forms/d/e/1FAIpQLSeStgFZwGDjf9NEV373bGK65s5teMEmM3j6UZvBtpQVPS3YxA/viewform`)
    }
  }

  return (
    <div id="contentStar">
      <Header title="콘텐츠 스타" type="back"/>
      <section className="mainWrap">
        <img src={`${IMG_SERVER}/event/contentStar/main.png`} alt="콘텐츠 스타" />
        <button className="applyBtn" onClick={()=>{form()}}>
          지원하러 가기
        </button>
      </section>
    </div>
  );
};

export default contentStar;