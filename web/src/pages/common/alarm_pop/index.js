import React from 'react'

import _ from 'lodash'

import './index.scss'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxVisible} from "redux/actions/globalCtx";

export default function AlarmPop() {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  return (
    <div id="AlarmPop">
      {_.hasIn(globalState.popup_code[1], 'callback') ? (
        <>
          {globalState.popup_code[1].key === 'isReceive' ? (
            <p>
              팬등록을 하지 않더라도
              <br/> [🔔]를 설정한 회원의
              <br/> 방송시작 알림을 받을 수 있습니다.
            </p>
          ) : (
            <></>
          )}

          <button
            onClick={() => {
              globalState.popup_code[1].callback()
              dispatch(setGlobalCtxVisible(false));
            }}>
            {globalState.popup_code[1].buttonText || '확인'}
          </button>
        </>
      ) : (
        <>
          {globalState.popup_code[1] === 'isMyStar' ? (
            <p>
              내가 팬으로 등록한
              <br/> 스타가 방송을 시작하면
              <br/> Push 메시지로 알려드립니다.
            </p>
          ) : globalState.popup_code[1] === 'isGift' ? (
            <p>
              내가 팬으로 등록한
              <br/> 스타가 방송공지를 올리면
              <br/> 메시지로 알려드립니다.
            </p>
          ) : globalState.popup_code[1] === 'isMailbox' ? (
            <p>
              내 우체통에
              <br/> 새로운 대화가 등록되면
              <br/> 메시지로 알려드립니다.
            </p>
          ) : globalState.popup_code[1] === 'isFan' ? (
            <p>
              누군가
              <br/> 나의 팬으로 등록하면
              <br/> 메시지로 알려드립니다.
            </p>
          ) : globalState.popup_code[1] === 'isComment' ? (
            <p>
              내 팬보드에
              <br/> 새로운 글이 등록되면
              <br/> 메시지로 알려드립니다.
            </p>
          ) : globalState.popup_code[1] === 'isReply' ? (
            <p>
              내가 남긴 팬보드 글에
              <br/> 누군가 댓글을 등록하면
              <br/> 메시지로 알려드립니다.
            </p>
          ) : globalState.popup_code[1] === 'isRadio' ? (
            <p>
              누군가 나에게
              <br/> 달 선물을 보내면
              <br/> 메시지로 알려드립니다.
            </p>
          ) : globalState.popup_code[1] === 'isLike' ? (
            <p>
              회원님께 필요한
              <br/> 공지사항 및 이벤트가 등록되면
              <br/> 메시지로 알려드립니다.
            </p>
          ) : globalState.popup_code[1] === 'isPush' ? (
            <p>
              회원님이 질문한
              <br/> 1:1 문의에 답변이 등록되면
              <br/> 메시지로 알려드립니다.
            </p>
          ) : globalState.popup_code[1] === 'isStarClip' ? (
            <p>
              내가 팬으로 등록한
              <br/> 스타가 클립을 올리면
              <br/> Push 메시지로 알려드립니다.
            </p>
          ) : globalState.popup_code[1] === 'isMyClip' ? (
            <p>
              내가 등록한 클립에
              <br/> 댓글, 좋아요, 선물이 등록되면
              <br/> 메시지로 알려드립니다.
            </p>
          ) : (
            <></>
          )}
          <button
            onClick={() => {
              dispatch(setGlobalCtxVisible(false));
            }}>
            확인
          </button>
        </>
      )}
    </div>
  )
}
