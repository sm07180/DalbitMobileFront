import React, {useState, useContext} from 'react'
import {Context} from 'context'
import Api from 'context/api'

import './search.scss'

export default (props) => {
  const context = useContext(Context)
  const {gganbuNumber, memberNumber, memberNick, ptrNick, acceptType, closeAlert, closePopup, searchStateCheck} = props

  console.log(context.globalGganbuState)
  // 깐부 신청
  const postGganbuSub = async () => {
    const param = {
      gganbuNo: gganbuNumber,
      ptrMemNo: memberNumber, // 대상자
      memNick: memberNick
    }
    const {data, message} = await Api.postGganbuSub(param)
    if (data === 1) {
      context.action.alert({
        msg: '신청 완료',
        callback: () => {
          closeAlert()
          searchStateCheck()
        }
      })
    } else {
      context.action.alert({
        msg: message,
        callback: () => {
          closeAlert()
          searchStateCheck()
        }
      })
    }
  }
  // 깐부 수락 버튼
  const postGganbuIns = async (memNo, memNick, ptrNick) => {
    const param = {
      gganbuNo: gganbuNumber,
      memNo: memNo,
      memNick: memNick
    }
    const {data, message} = await Api.postGganbuIns(param)
    if (data === 1) {
      context.action.alert({
        msg: `<div class="alertUserId"><span><strong>${ptrNick}</strong>님과</span><span>깐부를 맺었습니다.</span></div>`,
        callback: () => {
          closeAlert()
          closePopup()
          context.action.updateGlobalGganbuState(gganbuNumber)
        }
      })
    } else {
      console.log(message)
    }
  }

  return (
    <div className="alertLayer">
      <div className="contentWrap">
        <h1 className="title">동의서</h1>
        {acceptType === 'application' ? (
          <>
            <div className="textWrap">
              <h2>제 1 항</h2>
              <p>
                깐부는 최대 두 명에게 신청
                <br />
                가능하며 신청 후에 취소할 수 있습니다.
              </p>
              <h2>제 2 항</h2>
              <p>
                상대가 수락 시 이번 회차에서 맺은 깐부는
                <br />
                중도 해체할 수 없습니다.
              </p>
              <h2>제 3 항</h2>
              <p>
                평균 레벨이 낮을수록 구슬 주머니에서
                <br />
                좋은 점수를 얻을 수 있습니다.
              </p>
              <p>
                <strong>정말 신청하시겠습니까?</strong>
              </p>
            </div>
            <div className="buttonWrap">
              <button onClick={closeAlert}>취소</button>
              <button onClick={() => postGganbuSub()}>신청</button>
            </div>
          </>
        ) : (
          <>
            <div className="textWrap">
              <h2>제 1 항</h2>
              <p>
                이번 회차에서 맺은 깐부는
                <br />
                중도 해체할 수 없습니다.
              </p>
              <h2>제 2 항</h2>
              <p>
                평균 레벨이 낮을수록 구슬 주머니에서
                <br />
                좋은 점수를 얻을 수 있습니다.
              </p>
              <p>
                <strong>정말 깐부를 맺으시겠습니까?</strong>
              </p>
            </div>
            <div className="buttonWrap">
              <button onClick={closeAlert}>취소</button>
              <button onClick={() => postGganbuIns(memberNumber, memberNick, ptrNick)}>수락</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
