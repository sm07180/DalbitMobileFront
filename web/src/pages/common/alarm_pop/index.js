import React, {useContext} from 'react'

import {Context} from 'context'

import './index.scss'

export default function AlarmPop() {
  const context = useContext(Context)
  console.log(context.popup_code[1])

  return (
    <div id="AlarmPop">
      {context.popup_code[1] === 'isMyStar' ? (
        <p>
          내가 팬으로 등록한
          <br /> 스타가 방송을 시작하면
          <br /> Push 메시지로 알려드립니다.
        </p>
      ) : context.popup_code[1] === 'isGift' ? (
        <p>
          내가 팬으로 등록한
          <br /> 스타가 방송공지를 올리면
          <br /> 메시지로 알려드립니다.
        </p>
      ) : context.popup_code[1] === 'isFan' ? (
        <p>
          누군가
          <br /> 나의 팬으로 등록하면
          <br /> 메시지로 알려드립니다.
        </p>
      ) : context.popup_code[1] === 'isComment' ? (
        <p>
          내 팬보드에
          <br /> 새로운 글이 등록되면
          <br /> 메시지로 알려드립니다.
        </p>
      ) : context.popup_code[1] === 'isReply' ? (
        <p>
          내가 남긴 팬보드 글에
          <br /> 누군가 댓글을 등록하면
          <br /> 메시지로 알려드립니다.
        </p>
      ) : context.popup_code[1] === 'isRadio' ? (
        <p>
          누군가 나에게
          <br /> 달 선물을 보내면
          <br /> 메시지로 알려드립니다.
        </p>
      ) : context.popup_code[1] === 'isLike' ? (
        <p>
          회원님께 필요한
          <br /> 공지사항 및 이벤트가 등록되면
          <br /> 메시지로 알려드립니다.
        </p>
      ) : context.popup_code[1] === 'isPush' ? (
        <p>
          회원님이 질문한
          <br /> 1:1 문의에 답변이 등록되면
          <br /> 메시지로 알려드립니다.
        </p>
      ) : context.popup_code[1] === 'isStarClip' ? (
        <p>
          내가 팬으로 등록한
          <br /> 스타가 클립을 올리면
          <br /> Push 메시지로 알려드립니다.
        </p>
      ) : context.popup_code[1] === 'isMyClip' ? (
        <p>
          내가 등록한 클립에
          <br /> 댓글, 좋아요, 선물이 등록되면
          <br /> 메시지로 알려드립니다.
        </p>
      ) : (
        <></>
      )}

      <button
        onClick={() => {
          context.action.updatePopupVisible(false)
        }}>
        확인
      </button>
    </div>
  )
}
