import React, {useContext} from 'react'

import {Context} from 'context'

import './index.scss'
export default () => {
  const context = useContext(Context)
  console.log(context.popup_code[1])
  return (
    <div id="rankPopupWrap">
      {context.popup_code[1] === 'level' ? (
        <>
          <div className="title">레벨 랭킹</div>
          <div className="content">
            <span>레벨(경험치) TOP 200의 순위입니다</span>
            <br />

            <span>단, 최근 7일 간 미접속 대상자는</span>

            <span>리스트에서 일시 제외됩니다.</span>

            <br />
            <span>'최고팬'은 랭커의 팬랭킹 1위를 뜻합니다.</span>
          </div>
        </>
      ) : (
        <>
          <div className="title">좋아요 랭킹</div>
          <div className="content">
            <span>받은 좋아요 개수(부스터 포함)</span>

            <span>TOP 200의 순위입니다.</span>

            <br />
            <span>단, 최근 7일 간 미접속 대상자는</span>

            <span>리스트에서 일시 제외됩니다.</span>

            <br />
            <span>'왕큐피트'는 랭커에게</span>

            <span>가장 많은 좋아요(부스터 포함)를</span>

            <span>보낸 사람입니다.</span>
          </div>
        </>
      )}
      <button onClick={() => context.action.updatePopupVisible(false)}>확인</button>
    </div>
  )
}
