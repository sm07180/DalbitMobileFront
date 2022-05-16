import React from 'react';

// global components
import Header from 'components/ui/header/Header';
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'

import '../scss/firstClipUpload.scss';

import {IMG_SERVER} from 'context/config'

const firstClip = () => {
  return (
    <div id="firstClipPage">
      <Header type="back"/>
      <section className='titleWrap'>
        <h1>첫 클립을 올려보세요!</h1>
        <p>청취 10건, 좋아요 5개를 달성하면 5달을 드려요.</p>
      </section>
      <section className='contentWrap'>
        <img src={`${IMG_SERVER}/clip/dalla/firstClipUpload.png`} />
        <p>- 1분 이상 청취해야 청취로 인정됩니다.</p>
        <p>- 비공개로 전환되거나 저작권을 침해하는 클립에는 지급되지 않습니다.</p>
      </section>
      <section className='bottomWrap'>
        <div>
          <span>준비된 파일이 없나요?</span>
          <button>녹음해서 올리기</button>
        </div>
        <SubmitBtn text="클립 올리기"/>
      </section>
    </div>
  );
};

export default firstClip;