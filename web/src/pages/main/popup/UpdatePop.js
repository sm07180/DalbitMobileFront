import React from 'react';

import './updatePop.scss'
import {OS_TYPE} from "context/config";
import {Hybrid, isAndroid, isIos} from "context/hybrid";

const UpdatePopup = (props) => {
  const {updatePopInfo, setUpdatePopInfo} = props;
  const closeUpdatePop = () => {
    setUpdatePopInfo({...updatePopInfo, showPop: false});
  }

  const updateLink = () => {
    if (isAndroid()) {
      if (__NODE_ENV === 'dev') {
        Hybrid('goToPlayStore')
      } else {
        Hybrid('openUrl', updatePopInfo.storeUrl)
      }
    } else if (isIos()) {
      Hybrid('openUrl', updatePopInfo.storeUrl)
    }
  }

  return (
    <section className="updatePop">
      <div className="Wrapper">
        <div className="topBox">
          <button className="closeBtn" onClick={closeUpdatePop} />
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
        <button className="updateBtn" onClick={updateLink}>
          최신 버전으로 업데이트
        </button>
      </div>
    </section>
  );
};

export default UpdatePopup;