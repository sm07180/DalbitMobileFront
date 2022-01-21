import React, { useContext } from "react";

import { useHistory } from "react-router-dom";

import "./index.scss";

export default () => {
  const history = useHistory();
  return (
    <div id="popupClipOpen">
      <div className="title">
        <h2>클립 등록 유의사항</h2>
        <button onClick={() => history.goBack()}>확인</button>
      </div>
      <div className="content">
        <h3>선물 지급 안내</h3>
        <ul>
          <li>
            오픈 첫날 등록(업로드) 된 클립들을 확인하고 인정된
            <br />
            개수에 맞춰 일괄 지급됩니다.
          </li>
          <li>
            1인 총 5개의 클립만 인정됩니다.
            <br />
            (1개당 3달, 최대 15달 획득 가능)
          </li>
        </ul>
        <h3>유의사항 안내</h3>
        <ul>
          <li>
            1분 미만의 파일은 보상 제외됩니다. <br />
            ※ 5분 초과되는 파일은 등록되지 않습니다.
            <br />
            (예시: 타인 사진 도용, 음란성, 혐오감 조성, 비속어 등)
          </li>
          <li>본인의 목소리가 담기지 않으면 제외됩니다.</li>
          <li>무성의하거나 취지에 맞지 않으면 제외됩니다.</li>
          <li>저작권에 위배되는 클립은 확인 시 삭제됩니다.</li>
          <li>운영정책에 위배되는 클립의 경우 확인 시 삭제됩니다.</li>
        </ul>
      </div>
    </div>
  );
};
