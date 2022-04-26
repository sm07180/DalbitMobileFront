/**
 * @file /mypage/content/fan-board.js
 * @brief 마이페이지 팬보드2.5v
 */
import React, {useEffect, useState} from 'react'
// modules
import {useLocation} from 'react-router-dom'
// context
import Api from 'context/api'
// component
import BoardItem from './board_item'
import WriteBoard from './board_write'
import {useDispatch, useSelector} from "react-redux";
import {
  setGlobalCtxBoardIdx,
  setGlobalCtxBoardModifyInfo,
  setGlobalCtxFanBoardReply,
  setGlobalCtxFanBoardReplyNum,
  setGlobalCtxReplyIdx,
  setGlobalCtxToggleState
} from "redux/actions/globalCtx";
//--------------------------------------------------------------------------
export default (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  let location = useLocation()
  let urlrStr = location.pathname.split('/')[2]
  //전체 댓글리스트(props)
  const TotalList = props.list
  const TotalCount = props.totalCount
  const boardType = props.type
  //state
  const [replyWriteState, setReplyWriteState] = useState(false)
  const [boardReplyList, setBoardReplyList] = useState([])

  //정보 댓글로 전달
  const ReplyInfoTransfer = (boardIdx, item) => {
    dispatch(setGlobalCtxReplyIdx(boardIdx))
    setReplyWriteState(true)
    //drill reply fetch
    fetchDataReplyList(boardIdx)
    //분기 체크
    if (globalState.fanboardReplyNum === boardIdx) {

      dispatch(setGlobalCtxFanBoardReplyNum(-1))
    } else {
      dispatch(setGlobalCtxFanBoardReplyNum(boardIdx))
    }
    dispatch(setGlobalCtxFanBoardReply(item))
    dispatch(setGlobalCtxToggleState(true))
    //초기화
    dispatch(setGlobalCtxBoardIdx(0))
    dispatch(setGlobalCtxBoardModifyInfo(null))
    // window.scrollTo({top: 0, left: 0, behavior: 'auto'})
  }
  //대댓글 클릭시 포커스
  useEffect(() => {
    if (globalState.fanboardReplyNum && globalState.fanboardReplyNum !== -1) {
      if (document.getElementsByClassName('list-item on')[0]) {
        let listTop = document.getElementsByClassName('list-item on')[0].offsetTop
        if (props.boardType === 'userprofile') {
          let userProfileHeight = document.getElementsByClassName('profile-info')[0].clientHeight
          window.scrollTo(0, listTop + userProfileHeight - 8)
        } else {
          window.scrollTo(0, listTop - 8)
        }
      }
    }
  }, [globalState.fanboardReplyNum])
  // 팬보드 댓글 조회
  async function fetchDataReplyList(boardIdx) {
    const res = await Api.member_fanboard_reply({
      params: {
        memNo: urlrStr,
        replyIdx: boardIdx
      }
    })
    if (res.result === 'success') {
      setBoardReplyList(res.data.list)
    } else if (res.result === 'fail') {
    }
  }
  const setAction = (value, writeType) => {
    if (value === true) {
      props.set(true)
      if (writeType !== 'clip_board') {
        fetchDataReplyList(globalState.fanboardReplyNum)
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
              const {replyCnt, replyIdx} = item
              return (
                <React.Fragment key={index}>
                  <div className={`list-item ${replyIdx === globalState.fanboardReplyNum && 'on'}`}>
                    {item && <BoardItem key={`board-${index}`} data={item} set={props.set} type={boardType}/>}
                    {boardType !== 'clip_board' && (
                      <div className="list-item__bottom">
                        <button className="btn__reply" onClick={() => ReplyInfoTransfer(replyIdx, item)}>
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
                    {replyIdx === globalState.fanboardReplyNum &&
                    boardReplyList &&
                    boardReplyList !== false &&
                    boardReplyList.map((item1, index1) => {
                      return (
                        <div
                          className={
                            item1.replyIdx === (globalState.boardModifyInfo && globalState.boardModifyInfo.replyIdx)
                              ? `reply-list modify`
                              : `reply-list `
                          }
                            key={index1}>
                          <BoardItem
                            key={`reply-${index1}`}
                            data={item1}
                            set={setAction}
                            isViewOn={globalState.fanboardReply.viewOn}
                            replyShowIdx={globalState.fanboardReplyNum}
                            titleReplyInfo={globalState.fanboardReply}
                          />
                        </div>
                      )
                    })}
                    {replyIdx === globalState.fanboardReplyNum && replyWriteState && (
                      <WriteBoard
                        isViewOn={globalState.fanboardReply.viewOn}
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
