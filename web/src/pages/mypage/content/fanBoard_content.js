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
import {WIDTH_PC, WIDTH_TABLET, IMG_SERVER} from 'context/config'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P, PHOTO_SERVER} from 'context/color'
import Api from 'context/api'
// component
import Header from 'components/ui/new_header'
import ReplyList from './fanBoard_reply'
import BoardItem from './board_item'
import DalbitCheckbox from 'components/ui/dalbit_checkbox'
//svg
import BJicon from '../component/bj.svg'
import ReplyIcon from '../static/reply_g.svg'
import closeBtn from '../component/ic_back.svg'
import MoreBtnIcon from '../static/ic_new_more.svg'
import LockIcon from '../static/lock_g.svg'
//--------------------------------------------------------------------------
export default (props) => {
  console.log(props)
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
  const [ReplyWriteState, setReplyWriteState] = useState(false)
  const [checkIdx, setCheckIdx] = useState(0)
  const [titleReplyInfo, setTitleReplyInfo] = useState('')
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
    if (ReplyWriteState === false) {
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

  //--------------------------------------------------------------------------
  return (
    <>
      {/* 딤영역 */}
      {thisBigIdx !== 0 && <Dim onClick={() => setThisBigIdx(0)} />}
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
              const {nickNm, writerNo, contents, writeDt, profImg, replyCnt, boardIdx, viewOn} = item
              const Link = () => {
                history.push(`/profile/${writerNo}?webview=${webview}`)
              }
              return (
                <>
                  <div className={`list-item ${boardIdx === context.fanboardReplyNum && 'on'}`}>
                    <BoardItem key={index} data={item} set={props.set} />
                    {context.fanboardReplyNum && context.toggleState && boardIdx === context.fanboardReplyNum && (
                      // <ReplyList
                      //   isViewOn={viewOn}
                      //   replyShowIdx={context.fanboardReplyNum}
                      //   titleReplyInfo={context.fanboardReply}
                      //   set={props.set}
                      // />
                      <BoardItem
                        key={index}
                        data={item}
                        set={props.set}
                        isViewOn={viewOn}
                        replyShowIdx={context.fanboardReplyNum}
                        titleReplyInfo={context.fanboardReply}
                        set={props.set}
                      />
                    )}
                  </div>
                </>

                // <React.Fragment key={index}>
                //   <div className={`list-item ${boardIdx === context.fanboardReplyNum && 'on'}`}>
                //     <div className="list-item__header">
                //       {(urlrStr === context.token.memNo || writerNo === context.token.memNo) && (
                //         <>
                //           <button className="btn__more" onClick={() => toggleMore(boardIdx, contents)}></button>
                //           {/* 상세기능영역 */}

                //           <div className={boardIdx === thisBigIdx ? 'moreList on' : 'moreList'}>
                //             {writerNo === context.token.memNo && (
                //               <span onClick={() => BigModify(contents, boardIdx)}>수정하기</span>
                //             )}
                //             <span onClick={() => DeleteBigReply(boardIdx)}>삭제하기</span>
                //           </div>
                //         </>
                //       )}
                //       <span className="thumb" style={{backgroundImage: `url(${profImg.thumb62x62})`}} onClick={Link}></span>
                //       <span className="info" onClick={Link}>
                //         <span className="info__name">
                //           <em className={`${viewOn === 0 && 'info__lock'}`}></em>
                //           {nickNm}
                //         </span>
                //         <span className="info__dt">{timeFormat(writeDt)}</span>
                //       </span>
                //     </div>
                //     <div className="list-item__content">
                //       <pre>{contents}</pre>
                //     </div>
                //     {boardIdx !== context.fanboardReplyNum && (
                //       <div className="list-item__bottom">
                //         <button className="btn__reply" onClick={() => ReplyInfoTransfer(boardIdx, item)}>
                //           {replyCnt > 0 ? (
                //             <>
                //               답글 <em>{replyCnt}</em>
                //             </>
                //           ) : (
                //             <>답글쓰기</>
                //           )}
                //         </button>
                //       </div>
                //     )}
                //     {context.fanboardReplyNum && context.toggleState && boardIdx === context.fanboardReplyNum && (
                //       <ReplyList
                //         isViewOn={viewOn}
                //         replyShowIdx={context.fanboardReplyNum}
                //         titleReplyInfo={context.fanboardReply}
                //         set={props.set}
                //       />
                //     )}
                //   </div>
                // </React.Fragment>
              )
            })}

          {/* 큰댓글 수정하기영역 */}
          {writeState && (
            <Writer>
              <div className="header-wrap">
                <h2 className="header-title">팬보드 수정</h2>
                <button className="close-btn" onClick={() => setWriteState(false)}>
                  <img src={closeBtn} alt="뒤로가기" />
                </button>
              </div>
              <div className="content_area">
                <Textarea value={modifyMsg} onChange={BigChangeContent} placeholder="내용을 입력해주세요" />
                <span className="bigCount">
                  <em>{modifyMsg.length}</em>&nbsp;/ 100
                </span>
                <button onClick={() => fetchDataModiy()}>수정</button>
              </div>
            </Writer>
          )}
          {/* 대댓글 작성영역 */}
          {ReplyWriteState && (
            <Writer>
              <div className="header-wrap">
                <h2 className="header-title">답글 쓰기</h2>
                <button className="close-btn" onClick={() => ReplyWrite(false)}>
                  <img src={closeBtn} alt="뒤로가기" />
                </button>
              </div>

              <div className="content_area">
                <Textarea placeholder="내용을 입력해주세요" onChange={handleChangeBig} value={textChange} />
                <span className="bigCount">
                  <span className="bigCount__screet">
                    <DalbitCheckbox
                      status={isScreet}
                      callback={() => {
                        if (!setDonstChange) {
                          setIsScreet(!isScreet)
                        }
                      }}
                    />
                    <span className="bold">비공개</span>
                  </span>
                  <span>
                    <em>{textChange.length}</em>&nbsp;/ 100
                  </span>
                </span>
                <button onClick={() => fetchDataUploadReply()}>등록</button>
              </div>
            </Writer>
          )}
        </>
        {/*대댓글 리스트영역*/}
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
//수정하기

