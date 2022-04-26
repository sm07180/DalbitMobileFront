/**
 * @file /mypage/content/fan-board.js
 * @brief 마이페이지 팬보드2.5v
 */

import React, {useEffect, useState} from 'react'
// modules
import qs from 'query-string'
import {useHistory, useLocation, useParams} from 'react-router-dom'
// context
import Api from 'context/api'
import {Hybrid} from 'context/hybrid'
import BoardModify from './board_write'
import {useDispatch, useSelector} from "react-redux";
import {
  setGlobalCtxBoardIdx,
  setGlobalCtxBoardModifyInfo,
  setGlobalCtxFanBoardBigIdx,
  setGlobalCtxMessage,
  setGlobalCtxUserReport
} from "redux/actions/globalCtx";

export default (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  let params = useParams()
  const LocationClip = params.clipNo
  let location = useLocation()
  const history = useHistory()
  var urlrStr = location.pathname.split('/')[2]
  const {webview} = qs.parse(location.search)
  //state
  const [writeState, setWriteState] = useState(false)
  //modify msg
  const [modifyState, setModifyState] = useState(false)
  const [modifyMsg, setModifyMsg] = useState('')
  //dateformat
  const timeFormat = (strFormatFromServer) => {
    let date = strFormatFromServer.slice(0, 8)
    date = [date.slice(0, 4), date.slice(4, 6), date.slice(6)].join('.')
    let time = strFormatFromServer.slice(8)
    time = [time.slice(0, 2), time.slice(2, 4), time.slice(4)].join(':')
    return `${date} ${time}`
  }
  //토글 모어버튼
  const moreToggle = (boardIdx, contents) => {
    if (boardIdx === globalState.boardIdx) {
      dispatch(setGlobalCtxBoardIdx(0));
    } else {
      dispatch(setGlobalCtxBoardIdx(boardIdx));
    }
  }
  //수정하기 토글
  const editToggle = (contents, boardIdx) => {
    setModifyState(true)
    dispatch(setGlobalCtxBoardModifyInfo({
      clipNo: LocationClip,
      contents: contents,
      replyIdx: boardIdx
    }))
    if (writeState === false) {
      setModifyMsg(contents)
    }
  }
  //삭제하기 fetch
  const deleteBoard = (boardIdx, clipMemNo) => {
    setModifyState(true)
    if (props.type === 'clip_board') {
      async function fetchDataDelete() {
        const res = await Api.postClipReplyDelete({
          clipNo: LocationClip,
          replyIdx: boardIdx
        })
        if (res.result === 'success') {
          props.set(true)
          Hybrid('ClipUpdateInfo', res.data.clipPlayInfo)
        } else if (res.result === 'fail') {
          dispatch(setGlobalCtxMessage({type:"alert",
            callback: () => {},
            msg: res.message
          }))
        }
      }
      fetchDataDelete()
    } else {
      async function fetchDataDelete() {
        const res = await Api.mypage_fanboard_delete({
          data: {
            memNo: urlrStr,
            replyIdx: boardIdx
          }
        })
        if (res.result === 'success') {
          dispatch(setGlobalCtxFanBoardBigIdx(boardIdx));
          props.set(true)
        } else if (res.result === 'fail') {
          dispatch(setGlobalCtxMessage({type:"alert",
            callback: () => {},
            msg: res.message
          }))
        }
      }
      fetchDataDelete()
    }
  }
  //접기 버튼
  const modifyCancel = () => {
    dispatch(setGlobalCtxBoardIdx(0))
    setModifyState(false)
  }
  const setCancelModify = () => {
    modifyCancel()
  }

  const Link = () => {
    if (props.data.memId === '') {
      dispatch(setGlobalCtxMessage({type:"alert",
        callback: () => {},
        msg: '탈퇴한 회원입니다.'
      }))
    } else {
      if (props.type === 'clip_board') {
        history.push(`/profile/${props.data.writerMemNo}?webview=${webview}&tab=2`)
      } else {
        history.push(`/mypage/${props.data.writerMemNo}?webview=${webview}`)
      }
    }
  }
  const userReport = () => {
    const reportParam = {
      state: true,
      targetMemNo: props.data.writerMemNo,
      targetNickName: props.data.nickName
    };

    dispatch(setGlobalCtxBoardIdx(0))
    dispatch(setGlobalCtxUserReport(reportParam))
  }

  useEffect(() => {
    return () => {
      dispatch(setGlobalCtxBoardIdx(0))
    }
  }, [])
  useEffect(() => {
    if (globalState.boardModifyInfo && globalState.boardModifyInfo.replyIdx !== props.data.replyIdx) {
      setModifyState(false)
    }
  }, [globalState.boardModifyInfo])
  //render----------------------------------
  return (
    <>
      {modifyState === false && (
        <>
          <div className="list-item__header">
            <button className="btn__more" onClick={() => moreToggle(props.data.replyIdx, props.data.contents)}></button>
            <div className={globalState.boardIdx === props.data.replyIdx ? 'moreList on' : 'moreList'}>
              {props.data.writerMemNo === globalState.token.memNo && (
                <button onClick={() => editToggle(props.data.contents, props.data.replyIdx)}>수정하기</button>
              )}
              {(urlrStr === globalState.token.memNo ||
              props.data.writerMemNo === globalState.token.memNo ||
              props.data.clipMemNo === globalState.token.memNo) &&
              <button onClick={() => deleteBoard(props.data.replyIdx, props.data.clipMemNo)}>삭제하기</button>
              }
              {props.data.writerMemNo !== globalState.token.memNo && props.data.clipMemNo !== globalState.token.memNo &&
                <button onClick={userReport}>신고하기</button>
              }
            </div>
            <span className="thumb" style={{backgroundImage: `url(${props.data.profImg.thumb292x292})`}} onClick={Link}></span>
            <span className="info" onClick={Link}>
              <span className="info__name">
                <em className={`${props.data.viewOn === 0 && 'info__lock'}`}></em>
                {props.data.nickNm || props.data.nickName}
              </span>
              <span className="info__dt">{timeFormat(props.data.writeDt)}</span>
            </span>
          </div>
          <div className="list-item__content">
            {props.data.contents}
          </div>
        </>
      )}
      {/* 수정하기 */}
      {modifyState === true && globalState.boardModifyInfo && globalState.boardModifyInfo.replyIdx === props.data.replyIdx && (
        <BoardModify
          type="modify"
          setCancelModify={setCancelModify}
          modifyMsg={modifyMsg}
          replyIdx={props.data.replyIdx}
          editType={props.type === 'clip_board' ? 'clipEdit' : 'fanboardEdit'}
          set={props.set}
        />
      )}
    </>
  )
}
