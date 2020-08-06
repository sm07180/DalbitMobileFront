/**
 * @file /mypage/content/fan-board.js
 * @brief 마이페이지 팬보드2.5v
 */

import React, {useEffect, useState, useContext, useRef} from 'react'
//modules
import styled from 'styled-components'
import qs from 'query-string'
import {useLocation, useHistory} from 'react-router-dom'
// context
import {Context} from 'context'
import {WIDTH_PC, WIDTH_TABLET, IMG_SERVER} from 'context/config'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P, PHOTO_SERVER} from 'context/color'
import Api from 'context/api'
//components
import Header from '../component/header.js'
import Content from './fanBoard_content'
//svg
import BJicon from '../component/bj.svg'
import WriteIcon from '../component/ic_write.svg'
import BackIcon from '../component/ic_back.svg'
import MoreBtnIcon from '../static/ic_new_more.svg'
export default (props) => {
  //props.replyIdx 대댓글관련 모든 api통신에서 필요
  const history = useHistory()
  const replyIdx = props.replyShowIdx
  const TitleInfo = props.titleReplyInfo
  //location && context
  let location = useLocation()
  const ctx = useContext(Context)
  const context = useContext(Context)
  //profileGlobal info
  const {profile} = ctx
  const {webview} = qs.parse(location.search)
  //urlNumber
  var urlrStr = location.pathname.split('/')[2]
  //state
  const [list, setList] = useState([])
  const [thisBigIdx, setThisBigIdx] = useState(0)
  const [writeState, setWriteState] = useState(false)
  const [ModifyState, setModifyState] = useState(false)
  const [textChange, setTextChange] = useState('')
  const [checkIdx, setCheckIdx] = useState(0)
  // modift msg
  const [modifyMsg, setModifyMsg] = useState('')
  // function
  // 텍스트체인지
  const handleChangeBig = (e) => {
    const target = e.currentTarget
    if (target.value.length > 100) return
    setTextChange(target.value)
  }
  //dateformat
  const timeFormat = (strFormatFromServer) => {
    let date = strFormatFromServer.slice(0, 8)
    date = [date.slice(0, 4), date.slice(4, 6), date.slice(6)].join('.')
    let time = strFormatFromServer.slice(8)
    time = [time.slice(0, 2), time.slice(2, 4), time.slice(4)].join(':')
    return `${date} ${time}`
  }
  // 토글분기 및 전체 상황관리
  const WriteToggles = () => {
    if (context.toggleState === false) {
      context.action.updateToggleAction(true)
    } else {
      context.action.updateToggleAction(false)
    }
    if (context.fanBoardBigIdx !== replyIdx) {
      context.action.updateFanBoardBigIdxMsg(replyIdx)
    } else if (context.fanBoardBigIdx === replyIdx) {
      context.action.updateFanBoardBigIdxMsg(0)
    }
  }
  //작성하기 토글
  const WriteToggle = () => {
    if (writeState === false) {
      setWriteState(true)
    } else {
      setWriteState(false)
    }
  }
  //토글 모어버튼
  const toggleMore = (boardIdx, contents) => {
    setThisBigIdx(boardIdx)
    // context.action.updateFanBoardBigIdxMsg(contents)
  }
  //수정하기 토글
  const ReplyModify = (contents, boardIdx) => {
    if (ModifyState === false) {
      setModifyState(true)
      setThisBigIdx(0)
      setCheckIdx(boardIdx)
      setModifyMsg(contents)
    } else {
      setModifyState(false)
    }
  }
  //공지컨텐트 등록 온체인지
  const BigChangeContent = (e) => {
    const target = e.currentTarget
    if (target.value.length > 100) return
    setModifyMsg(target.value)
  }
  // 대댓글 조회
  async function fetchDataReplyList() {
    const res = await Api.member_fanboard_reply({
      params: {
        memNo: urlrStr,
        boardNo: replyIdx
      }
    })
    if (res.result === 'success') {
      setList(res.data.list)
    } else if (res.result === 'fail') {
    }
  }
  useEffect(() => {
    fetchDataReplyList()
  }, [])

  //대댓글 추가
  async function fetchDataUploadReply() {
    const res = await Api.mypage_fanboard_upload({
      data: {
        memNo: urlrStr,
        depth: 2,
        content: textChange,
        boardNo: replyIdx
      }
    })
    if (res.result === 'success') {
      setWriteState(false)
      setTextChange('')
      fetchDataReplyList()
      setThisBigIdx(0)
    } else if (res.result === 'fail') {
      if (textChange.length === 0) {
        context.action.alert({
          callback: () => {},
          msg: '수정 내용을 입력해주세요.'
        })
      }
      // context.action.alert({
      //   callback: () => {},
      //   msg: res.message
      // })
    }
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
      setModifyState(false)
      setModifyMsg('')
      fetchDataReplyList()
      setThisBigIdx(0)
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
  const ModifyToggle = () => {
    if (ModifyState === false) {
      setModifyState(true)
    } else {
      setModifyState(false)
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
        fetchDataReplyList()
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
  // render
  const createWriteBtns = () => {
    return (
      <a className="reply_write_btn" onClick={() => setWriteState(true)}>
        답글
      </a>
    )
  }
  //------------------------------------------------------------
  return (
    <Reply>
      {thisBigIdx !== 0 && <Dim onClick={() => setThisBigIdx(0)} />}
      <header className="replyheader">
        <button onClick={() => WriteToggles()}></button>
        <span>팬보드 보기</span>
        {createWriteBtns()}
      </header>
      {/* 팬보드 대댓글 리스트 영역 */}
      <div className="TitleReply">
        <header>
          <ProfImg bg={TitleInfo.profImg.thumb62x62}></ProfImg>
          <div className="titleInfo">
            <span>{TitleInfo.nickNm}</span>
            <span>{timeFormat(TitleInfo.writeDt)}</span>
          </div>
        </header>
        <div className="titleInfo_content">
          <pre>{TitleInfo.contents}</pre>
        </div>
      </div>
      <div className="ReplyCnt">
        <span>답글</span>
        <span>{list.length}</span>
      </div>
      <div className="reply_list">
        {list &&
          list.map((item, index) => {
            const {nickNm, writeDt, profImg, contents, boardIdx, writerNo} = item
            const Link = () => {
              if (webview) {
                link =
                  context.token.memNo !== writerNo
                    ? history.push(`/mypage/${writerNo}?webview=${webview}`)
                    : history.push(`/menu/profile`)
              } else {
                link = context.token.memNo !== writerNo ? history.push(`/mypage/${writerNo}`) : history.push(`/menu/profile`)
              }
            }
            return (
              <div key={index} className="reply_Wrap">
                <div className="reply_list_header">
                  {/* 상세기능영역 */}
                  {(urlrStr === context.token.memNo || writerNo === context.token.memNo) && (
                    <>
                      <button className="big_moreBtn" onClick={() => toggleMore(boardIdx, contents)}></button>
                      <div className={boardIdx === thisBigIdx ? 'big_moreDetail on' : 'big_moreDetail'}>
                        {writerNo === context.token.memNo && (
                          <span onClick={() => ReplyModify(contents, boardIdx)}>수정하기</span>
                        )}
                        <span onClick={() => DeleteBigReply(boardIdx)}>삭제하기</span>
                      </div>
                    </>
                  )}

                  <div className="replyInfo">
                    <ProfImg bg={profImg.thumb62x62} onClick={Link}></ProfImg>
                    <div>
                      <span onClick={Link}>{nickNm}</span>
                      <span onClick={Link}>{timeFormat(writeDt)}</span>
                    </div>
                  </div>
                </div>
                <div className="reply_content">
                  <pre>{contents}</pre>
                </div>
              </div>
            )
          })}
      </div>
      {/* 대댓글 작성영역 */}
      {writeState && (
        <Writer>
          <header>
            <button onClick={WriteToggle}></button>
            <span>답글 쓰기</span>
          </header>
          <div className="content_area">
            <Textarea placeholder="내용을 입력해주세요" onChange={handleChangeBig} value={textChange} />
            <span className="bigCount">
              <em>{textChange.length}</em> / 100
            </span>
            <button onClick={() => fetchDataUploadReply()}>등록</button>
          </div>
        </Writer>
      )}
      {/* 대댓글 작성영역 */}
      {ModifyState && (
        <Writer>
          <header>
            <button onClick={ModifyToggle}></button>
            <span>답글 수정</span>
          </header>
          <div className="content_area">
            <Textarea value={modifyMsg} onChange={BigChangeContent} placeholder="내용을 입력해주세요" />
            <span className="bigCount">
              <em>{modifyMsg.length}</em> / 100
            </span>
            <button onClick={() => fetchDataModiy()}>수정</button>
          </div>
        </Writer>
      )}
    </Reply>
  )
}
//STYLE

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
      background: url(${BackIcon}) no-repeat center center / cover;
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
      display: block;
      margin-left: auto;
      margin-right: 7px;
      margin-top: 4px;
      margin-bottom: 32px;
      font-size: 12px;
      line-height: 1.08;
      letter-spacing: normal;
      text-align: right;
      color: #616161;
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

//최상위

const Reply = styled.div`
  position: absolute !important;
  top: 0;
  left: 0;
  background-color: #eeeeee;
  width: 100%;
  height: auto;
  .big_moreBtn {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    width: 24px;
    height: 24px;
    background: url(${MoreBtnIcon}) no-repeat center center / cover;
  }
  .big_moreDetail {
    display: none;
    flex-direction: column;
    position: absolute;
    right: 24px;
    top: 44px;
    width: 80px;
    border: 1px solid #e0e0e0;
    background-color: #fff;
    padding: 4px 0;
    span {
      height: 26px;
      font-size: 14px;
      line-height: 2.14;
      letter-spacing: -0.35px;
      text-align: center;
      color: #757575;
      :hover {
        background-color: #f8f8f8;
      }
    }
    &.on {
      display: flex;
      z-index: 56;
    }
  }
  .replyheader {
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
      background: url(${BackIcon}) no-repeat center center / cover;
    }
    .reply_write_btn {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      right: 8px;
      color: #fff;
      font-weight: 600;
      font-size: 14px;
      width: 72px;
      height: 32px;
      border-radius: 16px;
      background-color: ${COLOR_MAIN};
      :before {
        display: block;
        background: url(${WriteIcon}) no-repeat center center / cover;
        content: '';
        width: 24px;
        height: 24px;
        margin-right: 2px;
      }
    }
  }
  .reply_list {
    /* height: 100%; */
    .reply_Wrap {
      min-height: 132px;
      /* margin-bottom: 4px; */
      background-color: #fff;
      border-bottom: 1px solid #eee;
      .reply_content {
        padding: 12px 41px 8px 16px;
        min-height: 69px;
        font-size: 12px;
        text-align: left;
        color: #616161;
        word-break: break-all;
      }
      .reply_list_header {
        position: relative;
        height: 48px;
        .replyInfo {
          display: flex;
          align-items: center;
          height: 48px;
          padding: 0px 16px;
          /* border: 1px solid #eeeeee; */
          > div {
            display: flex;
            flex-direction: column;
            span:first-child {
              margin-left: 8px;
              font-size: 14px;
              font-weight: 600;
              letter-spacing: normal;
              text-align: left;
              color: #000000;
            }
            span:last-child {
              margin-left: 8px;
              font-size: 12px;
              text-align: left;
              color: #9e9e9e;
            }
          }
        }
      }
    }
  }
  .TitleReply {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 150px;
    background-color: #fff;
    margin: 12px 0 16px 0;
    header {
      display: flex;
      align-items: center;
      flex-direction: row;
      height: 60px;
      padding: 0 16px;
      border-bottom: 1px solid #eeeeee;
      span:first-child {
        margin-left: 10px;
        display: block;
        height: 20px;
        line-height: 20px;
        max-width: 200px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow-x: hidden;
        font-size: 16px;
        font-weight: 800;
        text-align: left;
        color: #000000;
      }
      span:last-child {
        margin-left: 10px;
        margin-top: 4px;
        font-size: 12px;
        text-align: left;
        color: #9e9e9e;
      }
    }
  }
  .titleInfo {
    display: flex;
    flex-direction: column;
  }
  .titleInfo_content {
    min-height: 92px;
    padding: 16px 27px 16px 16px;
    font-size: 14px;
    letter-spacing: normal;
    text-align: left;
    color: #000000;
    word-break: break-all;
  }
  .ReplyCnt {
    padding: 0 17px;
    margin-bottom: 9px;
    span:first-child {
      font-size: 16px;
      font-weight: 800;
      letter-spacing: normal;
      text-align: left;
      color: #000000;
    }
    span:last-child {
      margin-left: 6px;
      font-size: 16px;
      font-weight: 800;
      letter-spacing: normal;
      text-align: left;
      color: #632beb;
    }
  }
`
const ProfImg = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: url(${(props) => props.bg}) no-repeat center center / cover;
`
const Dim = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 55;
`