const Writer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 22;
  width: 100%;
  height: 100vh;
  background-color: #eeeeee;
  header {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    width: 100%;
    background-color: #fff;
    font-size: 18px;
    font-weight: 800;
    letter-spacing: normal;
    text-align: center;
    color: #000000;
    > button {
      position: absolute;
      left: 6px;
      top: 0;
      width: 40px;
      height: 40px;
      background: url(${closeBtn}) no-repeat center center / cover;
    }
  }
  /* 팬보드 컨텐츠작성영역 */
  .content_area {
    display: flex;
    flex-direction: column;
    padding: 12px 16px;
    :after {
      content: '';
      clear: both;
      display: block;
    }
    > textarea {
      width: 100%;
      padding: 16px;
      box-sizing: border-box;
      min-height: 220px;
      border-radius: 12px;
      border: solid 1px #e0e0e0;
      :focus {
        border: solid 1px #000;
      }
      ::placeholder {
        font-size: 14px;
        letter-spacing: normal;
        text-align: left;
        color: #bdbdbd;
      }
    }
    .bigCount {
      > em {
        color: #000;
        font-style: normal;
        font-weight: 800;
      }
      display: flex;
      margin-right: 7px;
      margin-top: 4px;
      margin-bottom: 32px;
      font-size: 12px;
      line-height: 1.08;
      letter-spacing: normal;
      text-align: right;
      color: #616161;

      &__screet {
        display: flex;
        flex: 1;
        align-items: center;

        & > input {
          margin-right: 10px;
        }

        & > .bold {
          font-size: 14px;
          font-weight: bold;
        }
        span {
          font-size: 12px;
        }
      }

      & > span:last-child {
        display: flex;
        align-items: center;
      }
    }
    > button {
      height: 44px;
      border-radius: 12px;
      background-color: ${COLOR_MAIN};
      font-size: 18px;
      font-weight: 600;
      text-align: center;
      color: #ffffff;
    }
  }
`
const Textarea = styled.textarea``
