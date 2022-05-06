/**
 * @file terms/content/event_gift_detail.js
 * @brief 이벤트 경품 상세소개
 */
import React from 'react'
import {useHistory} from 'react-router-dom'

import './scss/specialdj-starting.scss'
import NumberImg01 from './static/specialdj_starting_number01.png'
import NumberImg02 from './static/specialdj_starting_number02.png'
import NumberImg03 from './static/specialdj_starting_number03.png'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxVisible} from "redux/actions/globalCtx";

////---------------------------------------------------------------------
export default (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const history = useHistory()

  //---------------------------------------------------------------------
  return (
    <div id="specialdjStarting">
      <h1>스페셜 DJ 선발 요건</h1>

      <div className="popupScroll">
        <div className="popupScroll--margin">
          <div className="popupScroll--content">
            <p className="notice">스페셜 DJ 선발요건은 다음과 같습니다.</p>

            <ul className="list">
              <li>
                <img src={NumberImg01} className="numberImg" />
                정량적 지표에 대한 내용은
                <br />
                방송 점수, 청취자 점수, 방송 호응도,
                <br />
                받은 선물 총 4개 항목입니다.(각각 25%)
              </li>

              <li>
                <img src={NumberImg02} className="numberImg" />
                공개된 4개 항목을 합산하여
                <br />총 100점으로 점수를 산정합니다.
              </li>

              <li>
                <img src={NumberImg03} className="numberImg" />
                합산된 100점에 DJ 타임 랭킹 가산점
                <br />
                (1위: 1.5점 / 0.5위: 1점 / 3위 0.3점)을
                <br />
                적용하여 총 110점 만점으로 총 점수를
                <br />
                산정합니다.
                <br />
              </li>
            </ul>
            <p className="subText">※ 자세한 내용은 공지사항을 통해 확인 바랍니다.</p>
            <button
              className="button"
              onClick={() => {
                dispatch(setGlobalCtxVisible(false));
                history.push('/customer/notice/330')
              }}>
              공지사항 보러가기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
