/**
 * @file /mypage/content/fan-board.js
 * @brief 마이페이지 팬보드2.5v
 */

import React, {useEffect, useState, useContext, useRef} from 'react'
// modules
import qs from 'query-string'
import styled from 'styled-components'
import {useLocation, useHistory} from 'react-router-dom'
// context
import {Context} from 'context'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P, PHOTO_SERVER} from 'context/color'
import Api from 'context/api'
// component
import Header from 'components/ui/new_header'
import ReplyList from './fanBoard_reply'
import BoardItem from './board_item'
import WriteBoard from './board_write'
import DalbitCheckbox from 'components/ui/dalbit_checkbox'
//svg
import BJicon from '../component/bj.svg'
import ReplyIcon from '../static/reply_g.svg'
import closeBtn from '../component/ic_back.svg'
import MoreBtnIcon from '../static/ic_new_more.svg'
import LockIcon from '../static/lock_g.svg'
//--------------------------------------------------------------------------
export default (props) => {
  // context && location
  const history = useHistory()
  let location = useLocation()
  const context = useContext(Context)
  var urlrStr = location.pathname.split('/')[2]
  const {webview} = qs.parse(location.search)
  //전체 댓글리스트(props)
  const TotalList = props.list
  const TotalCount = props.totalCount
  //state
  const [thisBigIdx, setThisBigIdx] = useState(0)
  const [writeState, setWriteState] = useState(false)
  const [replyWriteState, setReplyWriteState] = useState(false)
  const [checkIdx, setCheckIdx] = useState(0)
  const [titleReplyInfo, setTitleReplyInfo] = useState('')
  const [boardReplyList, setBoardReplyList] = useState([])
  const [isScreet, setIsScreet] = useState(false)
  const [donstChange, setDonstChange] = useState(false)
  //modift msg
  const [modifyMsg, setModifyMsg] = useState('')
  const [textChange, setTextChange] = useState('')

  //--------------------------function
  //dateformat
  const timeFormat = (strFormatFromServer) => {
    let date = strFormatFromServer.slice(0, 8)
    date = [date.slice(0, 4), date.slice(4, 6), date.slice(6)].join('.')
    let time = strFormatFromServer.slice(8)
    time = [time.slice(0, 2), time.slice(2, 4), time.slice(4)].join(':')
    return `${date} ${time}`
  }
  //토글 모어버튼
  const toggleMore = (boardIdx, contents) => {
    setThisBigIdx(boardIdx)
  }
  //수정하기 토글
  const BigModify = (contents, boardIdx) => {
    if (writeState === false) {
      setWriteState(true)
      setThisBigIdx(0)
      setCheckIdx(boardIdx)
      setModifyMsg(contents)
    } else {
      setWriteState(false)
    }
  }
  //정보 대댓글로 전달
  const ReplyInfoTransfer = (boardIdx, item) => {
    console.log(boardIdx, item, context.fanboardReplyNum)
    context.action.updateReplyIdx(boardIdx)
    setReplyWriteState(true)
    fetchDataReplyList(boardIdx)
    //setTitleReplyInfo(item)
    if (context.fanboardReplyNum === boardIdx) {
      context.action.updateFanboardReplyNum(-1)
    } else {
      context.action.updateFanboardReplyNum(boardIdx)
    }
    context.action.updateFanboardReply(item)
    context.action.updateToggleAction(true)
    // window.scrollTo({top: 0, left: 0, behavior: 'auto'})
  }
  //댓글 등록 온체인지
  const BigChangeContent = (e) => {
    const target = e.currentTarget
    if (target.value.length > 100) return
    setModifyMsg(target.value)
  }
  //대댓글 작성 및 초기화
  const ReplyWrite = (boardIdx, viewOn) => {
    if (viewOn === 0) {
      setIsScreet(true)
      setDonstChange(true)
    } else {
      setIsScreet(false)
      setDonstChange(false)
    }
    if (replyWriteState === false) {
      context.action.updateReplyIdx(boardIdx)
      setReplyWriteState(true)
    } else {
      setTextChange('')
      setReplyWriteState(false)
    }
  }
  //댓글 온체인지
  const handleChangeBig = (e) => {
    const target = e.currentTarget
    if (target.value.length > 100) return
    setTextChange(target.value)
  }
  //수정하기 fetch
  async function fetchDataModiy() {
    const res = await Api.mypage_board_edit({
      data: {
        memNo: urlrStr,
        boardIdx: checkIdx,
        content: modifyMsg
      }
    })
    if (res.result === 'success') {
      setWriteState(false)
      setModifyMsg('')
      context.action.updateFanBoardBigIdxMsg(modifyMsg)
    } else if (res.result === 'fail') {
      if (modifyMsg.length === 0) {
        context.action.alert({
          callback: () => {},
          msg: '수정 내용을 입력해주세요.'
        })
      }
      // context.action.alert({
      //   cancelCallback: () => {},
      //   msg: res.message
      // })
    }
  }
  //삭제하기 fetch
  const DeleteBigReply = (boardIdx) => {
    async function fetchDataDelete() {
      const res = await Api.mypage_fanboard_delete({
        data: {
          memNo: urlrStr,
          boardIdx: boardIdx
        }
      })
      if (res.result === 'success') {
        context.action.updateFanBoardBigIdxMsg(boardIdx)
        setThisBigIdx(0)
      } else if (res.result === 'fail') {
        context.action.alert({
          callback: () => {},
          msg: res.message
        })
      }
    }
    fetchDataDelete()
  }
  //대댓글 추가
  async function fetchDataUploadReply() {
    const res = await Api.mypage_fanboard_upload({
      data: {
        memNo: urlrStr,
        depth: 2,
        content: textChange,
        boardNo: context.replyIdx,
        viewOn: isScreet === true ? 0 : 1
      }
    })
    if (res.result === 'success') {
      context.action.updateReplyIdx(false)
      setTextChange('')

      context.action.updateFanBoardBigIdxMsg(textChange)
      setReplyWriteState(false)
    } else if (res.result === 'fail') {
      if (textChange.length === 0) {
        context.action.alert({
          callback: () => {},
          msg: '답글 내용을 입력해주세요.'
        })
      }
      // context.action.alert({
      //   callback: () => {},
      //   msg: res.message
      // })
    }
  }
  // 팬보드 댓글 조회
  async function fetchDataReplyList(boardIdx) {
    const res = await Api.member_fanboard_reply({
      params: {
        memNo: urlrStr,
        boardNo: boardIdx
      }
    })
    if (res.result === 'success') {
      setBoardReplyList(res.data.list)
      // setFetching(false)
    } else if (res.result === 'fail') {
    }
  }
  const setAction = (value) => {
    if (value === true) {
      fetchDataReplyList(context.fanboardReplyNum)
    }
  }
  //--------------------------------------------------------------------------
  return (
    <>
      {/* 딤영역 */}
      {/* {thisBigIdx !== 0 && <Dim onClick={() => setThisBigIdx(0)} />} */}
      <div className="listWrap">
        <>
          {TotalCount && (
            <div className="list-count">
              <span>게시글</span>
              <span>{TotalCount}</span>
            </div>
          )}
          {TotalList &&
            TotalList !== false &&
            TotalList.map((item, index) => {
              const {replyCnt, boardIdx, viewOn} = item
              return (
                <>
                  <div className={`list-item ${boardIdx === context.fanboardReplyNum && 'on'}`}>
                    {item && <BoardItem key={index} data={item} set={props.set} />}

                    <div className="list-item__bottom">
                      <button className="btn__reply" onClick={() => ReplyInfoTransfer(boardIdx, item)}>
                        {replyCnt > 0 ? (
                          <>
                            답글 <em>{replyCnt}</em>
                          </>
                        ) : (
                          <>답글쓰기</>
                        )}
                      </button>
                    </div>
                    {context.fanboardReplyNum &&
                      context.toggleState &&
                      boardIdx === context.fanboardReplyNum &&
                      boardReplyList &&
                      boardReplyList !== false &&
                      boardReplyList.map((item, index) => {
                        return (
                          <div className="reply-list">
                            <BoardItem
                              key={index}
                              data={item}
                              set={props.set}
                              isViewOn={context.fanboardReply.viewOn}
                              replyShowIdx={context.fanboardReplyNum}
                              titleReplyInfo={context.fanboardReply}
                            />
                          </div>
                        )
                      })}
                    {context.fanboardReplyNum &&
                      context.toggleState &&
                      boardIdx === context.fanboardReplyNum &&
                      replyWriteState && <WriteBoard {...props} set={setAction} type={'reply'} />}
                  </div>
                </>
              )
            })}
        </>
      </div>
    </>
  )
}

const Dim = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 55;
`
