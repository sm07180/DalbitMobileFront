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
import Api from 'context/api'
// component
import BoardItem from './board_item'
import WriteBoard from './board_write'

//--------------------------------------------------------------------------
export default (props) => {
  // context && location
  let location = useLocation()
  const context = useContext(Context)
  var urlrStr = location.pathname.split('/')[2]
  //전체 댓글리스트(props)
  const TotalList = props.list
  const TotalCount = props.totalCount
  const boardType = props.type
  //state
  const [replyWriteState, setReplyWriteState] = useState(false)
  const [boardReplyList, setBoardReplyList] = useState([])

  //정보 댓글로 전달
  const ReplyInfoTransfer = (boardIdx, item) => {
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
  const setAction = (value, writeType) => {
    if (value === true) {
      props.set(true)
      if (writeType !== 'clip_board') {
        fetchDataReplyList(context.fanboardReplyNum)
      }
    }
  }
  //--------------------------------------------------------------------------
  return (
    <>
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
            TotalList.map((item, index, self) => {
              const {replyCnt, boardIdx} = item
              return (
                <React.Fragment key={index}>
                  <div className={`list-item ${boardIdx === context.fanboardReplyNum && 'on'}`}>
                    {item && <BoardItem key={`board-${index}`} data={item} set={props.set} type={boardType} />}
                    {boardType !== 'clip_board' && (
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
                    )}

                    {context.fanboardReplyNum &&
                      context.toggleState &&
                      boardIdx === context.fanboardReplyNum &&
                      boardReplyList &&
                      boardReplyList !== false &&
                      boardReplyList.map((item1, index1) => {
                        return (
                          <div className="reply-list" key={index1}>
                            <BoardItem
                              key={`reply-${index1}`}
                              data={item1}
                              set={setAction}
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
                      replyWriteState && (
                        <WriteBoard
                          isViewOn={context.fanboardReply.viewOn}
                          replyWriteState={replyWriteState}
                          set={setAction}
                          type={'reply'}
                          list={self}
                        />
                      )}
                  </div>
                </React.Fragment>
              )
            })}
        </>
      </div>
    </>
  )
}
