import React from 'react';
import {useSelector} from "react-redux";

import {IMG_SERVER} from 'context/config'
import {Hybrid} from 'context/hybrid'

import Header from 'components/ui/header/Header'

import './style.scss'

const contentLab = () => {
  const isDesktop = useSelector((state)=> state.common.isDesktop)
  const form = () =>{
    if(isDesktop){
      window.open('https://docs.google.com/forms/d/e/1FAIpQLSeStgFZwGDjf9NEV373bGK65s5teMEmM3j6UZvBtpQVPS3YxA/viewform')
    }else{
      Hybrid('openUrl', `https://docs.google.com/forms/d/e/1FAIpQLSeStgFZwGDjf9NEV373bGK65s5teMEmM3j6UZvBtpQVPS3YxA/viewform`)
    }
  }

  return (
    <div id="contentLab">
      <Header title="콘텐츠 지원센터" type="back"/>
      <section>
        <img src={`${IMG_SERVER}/event/contentLab/main.png`} alt="콘텐츠 지원센터" />
        <button className="applyBtn" onClick={()=>{form()}}>
          <img src={`${IMG_SERVER}/event/contentLab/applybutton.png`} alt="지원하러 가기" />
        </button>
      </section>
      <section className="notice">
        <div className="title">주의사항</div>
        <ul>
          <li>지원받은 콘텐츠에 대한 저작권은 dalla에 귀속되어 있으며, dalla 광고에 사용될 수 있습니다.</li>
          <li>누적 방송시간이 10시간 이상인 방송인은 누구나  지원 가능합니다. 다만, 최근 1개월 내 제재이력이 있거나 2개월 내 방송이력이 없는 분은 지원이 어려운점 참고 부탁드립니다.</li>
          <li>방송목적과 촬영장소, 콘텐츠 내용 등 세부계획을 최대한 자세하게 작성해 주시면 좀 더 다양한 지원을 받을 수 있습니다.</li>
          <li>담당자와의 충분한 커뮤니케이션을 위해 방송희망일로 부터 최소 2주의 여유를 두고 신청해주세요.</li>
          <li>나만의 개성 넘치는 특별한 콘텐츠나 하고싶었던 콘텐츠 아이디어가 있다면 언제든 콘텐츠지원센터로 신청부탁드립니다.</li>
          <li>지원받은 콘텐츠 규모에 따라 진행중인 이벤트에 참가가 불가능할 수 있습니다.</li>
          <li>단순 기념일 방송은 지원이 불가능합니다.</li>
        </ul>
        <div className="logo">
          <img src={`${IMG_SERVER}/common/logo/logo-white_opacity.png`} alt="dalla" />
        </div>
      </section>
    </div>
  );
};

export default contentLab;