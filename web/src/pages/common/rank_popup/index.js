import React from 'react'

import './index.scss'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxVisible} from "redux/actions/globalCtx";

export default () => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  return (
    <div id="rankPopupWrap">
      {globalState.popup[1] === 'level' ? (
        <>
          <div className="title">레벨 랭킹</div>
          <div className="content">
            <p>레벨(경험치) TOP 200의 순위입니다</p>
            <br/>

            <p>
              단, 최근 7일 간 미접속 대상자는
              <br/>
              리스트에서 일시 제외됩니다.
            </p>

            <br />
            <p>'최고팬'은 랭커의 팬랭킹 1위를 뜻합니다.</p>
          </div>
        </>
      ) : (
        <>
          <div className="title">좋아요 랭킹</div>
          <div className="content">
            <p className="topBox">
              보낸 좋아요 개수(부스터 포함)
              <br />
              <span>TOP 200의 순위입니다.</span>
            </p>
            {/* <p className="middleBox">
              단, 최근 7일 간 미접속 대상자는
              <br />
              리스트에서 일시 제외됩니다.
            </p> */}
            <p className="middleBox">
              <span className="colorRed">'심쿵유발자'</span>는 랭커로부터 <span>가장 많은 좋아요</span> <br/>
              (부스터 포함)를 받은 사람입니다.
            </p>
          </div>
        </>
      )}
      <button onClick={() => {
        dispatch(setGlobalCtxVisible(false));
      }}>확인
      </button>
    </div>
  )
}
