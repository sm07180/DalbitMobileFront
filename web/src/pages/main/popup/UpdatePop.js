import React from 'react';

import './updatePop.scss'
import {Hybrid, isAndroid, isIos} from "context/hybrid";

const UpdatePopup = (props) => {
  const {updatePopInfo, setUpdatePopInfo} = props;
  const closeUpdatePop = () => {
    setUpdatePopInfo({...updatePopInfo, showPop: false});
  }

  const updateLink = () => {
    if (isAndroid()) {
      Hybrid('goToPlayStore')
      /*if (__NODE_ENV === 'dev') {
        Hybrid('goToPlayStore')
      } else {
        Hybrid('openUrl', updatePopInfo.storeUrl)
      }*/
    } else if (isIos()) {
      Hybrid('openUrl', updatePopInfo.storeUrl)
    }
  }

  return (
    <div id="updatePop">
      <section className="wrapper">
        <div className="topBox">
          <img
            src={'https://image.dallalive.com/svg/img_app_update@2x.png'}
            alt="앱설치 유도 팝업 이미지"
          />
          <div className="textBox">
            <h2>최신 버전이 출시되었습니다.</h2>
            <p>새로운 기능과 안정적인 서비스 이용을 위해 최신 버전으로 업데이트 후 이용해주세요.</p>
          </div>
        </div>
        <button className="updateBtn" onClick={updateLink}>
          최신 버전으로 업데이트
        </button>
        <button className="closeBtn" onClick={closeUpdatePop} />
      </section>
    </div>
  );
};

export default UpdatePopup;