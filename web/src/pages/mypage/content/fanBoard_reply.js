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
import DalbitCheckbox from 'components/ui/dalbit_checkbox'
//svg
import BJicon from '../component/bj.svg'
import WriteIcon from '../component/ic_write.svg'
import closeBtn from '../component/ic_back.svg'
import MoreBtnIcon from '../static/ic_new_more.svg'
import ReplyIcon from '../static/ic_reply_purple.svg'
import LockIcon from '../static/lock_g.svg'
import ArrowDownIcon from '../static/arrow_down_g.svg'
export default (props) => {
  //props.replyIdx 대댓글관련 모든 api통신에서 필요
  const history = useHistory()
  const replyIdx = props.replyShowIdx
  const TitleInfo = props.titleReplyInfo
  const isViewOn = props.isViewOn
  if (!props.titleReplyInfo) return null
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
  const [isScreet, setIsScreet] = useState(false)
  const [donstChange, setDonstChange] = useState(true)
  const [fetching, setFetching] = useState(true)
  // modift msg
  const [modifyMsg, setModifyMsg] = useState('')

  const [clickWrite, setClickWrite] = useState(false)
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
    if (TitleInfo.viewOn === 0) {
      setIsScreet(true)
      setDonstChange(true)
    } else {
      setIsScreet(false)
      setDonstChange(false)
    }
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
      setFetching(false)
    } else if (res.result === 'fail') {
    }
  }
  useEffect(() => {
    fetchDataReplyList()
    if (isViewOn === 0) {
      setIsScreet(true)
    }
  }, [])

  //대댓글 추가
  async function fetchDataUploadReply() {
    const res = await Api.mypage_fanboard_upload({
      data: {
        memNo: urlrStr,
        depth: 2,
        content: textChange,
        boardNo: replyIdx,
        viewOn: isScreet === true ? 0 : 1
      }
    })
    if (res.result === 'success') {
      setWriteState(false)
      setTextChange('')
      fetchDataReplyList()
      setThisBigIdx(0)
      context.action.updateFanBoardBigIdxMsg(textChange)
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
        context.action.updateFanBoardBigIdxMsg(-1)
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
      <a
        className="reply_write_btn"
        onClick={() => {
          setWriteState(true)
          if (TitleInfo.viewOn === 0) {
            setIsScreet(true)
            setDonstChange(true)
          } else {
            setIsScreet(false)
            setDonstChange(false)
          }
        }}>
        답글
      </a>
    )
  }

  const ReplyInfoTransfer = () => {
    context.action.updateFanboardReplyNum(-1)
    context.action.updateToggleAction(true)
  }
  //------------------------------------------------------------
  return (
    <Reply>
      {thisBigIdx !== 0 && <Dim onClick={() => setThisBigIdx(0)} />}
      {/* <header className="replyheader">
        <button onClick={() => WriteToggles()}></button>
        <span>팬보드 보기</span>
        {createWriteBtns()}
      </header> */}
      {/* 팬보드 대댓글 리스트 영역 */}
      {/* <div className="TitleReply">
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
       */}
      {fetching === false && (
        <div className="ReplyCnt">
          <button onClick={() => ReplyInfoTransfer()}>{list.length > 0 ? <>답글 {list.length}</> : <>답글쓰기</>}</button>
        </div>
      )}

      <div className="reply_list">
        {list &&
          list.map((item, index) => {
            const {nickNm, writeDt, profImg, contents, boardIdx, writerNo, viewOn} = item
            const Link = () => {
              let link = ''
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
                <div>ㄴ</div>
                <div className="reply_Wrap__main">
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
                      <div className="big_header_info">
                        <span onClick={Link}>
                          <div>
                            <span className={`${viewOn === 0 && 'big_header_info__lock'}`}></span>
                            <span className="big_header_info__name">{nickNm}</span>
                          </div>
                          <div className="big_header_info__dt">{timeFormat(writeDt)}</div>
                        </span>
                      </div>
                      {/* <div>
                      <span onClick={Link}>{nickNm}</span>
                      <span onClick={Link}>{timeFormat(writeDt)}</span>
                    </div> */}
                    </div>
                  </div>
                  <div className="reply_content">
                    <pre>{contents}</pre>
                  </div>
                </div>
              </div>
            )
          })}
        <div className="reply_writeWrap">
          <div className="reply_writeWrap__top">
            <div
              className="reply_writeWrap__header"
              onClick={() => {
                if (clickWrite === false) setClickWrite(true)
              }}>
              <img src={profile.profImg.thumb62x62} />
              {clickWrite !== true && (
                <span>
                  답글쓰기 <span className="gray">최대 100자</span>
                </span>
              )}
              {clickWrite === true && <span className="reply_writeWrap__header--nickNm">{profile.nickNm}</span>}
            </div>
            {clickWrite === true && (
              <div className="content_area">
                <Textarea placeholder="내용을 입력해주세요" onChange={handleChangeBig} value={textChange} />
              </div>
            )}
          </div>
          {clickWrite === true && (
            <div className="reply_writeWrap__btnWrap">
              {/* <span className="bigCount">
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
                  <em>{textChange.length}</em> / 100
                </span>
              </span> */}
              <button onClick={() => fetchDataUploadReply()}>등록</button>
            </div>
          )}
          <div
            className="reply_writeWrap__btn"
            onClick={() => {
              context.action.updateFanboardReplyNum(-1)
            }}>
            <button>답글접기</button>
            <img src={ArrowDownIcon} />
          </div>
        </div>
      </div>
      {/* 대댓글 작성영역 */}
      {writeState && (
        <Writer>
          <div className="header-wrap">
            <h2 className="header-title">답글 쓰기</h2>
            <button className="close-btn" onClick={WriteToggle}>
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
                <em>{textChange.length}</em> / 100
              </span>
            </span>
            <button onClick={() => fetchDataUploadReply()}>등록</button>
          </div>
        </Writer>
      )}
      {/* 대댓글 작성영역 */}
      {ModifyState && (
        <Writer>
          <div className="header-wrap">
            <h2 className="header-title">답글 수정</h2>
            <button className="close-btn" onClick={ModifyToggle}>
              <img src={closeBtn} alt="뒤로가기" />
            </button>
          </div>
          <div className="content_area">
            <Textarea value={modifyMsg} onChange={BigChangeContent} placeholder="내용을 입력해주세요" />
            <span className="bigCount">
              <em>{modifyMsg.length}&nbsp;</em> / 100
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

//최상위

const Reply = styled.div`
  /* position: absolute !important;
  top: 0;
  left: 0;
  background-color: #eeeeee;
  width: 100%;
  height: auto; */
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
    padding: 8px 0;
    span {
      height: 26px;
      line-height: 26px;
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
      background: url(${closeBtn}) no-repeat center center / cover;
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
    background-color: #fbfbfb;
    .reply_Wrap {
      display: flex;
      /* min-height: 132px; */
      /* margin-bottom: 12px; */
      padding: 4px 16px;
      background-color: #fbfbfb;
      border-bottom: 1px solid #eee;

      & > div:first-child {
        display: flex;
        height: 48px;
        align-items: center;
        padding-bottom: 10px;
      }

      &__main {
        width: 100%;
      }
      .reply_content {
        padding: 12px 41px 8px 16px;
        /* min-height: 69px; */
        font-size: 14px;
        text-align: left;
        color: #616161;
        word-break: break-all;
      }
      .reply_list_header {
        position: relative;
        height: 48px;
        .big_moreBtn {
          right: 0;
        }
        .big_moreDetail {
          top: 40px;
          right: 8px;
        }
        .replyInfo {
          display: flex;
          align-items: center;
          height: 48px;
          /* border: 1px solid #eeeeee; */
          .big_header_info {
            display: flex;
            flex-direction: column;
            margin-left: 10px;
            &__name {
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
            &__dt {
              margin-top: 4px;
              font-size: 12px;
              text-align: left;
              color: #9e9e9e;
            }

            &__lock {
              display: inline-block;
              width: 16px;
              height: 16px;
              background: url(${LockIcon}) no-repeat center;
            }
          }
        }
      }
    }

    .reply_writeWrap {
      padding: 12px 16px 16px 16px;
      background-color: #e0e0e0;
      &__top {
        display: flex;
        flex-direction: column;
        padding: 6px 16px;
        background-color: #fff;
        border-radius: 12px;

        .content_area {
          margin-top: 8px;
          & > textarea {
            width: 100%;
            height: 60px;
            font-size: 14px;
          }
        }
      }
      &__header {
        display: flex;
        align-items: center;
        & > img {
          width: 40px;
          height: 40px;
          margin-right: 8px;
          border-radius: 50%;
        }

        & span {
          font-size: 14px;
        }

        .gray {
          color: #bdbdbd;
        }

        &--nickNm {
          font-weight: bold;
        }
      }

      &__btn {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 44px;
        margin-top: 16px;
        background-color: #f5f5f5;
        border: 1px solid #e0e0e0;
        border-radius: 12px;

        & > img {
          transform: rotate(180deg);
        }
      }
      &__btnWrap {
        .bigCount {
          > em {
            color: #000;
            font-style: normal;
            font-weight: 800;
          }
          display: flex;

          margin-right: 7px;
          margin-top: 4px;
          margin-bottom: 12px;
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
        & > button {
          width: 100%;
          height: 44px;
          margin-top: 20px;
          border-radius: 12px;
          background-color: ${COLOR_MAIN};
          font-size: 18px;
          font-weight: 600;
          text-align: center;
          color: #ffffff;
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
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 36px;
    padding: 0 16px;
    background-color: #fff;
    > button {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      font-weight: 800;
      letter-spacing: normal;
      text-align: left;
      color: #000000;
      :before {
        display: block;
        content: '';
        width: 16px;
        height: 16px;
        margin-right: 6px;
        background: url(${ReplyIcon}) no-repeat center center / cover;
      }
    }
    > a {
      font-size: 12px;
      font-weight: 600;
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
