import React, {useState} from 'react';

import '../../style.scss';
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

const MorePopup = (props) => {
  const {profileData, myMemNo, closePopupAction} = props;
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const history = useHistory();

  return (
    <section className='profileMore'>
      <div className="moreList" onClick={true}>메세지</div>
      {!profileData.isFan && <div className="moreList" onClick={true}>방송 알림 {profileData.isReceive ? 'OFF' : 'ON'}</div>}
      <div className="moreList"
          onClick={() => {
            openBlockReportPop({memNo: myMemNo, memNick: profileData.nickNm});
          }}>차단/신고</div>
    </section>
  )
}

export default MorePopup;
