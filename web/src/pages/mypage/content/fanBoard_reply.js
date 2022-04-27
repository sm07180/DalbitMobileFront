/**
 * @file /mypage/content/fan-board.js
 * @brief 마이페이지 팬보드2.5v
 */

import React, {useEffect, useState} from 'react'
//modules
import styled from 'styled-components'
import qs from 'query-string'
import {useHistory, useLocation} from 'react-router-dom'
// context
import Api from 'context/api'
//components
import DalbitCheckbox from 'components/ui/dalbit_checkbox'
import WriteBoard from './board_write'
//svg
import closeBtn from '../component/ic_back.svg'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxFanBoardBigIdx, setGlobalCtxMessage} from "redux/actions/globalCtx";

export default (props) => {
  //props.replyIdx 대댓글관련 모든 api통신에서 필요
  const history = useHistory()
  const replyIdx = props.replyShowIdx
  const TitleInfo = props.titleReplyInfo
  const isViewOn = props.isViewOn
  if (!props.titleReplyInfo) return null
  //location && context
  let location = useLocation()
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  //profileGlobal info

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
      dispatch(setGlobalCtxFanBoardBigIdx(textChange))
    } else if (res.result === 'fail') {
      if (textChange.length === 0) {
        dispatch(setGlobalCtxMessage({type: "alert",
          callback: () => {},
          msg: '수정 내용을 입력해주세요.'
        }))
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
        dispatch(setGlobalCtxMessage({type: "alert",
          callback: () => {},
          msg: '수정 내용을 입력해주세요.'
        }))
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
        dispatch(setGlobalCtxFanBoardBigIdx(-1))
      } else if (res.result === 'fail') {
        dispatch(setGlobalCtxMessage({type: "alert",
          callback: () => {},
          msg: res.message
        }))
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
  //------------------------------------------------------------
  return (
    <div className="replyWrap">
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
      {/* {fetching === false && (
        <div className="ReplyCnt">
          <button onClick={() => ReplyInfoTransfer()}>{list.length > 0 ? <>답글 {list.length}</> : <>답글쓰기</>}</button>
        </div>
      )} */}

      <div className="reply_list">
        {list &&
          list.map((item, index) => {
            const {nickNm, writeDt, profImg, contents, boardIdx, writerNo, viewOn} = item
            const Link = () => {
              history.push(`/profile/${writerNo}?webview=${webview}`)
            }
            return (
              <div key={index} className="reply_Wrap">
                <div>ㄴ</div>
                <div className="reply_Wrap__main">
                  <div className="reply_list_header">
                    {/* 상세기능영역 */}
                    {(urlrStr === globalState.token.memNo || writerNo === globalState.token.memNo) && (
                      <>
                        <button className="big_moreBtn" onClick={() => toggleMore(boardIdx, contents)}></button>
                        <div className={boardIdx === thisBigIdx ? 'big_moreDetail on' : 'big_moreDetail'}>
                          {writerNo === globalState.token.memNo && (
                            <span onClick={() => ReplyModify(contents, boardIdx)}>수정하기</span>
                          )}
                          <span onClick={() => DeleteBigReply(boardIdx)}>삭제하기</span>
                        </div>
                      </>
                    )}

                    <div className="replyInfo">
                      <span
                        className="thumb"
                        style={{backgroundImage: `url(${profImg.thumb62x62})`}}
                        bg={profImg.thumb62x62}
                        onClick={Link}></span>
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
        <WriteBoard set={props.set} />
        {/* <div className="writeWrap">
          <div className="writeWrap__top">
            <div
              className="writeWrap__header"
              onClick={() => {
                if (clickWrite === false) setClickWrite(true)
              }}>
              <img src={profile.profImg.thumb62x62} />
              {clickWrite !== true && (
                <span>
                  답글쓰기 <span className="gray">최대 100자</span>
                </span>
              )}
              {clickWrite === true && <span className="writeWrap__header--nickNm">{profile.nickNm}</span>}
            </div>
            {clickWrite === true && (
              <div className="content_area">
                <textarea placeholder="내용을 입력해주세요" onChange={handleChangeBig} value={textChange} />
              </div>
            )}
          </div>
          {clickWrite === true && (
            <div className="writeWrap__btnWrap">
              <span className="bigCount">
                <span className="bigCount__secret">
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
                <span className="count">
                  <em>{textChange.length}</em> / 100
                </span>
              </span>
              <button className="btn__ok" onClick={() => fetchDataUploadReply()}>
                등록
              </button>
            </div>
          )}
          <div
            className="writeWrap__btn"
            onClick={() => {
              context.action.updateFanboardReplyNum(-1)
            }}>
            <button className="btn__toggle">접기</button>
          </div>
        </div> */}
        {/* <div className="reply_writeWrap">
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
                <textarea placeholder="내용을 입력해주세요" onChange={handleChangeBig} value={textChange} />
              </div>
            )}
          </div>
          {clickWrite === true && (
            <div className="reply_writeWrap__btnWrap">
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
          )}
          <div
            className="reply_writeWrap__btn"
            onClick={() => {
              context.action.updateFanboardReplyNum(-1)
            }}>
            <button>답글접기</button>
            <img src={ArrowDownIcon} />
          </div>
        </div> */}
      </div>
      {/* 대댓글 작성영역 */}
      {writeState && (
        <div class="writeWrap">
          <div className="header-wrap">
            <h2 className="header-title">답글 쓰기</h2>
            <button className="close-btn" onClick={WriteToggle}>
              <img src={closeBtn} alt="뒤로가기" />
            </button>
          </div>
          <div className="content_area">
            <textarea placeholder="내용을 입력해주세요" onChange={handleChangeBig} value={textChange} />
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
        </div>
      )}
      {/* 대댓글 작성영역 */}
      {ModifyState && (
        <div class="writeWrap">
          <div className="header-wrap">
            <h2 className="header-title">답글 수정</h2>
            <button className="close-btn" onClick={ModifyToggle}>
              <img src={closeBtn} alt="뒤로가기" />
            </button>
          </div>
          <div className="content_area">
            <textarea value={modifyMsg} onChange={BigChangeContent} placeholder="내용을 입력해주세요" />
            <span className="bigCount">
              <em>{modifyMsg.length}&nbsp;</em> / 100
            </span>
            <button onClick={() => fetchDataModiy()}>수정</button>
          </div>
        </div>
      )}
    </div>
  )
}

//STYLE
const Dim = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 55;
`
