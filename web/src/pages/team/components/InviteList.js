import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from "react-router-dom";
// global components
import ListRow from 'components/ui/listRow/ListRow';

const InviteList = (props) => {
  const history = useHistory();

  const photoClick = (memNo) => {
    history.push(`/profile/${memNo}`);
  }
  // 페이지 시작
  return (
    <>
      <div className="titleWrap">
        <h2>나를 초대한 팀</h2>
        <h3>초대에 7일동안 응답하지 않을 경우 자동으로 거절됩니다.</h3>
      </div>
      <div className="listWrap">
        <ListRow photo="" photoClick={() => photoClick()}>
          <div className="listContent">
            <div className="text">🍓딸기딸기🍓</div>
            <div className="listItem">
              <i className="infoRank">21</i>
              <i className="infoPerson">3</i>
            </div>
            <div className="time">2022-06-23 19:23에 신청함</div>
          </div>
          <div className="listBack">
            <div className="buttonGroup">
              <button className="cancel">거절</button>
              <button className="accept">수락</button>
            </div>
          </div>
        </ListRow>
        <ListRow photo="">
          <div className="listContent">
            <div className="text">🍓딸기딸기🍓🍓딸기딸기🍓🍓딸기딸기🍓🍓딸기딸기🍓</div>
            <div className="listItem">
              <i className="infoRank">21</i>
              <i className="infoPerson">3</i>
            </div>
            <div className="time">2022-06-23 19:23에 신청함</div>
          </div>
          <div className="listBack">
            <div className="buttonGroup">
              <button className="cancel">거절</button>
              <button className="accept">수락</button>
            </div>
          </div>
        </ListRow>
        <ListRow photo="">
          <div className="listContent">
            <div className="text">🍓딸기딸기🍓</div>
            <div className="listItem">
              <i className="infoRank">21</i>
              <i className="infoPerson">3</i>
            </div>
            <div className="time">2022-06-23 19:23에 신청함</div>
          </div>
        </ListRow>
        <ListRow photo="">
          <div className="listContent">
            <div className="text">🍓딸기딸기🍓</div>
            <div className="listItem">
              <i className="infoRank">21</i>
              <i className="infoPerson">3</i>
            </div>
            <div className="time">2022-06-23 19:23에 신청함</div>
          </div>
        </ListRow>
      </div>
    </>
  )
}

export default InviteList;