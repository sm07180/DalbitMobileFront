import React from 'react';

import './updatePop.scss'

const UpdatePopup = (props) => {
  return (
    <section className="updatePop">
      <div className="Wrapper">
        <div className="topBox">
          <button className="closeBtn" />
          <img
            alt="앱설치 유도 팝업 이미지"
            className="topBox__img"
            src={'https://image.dalbitlive.com/svg/img_app_update@2x.png'}
          />
          <div className="topBox__info">
            <h2>최신 버전이 출시되었습니다.</h2>
            <p>새로운 기능과 안정적인 서비스 이용을 위해 최신 버전으로 업데이트 후 이용해주세요.</p>
          </div>
        </div>
        <button className="updateBtn">
          최신 버전으로 업데이트
        </button>
      </div>
    </section>
  );
};

export default UpdatePopup;