import React, { useContext } from "react";

import { useHistory } from "react-router-dom";

import "./index.scss";

export default () => {
  const history = useHistory();
  return (
    <div id="popupClipEvent">
      <div className="title">
        <h2>이벤트 유의사항</h2>
        <button onClick={() => history.goBack()}>확인</button>
      </div>
      <div className="content">
        <h3>보상 지급 안내</h3>
        <ul>
          <li>
            오픈 일 기준 7일간 등록된 클립들에 대해 이벤트 기간동안 받은 조회수(25%), 좋아요 수(50%), 받은 선물(25%)을 합산하여
            상위 10명의 인원에게 달을 지급합니다.
          </li>
          <li>이벤트 보상은 이벤트 기간 종료 후 공지사항을 통해 공지 후 일괄 지급됩니다.</li>
        </ul>
        <h3>유의사항 안내</h3>
        <ul>
          <li>본인이 올린 모든 클립에 대한 합산으로 선물이 중복 지급되지 않습니다.</li>
          <li>저작권에 위배되는 클립 등록은 확인 시 삭제되고 선물이 지급되지 않습니다.</li>
          <li>어뷰징 및 정상적이지 않은 방법으로 점수를 획득한 경우 확인 시 운영정책에 의해 제재 대상이 될 수 있습니다. </li>
        </ul>
      </div>
    </div>
  );
};
