/**
 * @file popup/index.js
 * @brief 공통 팝업
 * @use context.action.updatePopup('CHARGE')
 */
import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
//context
import {RoomJoin} from '../../../context/room'
//components
import closeIco from './static/ic_close_w.svg'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxSticker} from "redux/actions/globalCtx";

//contents

//
export default (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  //state
  const [layout, setLayout] = useState('')
  //   레이어팝업컨텐츠

  //useEffect

  useEffect(() => {
    console.log('context.sticker ' + globalState.sticker)
  }, [globalState.sticker])

  //---------------------------------------------------------------------
  return (
    <Content>
      <p
        onClick={() => {
          const {push_type} = globalState.stickerMsg
          const {isLogin} = globalState.token
          let room_no, mem_no, board_idx

          switch (push_type + '') {
            case '1': //-----------------방송방 [room_no]
              room_no = globalState.stickerMsg.room_no
              RoomJoin({roomNo: room_no})
              break
            case '2': //------------------메인
              window.location.href = '/'
              break
            case '31': //-----------------마이페이지>팬 보드
              mem_no = globalState.stickerMsg.mem_no
              if (mem_no != undefined) {
                if (isLogin) window.location.href = `/profile/${mem_no}?tab=1`
              }
              break
            case '32': //-----------------마이페이지>내 지갑
              mem_no = globalState.stickerMsg.mem_no
              if (mem_no != undefined) {
                if (isLogin) window.location.href = `/wallet`
              }
              break
            case '33': //-----------------마이페이지>캐스트>캐스트 정보 변경 페이지(미정)
              break
            case '34': //-----------------마이페이지>알림>해당 알림 글
              mem_no = globalState.stickerMsg.mem_no
              if (mem_no != undefined) {
                if (isLogin) window.location.href = `/notice`
              }
              break
            case '35': //-----------------마이페이지
              mem_no = globalState.stickerMsg.mem_no
              if (mem_no !== undefined) {
                if (isLogin) window.location.href = `/mypage`
              }
              break
            case '36': //-----------------레벨 업 DJ 마이페이지 [mem_no]
              mem_no = globalState.stickerMsg.mem_no
              if (mem_no !== undefined) {
                if (isLogin) window.location.href = `/profile/${mem_no}`
              }
              break
            case '4': //------------------등록 된 캐스트(미정)
              window.location.href = `/`
              break
            case '5': //------------------스페셜 DJ 선정 페이지(미정)
              //window.location.href = `/event/specialDj`
              board_idx = globalState.stickerMsg.board_idx
              if (board_idx !== undefined) {
                window.location.href = `/customer/notice/${board_idx}`
              }
              break
            case '6': //------------------이벤트 페이지>해당 이벤트 [board_idx](미정)
              window.location.href = `/`
              break
            case '7': //------------------공지사항 페이지 [board_idx](미정)
              board_idx = globalState.stickerMsg.board_idx
              if (board_idx !== undefined) {
                window.location.href = `/customer/notice/${board_idx}`
              }
              break
            case '45': //-----------------Clip PLay
              room_no = globalState.stickerMsg.room_no
              if (room_no) clipPlay(room_no)
              break
            case '46': //-----------------Clip PLay
              room_no = globalState.stickerMsg.room_no
              if (room_no) clipPlay(room_no)
              break
            default:
              //------------------기본값
              //window.location.href = `/`
              break
          }
          dispatch(setGlobalCtxSticker(false));
        }}>
        {globalState.stickerMsg.title}
      </p>
      <a
        href="#"
        onClick={() => {
          dispatch(setGlobalCtxSticker(false));
        }}>
        <img src={closeIco} />
      </a>
    </Content>
  )
}

//---------------------------------------------------------------------

const Content = styled.div`
  animation-duration: 1s;
  animation-name: slidein;
  display: flex;
  top: 0px;
  left: 0px;
  position: fixed;
  z-index: 500;
  width: 100%;
  height: 48px;
  background-color: #ff6b89;
  /*margin-top: 49px;*/
  padding: 15px 16px;
  p {
    width: 100%;
    margin-right: 46px;
    font-size: 16px;
    line-height: 1.13;
    text-align: center;
    color: #ffffff;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  a {
    position: absolute;
    top: 12px;
    right: 16px;
  }
  @keyframes slidein {
    from {
      margin-top: -100%;
    }

    to {
      margin-top: 0%;
    }
  }
`
