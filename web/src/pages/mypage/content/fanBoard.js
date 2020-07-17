/**
 * @file /mypage/content/fan-board.js
 * @brief 마이페이지 팬보드
 */

import React, {useEffect, useState, useContext, useRef} from 'react'
import styled from 'styled-components'
import qs from 'query-string'
// context
import {Context} from 'context'
import Header from '../component/header.js'
import {WIDTH_PC, WIDTH_TABLET, IMG_SERVER} from 'context/config'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P, PHOTO_SERVER} from 'context/color'
import BJicon from '../component/bj.svg'
//api
import Api from 'context/api'
//layout
export default (props) => {
  const {webview} = qs.parse(location.search)
  //ref
  const inputEl = useRef(null)
  //context
  const ctx = useContext(Context)
  const context = useContext(Context)
  //profileGlobal info
  const {profile} = ctx

  var urlrStr = props.location.pathname.split('/')[2]
  //state
  const [comment, setComment] = useState('')
  const MaxCommentLength = 100
  //apiinfo
  const [fanTotal, setFanTotal] = useState([])
  const [replyInfo, setReplyInfo] = useState([])
  //toggles
  const [active, setActive] = useState(false)
  const [showBtn, setShowBtn] = useState('')
  const [showBtnReply, setShowBtnReply] = useState('')
  //count
  const [count, setCount] = useState(0)
  const [broadNumbers, setBroadNumbers] = useState('')
  const [replyRegist, setReplyRegist] = useState('')
  //api:댓글 리스트
  async function fetchDataList() {
    const res = await Api.mypage_fanboard_list({
      params: {
        memNo: urlrStr,
        page: 1,
        records: 100
      }
    })
    if (res.result === 'success') {
      setFanTotal(
        res.data.list.filter(function (item) {
          return item.status === 1
        })
      )
    } else if (res.result === 'fail') {
      context.action.alert({
        callback: () => {},
        msg: res.message
      })
    }
  }
  //대댓글 조회
  async function fetchDataReplyList(writeNumer, boardNumer) {
    const res = await Api.member_fanboard_reply({
      params: {
        memNo: urlrStr,
        boardNo: boardNumer
      }
    })
    if (res.result === 'success') {
      setReplyInfo(res.data.list)
    } else if (res.result === 'fail') {
    }
  }

  //팬보다 댓글추가
  async function fetchDataUpload() {
    const res = await Api.mypage_fanboard_upload({
      data: {
        memNo: urlrStr,
        depth: 1,
        content: comment
      }
    })
    if (res.result === 'success') {
      fetchDataList()
    } else if (res.result === 'fail') {
      context.action.alert({
        cancelCallback: () => {},
        msg: res.message
      })
    }
  }
  //대댓글 추가
  async function fetchDataUploadReply() {
    const res = await Api.mypage_fanboard_upload({
      data: {
        memNo: urlrStr,
        depth: 2,
        content: replyRegist,
        boardNo: broadNumbers
      }
    })
    if (res.result === 'success') {
    } else if (res.result === 'fail') {
      context.action.alert({
        callback: () => {},
        msg: res.message
      })
    }
  }

  //댓글 등록 온체인지
  const textChange = (e) => {
    const target = e.currentTarget
    const lineBreakLenght = target.value.split('\n').length

    if (target.value.length > MaxCommentLength) return
    setComment(target.value)

    if (lineBreakLenght >= 2) {
      target.style.height = `84px`
    } else {
      target.style.height = `84px`
    }
  }
  //댓글 삭제
  const deletApiFun = (value) => {
    async function fetchDataDelete() {
      const res = await Api.mypage_fanboard_delete({
        data: {
          memNo: urlrStr,
          boardIdx: value
        }
      })
      if (res.result === 'success') {
        fetchDataList()
      } else if (res.result === 'fail') {
        context.action.alert({
          callback: () => {},
          msg: res.message
        })
      }
    }
    fetchDataDelete()
  }
  //팬보다 댓글수정
  async function fetchDataEdit(boardNumer) {
    const res = await Api.mypage_board_edit({
      data: {
        memNo: urlrStr,
        boardIdx: boardNumer,
        content: modifyComment
      }
    })
    if (res.result === 'success') {
      fetchDataList()
      setModifyComment('')
      setModifyShow('')
    } else if (res.result === 'fail') {
      context.action.alert({
        callback: () => {},
        msg: res.message
      })
    }
  }
  //팬보다 대댓글수정
  async function fetchDataEditReply(boardNumer, writeNumer) {
    const res = await Api.mypage_board_edit({
      data: {
        memNo: urlrStr,
        boardIdx: modifyInShow,
        content: modifyInComment
      }
    })
    if (res.result === 'success') {
      showReply(boardNumer, writeNumer)
      setHidden(false)
      setModifyInComment('')
      setModifyInShow('')
    } else if (res.result === 'fail') {
      context.action.alert({
        callback: () => {},
        msg: res.message
      })
    }
  }
  //placeholder
  const placeholderText = '팬 보드에 글을 남겨주세요. '
  const placeholderTextStart = '팬 보드에 글을 남겨주세요. '
  //modiy-state
  const [modifyShow, setModifyShow] = useState('')
  const [modifyInShow, setModifyInShow] = useState('')
  const [modifyComment, setModifyComment] = useState('')
  const [modifyInComment, setModifyInComment] = useState('')
  const [modifyNumber, setModifyNumber] = useState('')
  const [hidden, setHidden] = useState(false)
  const [modifyInfo, setModifyInfo] = useState({})
  const [btnState, setBtnState] = useState(false)
  const [replynum, setReplyNum] = useState(0)

  //등록
  const submitClick = () => {
    fetchDataUpload()
    setComment('')
    setActive(false)
  }
  //대댓글보기
  const ShowReplyBtnState = (writeNumer, boardNumer, replyCnt) => {
    setReplyNum(replyCnt)
    setActive(false)
    sethideSecondcomment(false)
    sethidebigSecondcomment(false)
    if (btnState === true) {
      setBtnState(false)
    } else {
      setBtnState(true)
    }
    context.action.updateBoardNumber(boardNumer)
    showReply(writeNumer, boardNumer)
  }

  const showReply = (writeNumer, boardNumer) => {
    fetchDataReplyList(writeNumer, boardNumer)
    setBroadNumbers(boardNumer)
    moidfyCancel()
  }
  //대댓글등록
  const uploadReply = (writeNumer, boardNumer) => {
    fetchDataUploadReply()
    fetchDataList()
    setTimeout(() => {
      showReply(writeNumer, boardNumer)
    }, 50)
    setTimeout(() => {
      sethideSecondcomment(false)
      sethidebigSecondcomment(false)
    }, 100)
    setReplyRegist('')
  }
  //대댓글 value
  const textChangeReply = (e) => {
    const target = e.currentTarget
    if (target.value.length > MaxCommentLength) return
    setReplyRegist(target.value)
  }
  //click bg zindex
  const clickRefresh = () => {
    setShowBtn('')
    setShowBtnReply('')
  }
  //버튼 토클
  const DeleteComment = (value, writeNumer, boardNumer) => {
    clickRefresh()
    deletApiFun(value)
    setTimeout(() => {
      showReply(writeNumer, boardNumer)
    }, 100)
  }
  //댓글수정
  const FanboardModify = (contents, boardIdx, boardNumer) => {
    setModifyComment(contents)
    setModifyShow(boardIdx)
    clickRefresh()
    setBtnState(false)
  }
  //댓글 수정 온체인지
  const textModify = (e) => {
    const target = e.currentTarget
    const lineBreakLenght = target.value.split('\n').length

    if (target.value.length > MaxCommentLength) return
    setModifyComment(target.value)

    if (lineBreakLenght >= 2) {
      target.style.height = `106px`
    } else {
      target.style.height = `106px`
    }
  }
  //대댓글 수정 온체인지
  const textChangeReplyModify = (e) => {
    const target = e.currentTarget

    if (target.value.length > MaxCommentLength) return
    setModifyInComment(target.value)
  }
  //대댓글수정
  const replyModify = (contents, boardNumer, boardIdx, profileImg, nickNm, memId, parseDT, writerNo) => {
    setModifyInComment(contents)
    setModifyInShow(boardIdx)
    setModifyNumber(boardIdx)
    setHidden(true)
    clickRefresh()
    setModifyInfo({profileImg, nickNm, memId, parseDT, boardIdx, memId, writerNo})
    sethideSecondcomment(true)
    sethidebigSecondcomment(false)
  }
  //수정취소
  const moidfyCancel = () => {
    setHidden(false)
    setModifyInComment('')
    setModifyInShow('')
    setModifyComment('')
    setModifyShow('')
    sethideSecondcomment(false)
    sethidebigSecondcomment(false)
  }

  //dateformat
  const timeFormat = (strFormatFromServer) => {
    let date = strFormatFromServer.slice(0, 8)
    date = [date.slice(0, 4), date.slice(4, 6), date.slice(6)].join('.')
    let time = strFormatFromServer.slice(8)
    time = [time.slice(0, 2), time.slice(2, 4), time.slice(4)].join(':')
    return `${date} ${time}`
  }
  //--------------------------------------------------------------------------
  //전체 카운터
  useEffect(() => {
    setCount(
      fanTotal.filter(function (item) {
        return item.status === 1
      }).length
    )
  }, [fanTotal])
  useEffect(() => {
    fetchDataList()
  }, [modifyInShow])

  //--------------------------------------------------------------------------
  useEffect(() => {
    if (hidden === true) {
      setTimeout(() => {
        inputEl.current.focus()
      }, 100)
    }
  }, [hidden])
  //------------------------------------------------------------------------
  useEffect(() => {
    if (context.boardNumber === broadNumbers) {
      setBtnState(true)
    } else if (context.boardNumber !== broadNumbers) {
      setBtnState(false)
    }
  }, [context.boardNumber])
  //------------------------------------------------------------------------
  const [hideSecondcomment, sethideSecondcomment] = useState(false)
  const [hidebigSecondcomment, sethidebigSecondcomment] = useState(false)
  const ToggleDae = () => {
    if (hideSecondcomment === false) {
      sethideSecondcomment(true)
      sethidebigSecondcomment(true)
    }
  }
  //초기하 상세버튼
  const refreshFanBtn = (boardIdx) => {
    setShowBtnReply('')
    setShowBtn(boardIdx)
  }
  const refreshReplyBtn = (boardIdx) => {
    setShowBtnReply(boardIdx)
    setShowBtn('')
  }
  ///
  useEffect(() => {
    const settingProfileInfo = async (memNo) => {
      const profileInfo = await Api.profile({params: {memNo: context.token.memNo}})
      if (profileInfo.result === 'success') {
        context.action.updateProfile(profileInfo.data)
      }
    }
    settingProfileInfo()
  }, [])
  return (
    <>
      <Header>
        <div className="category-text">팬 보드</div>
      </Header>
      {/* 전체영역 */}
      <FanBoard>
        {/* 초기등록창 */}
        <InitialSubmit className={active === true ? 'on' : ''} onClick={() => setActive(true)}>
          <div className="start">{placeholderTextStart}</div>
          <button>등록</button>
        </InitialSubmit>
        <InitialBigSubmit className={active === true ? 'on' : ''}>
          <WriteAreaTop>
            <OwnPhoto style={{backgroundImage: `url(${profile.profImg['thumb62x62']})`}} />

            <div style={{fontSize: '16px', letterSpacing: '-0.4px', marginLeft: '10px'}} className="nick">
              {profile.nickNm}
            </div>
          </WriteAreaTop>
          <Textarea placeholder={placeholderText} onChange={textChange} value={comment} />
          <WriteAreaBottom>
            <TextCount>
              <span style={{color: '#424242'}}>{`${comment.length * 2}`}</span>
              <span style={{color: '#9e9e9e'}}>{` / ${MaxCommentLength * 2}`}</span>
            </TextCount>
            <CommentSubmitBtn onClick={submitClick}>등록</CommentSubmitBtn>
          </WriteAreaBottom>
        </InitialBigSubmit>
        {/* 리스트영역 */}
        <ListArea>
          <ListTitle>
            <span>게시글</span>
            <span style={{marginLeft: '4px', fontWeight: 'bold'}} className="titlecount">
              {count}
            </span>
          </ListTitle>
          {fanTotal.map((item, index) => {
            const {profImg, nickNm, writeDt, writerNo, contents, replyCnt, boardIdx, status, boardNo, memId} = item
            let value = boardIdx
            let writeNumer = writerNo
            let boardNumer = boardNo
            let link = ''
            if (webview) {
              link = profile.memNo !== writerNo ? `/mypage/${writerNo}?webview=${webview}` : `/menu/profile`
            } else {
              link = profile.memNo !== writerNo ? `/mypage/${writerNo}` : `/menu/profile`
            }
            if (status !== 1) return

            return (
              <CommentBox key={index} className={status === 1 ? 'show' : ''}>
                <div className={modifyShow === boardIdx ? 'disableCommentWrap' : 'CommentWrap'}>
                  <div className="titlewrap">
                    <a href={link}>
                      <Imgbox bg={profImg.thumb62x62} />
                    </a>
                    <div>
                      {writerNo === urlrStr && <em className="bjIcon"></em>}
                      <a href={link}>
                        <span>{nickNm}</span>
                        <span>(@{memId})</span>
                      </a>
                      <span>{timeFormat(writeDt)}</span>
                    </div>
                    <BtnIcon
                      onClick={() => refreshFanBtn(boardIdx)}
                      className={writerNo === context.token.memNo || urlrStr === context.token.memNo ? 'on' : ''}></BtnIcon>
                    <DetailBtn className={showBtn === boardIdx ? 'activeFan' : ''}>
                      <a
                        className={writerNo === context.token.memNo ? 'on' : ''}
                        onClick={() => FanboardModify(contents, boardIdx, boardNumer)}>
                        수정하기
                      </a>
                      <a
                        className={writerNo === context.token.memNo || urlrStr === context.token.memNo ? 'on' : ''}
                        onClick={() => DeleteComment(value)}>
                        삭제하기
                      </a>
                    </DetailBtn>
                  </div>
                  <div className="content">
                    <pre>{contents}</pre>
                  </div>
                  <button className="reply" onClick={() => ShowReplyBtnState(writeNumer, boardNumer, replyCnt)}>
                    답글 {replyCnt !== 0 && <span>{replyCnt}</span>}
                  </button>
                </div>
                {/* 댓글수정 */}
                <WriteArea className={modifyShow === boardIdx ? 'onModify' : ''}>
                  <div className="titlewrap">
                    <a href={link}>
                      <Imgbox bg={profImg.thumb62x62} />
                    </a>

                    <div>
                      <a href={link}>
                        <span>{nickNm}</span>
                        <span>(@{memId})</span>
                      </a>
                      <span>{timeFormat(writeDt)}</span>
                    </div>
                  </div>
                  <div className="modiInput">
                    <Textarea placeholder={placeholderText} onChange={textModify} value={modifyComment} />
                    <WriteAreaBottomModify>
                      <TextCountModify>
                        <span style={{color: '#424242'}}>{`${modifyComment.length * 2}`}</span>
                        <span style={{color: '#9e9e9e'}}>{` / ${MaxCommentLength * 2}`}</span>
                      </TextCountModify>
                      <CommentSubmitBtnCancelModify onClick={() => moidfyCancel()}>취소</CommentSubmitBtnCancelModify>
                      <CommentSubmitBtnModify onClick={() => fetchDataEdit(boardNumer)}>수정</CommentSubmitBtnModify>
                    </WriteAreaBottomModify>
                  </div>
                </WriteArea>
                {boardNumer === broadNumbers && btnState === true && (
                  <div className="replyWrap">
                    {replyInfo.map((reply, index) => {
                      const {profImg, nickNm, writeDt, writerNo, contents, replyCnt, boardIdx, status, boardNo, memId} = reply
                      let value = boardIdx
                      const profileImg = profImg.thumb62x62
                      const parseDT = timeFormat(writeDt)
                      let link = ''
                      if (webview) {
                        link = profile.memNo !== writerNo ? `/mypage/${writerNo}?webview=${webview}` : `/menu/profile`
                      } else {
                        link = profile.memNo !== writerNo ? `/mypage/${writerNo}` : `/menu/profile`
                      }
                      if (status !== 1) return

                      return (
                        <ReplyWrap key={index} className={modifyInShow === boardIdx ? 'disable' : ''}>
                          <div className="titlewrap">
                            <a href={link}>
                              <Imgbox bg={profImg.thumb62x62} />
                            </a>

                            <div>
                              <a href={link}>
                                <span>{nickNm}</span>
                                <span>(@{memId})</span>
                              </a>
                              <span>{timeFormat(writeDt)}</span>
                            </div>
                          </div>

                          <BtnIcon
                            onClick={() => refreshReplyBtn(boardIdx)}
                            className={
                              writerNo === context.token.memNo || urlrStr === context.token.memNo ? 'onStart' : ''
                            }></BtnIcon>
                          <DetailBtn className={showBtnReply === boardIdx ? 'active' : ''}>
                            <a
                              className={writerNo === profile.memNo ? 'on' : ''}
                              onClick={() =>
                                replyModify(contents, boardNumer, boardIdx, profileImg, nickNm, memId, parseDT, writerNo, status)
                              }>
                              수정하기
                            </a>
                            <a
                              className={writerNo === context.token.memNo || urlrStr === context.token.memNo ? 'on' : ''}
                              onClick={() => DeleteComment(value, writeNumer, boardNumer)}>
                              삭제하기
                            </a>
                          </DetailBtn>

                          <div className="content daeContent">{contents}</div>
                        </ReplyWrap>
                      )
                    })}
                    <ReplySubmit
                      onClick={() => ToggleDae()}
                      className={hideSecondcomment === true && 'hide'}
                      style={{padding: replynum === 0 ? '12px 0px' : '6px 0 12px 0'}}>
                      <div className="start">{placeholderTextStart}</div>
                      <button>등록</button>
                    </ReplySubmit>
                    <SecoundBigSubmit className={hidebigSecondcomment === true && 'on'}>
                      <WriteAreaTop>
                        <OwnPhoto style={{backgroundImage: `url(${profile.profImg['thumb62x62']})`}} />
                        <div style={{fontSize: '16px', letterSpacing: '-0.4px', marginLeft: '10px'}} className="nick">
                          {profile.nickNm}
                        </div>
                      </WriteAreaTop>
                      <SecoundTextarea
                        placeholder={placeholderTextStart}
                        onChange={textChangeReply}
                        value={replyRegist}
                        maxLength={100}
                      />
                      <WriteAreaBottom>
                        <TextCount>
                          <span style={{color: '#424242'}}>{`${replyRegist.length * 2}`}</span>
                          <span style={{color: '#9e9e9e'}}>{` / ${MaxCommentLength * 2}`}</span>
                        </TextCount>
                        <CommentSubmitBtn onClick={() => uploadReply(writeNumer, boardNumer)}>등록</CommentSubmitBtn>
                      </WriteAreaBottom>
                    </SecoundBigSubmit>

                    <DaeModifyWrap className={hidden === true ? '' : 'disable'}>
                      <StartBottom>
                        <div className="titlewrap">
                          <Imgbox bg={modifyInfo.profileImg} />
                          <div>
                            <span>{modifyInfo.nickNm}</span>
                            <span>(@{modifyInfo.memId})</span>
                            <span>{modifyInfo.parseDT}</span>
                          </div>
                        </div>
                        <article className="modifyborder">
                          <textarea
                            placeholder={placeholderTextStart}
                            onChange={textChangeReplyModify}
                            value={modifyInComment}
                            maxLength={49}
                            ref={inputEl}
                            className="modifyInput"
                          />
                          <div className="countmodify">
                            <TextCount className="modifyTextCount">
                              <span style={{color: '#424242'}}>{`${modifyInComment.length * 2}`}</span>
                              <span style={{color: '#9e9e9e'}}>{` / ${MaxCommentLength}`}</span>
                            </TextCount>
                            <div className="btnwraps">
                              <button onClick={() => moidfyCancel()} className="cancelbtns">
                                취소
                              </button>
                              <button onClick={() => fetchDataEditReply(writeNumer, boardNumer)} className="modifybtns">
                                수정
                              </button>
                            </div>
                          </div>
                        </article>
                      </StartBottom>
                    </DaeModifyWrap>
                  </div>
                )}
              </CommentBox>
            )
          })}
        </ListArea>
      </FanBoard>
      <BG onClick={clickRefresh} className={showBtn !== '' || showBtnReply !== '' ? 'on' : ''}></BG>
    </>
  )
}
//팬보드 전체 영역
const FanBoard = styled.div`
  margin-top: 16px;
`
//초기 등록 버튼
const InitialBigSubmit = styled.div`
  display: none;
  border: solid 1px #bdbdbd;
  &.on {
    display: block;
  }
`
const WriteAreaTop = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 11.5px 20px 0 20px;
  & .nick {
    font-size: 16px;
    font-weight: 600;
    letter-spacing: -0.4px;
    color: 000;
  }
`
const WriteAreaBottom = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`
const TextCount = styled.div`
  width: calc(100% - 68px);
  font-size: 14px;
  padding: 0px 20px;
  line-height: 34px;
  height: 36px;
  box-sizing: border-box;
  border-top: 1px solid #bdbdbd;
`
const CommentSubmitBtn = styled.button`
  display: block;
  width: 68px;
  height: 36px;
  text-align: center;
  font-size: 16px;
  color: #fff;
  z-index: 2;
  border-top: solid 1px #632beb;
  background-color: #632beb;
  position: relative;
  margin-right: -1px;
`

const OwnPhoto = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
`
const Textarea = styled.textarea`
  display: block;
  width: 100%;
  font-size: 16px;
  height: 84px;
  font-family: inherit;
  padding: 12px 20px;
  box-sizing: border-box;

  &::placeholder {
    color: #757575;
    font-size: 16px;
    letter-spacing: -0.35px;
    line-height: 1.57;
  }

  &:focus {
    outline: none;
  }
`

const InitialSubmit = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 36px;
  background-color: #ffffff;
  & div {
    width: calc(100% - 60px);
    border: solid 1px #bdbdbd;
    padding-left: 10px;
    height: 36px;
    line-height: 34px;
    font-size: 16px;
    letter-spacing: -0.4px;
    color: #757575;
    p {
    }
  }

  & button {
    display: block;
    height: 100%;
    width: 60px;
    z-index: 2;
    border: solid 1px #632beb;
    background-color: #632beb;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: -0.4px;
    color: #ffffff;
  }
  &.on {
    display: none;
  }
`
//리스트영역
const ListArea = styled.div`
  margin: 18px 0;
`
const ListTitle = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: #000;
  padding-bottom: 10px;
  letter-spacing: -0.4px;
  border-bottom: 1px solid #bdbdbd;
  & .titlecount {
    color: #632beb;
  }
  & > span {
    vertical-align: center;

    transform: skew(-0.03deg);
  }
`
const CommentBox = styled.div`
  position: relative;
  display: block;
  width: 100%;
  border-bottom: 1px solid #bdbdbd;

  & .bjIcon {
    display: block;
    width: 23px;
    height: 16px;
    margin-top: 6px;
    margin-right: 4px;
    background: url(${BJicon}) no-repeat center center / cover;
  }
  & .CommentWrap {
    display: block;
  }
  & .disableCommentWrap {
    display: none;
  }
  & .titlewrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0 12px 0;
    div:nth-child(2) {
      display: flex;
      flex-wrap: wrap;
      width: calc(100% - 42px);
      a {
        display: flex;
        align-items: center;
      }
      a span:nth-child(1) {
        display: block;
        max-width: 60.56%;
        overflow-x: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #424242;
        font-size: 16px;
        font-weight: 600;
        letter-spacing: -0.35px;
        transform: skew(-0.03deg);
        margin-right: 4px;
      }
      a span:nth-child(2) {
        display: block;
        width: calc(39.44% - 4px);
        color: ${COLOR_MAIN};
        font-size: 14px;
        font-weight: 400;
        letter-spacing: -0.03px;
        transform: skew(-0.03deg);
      }
      a + span {
        display: block;
        width: 100%;
        font-weight: 600;

        color: #616161;
        font-size: 14px;
        letter-spacing: -0.3px;
        transform: skew(-0.03deg);
      }
    }
  }
  .content {
    width: 100%;
    margin-bottom: 17px;
    font-size: 16px;
    color: #424242;
    line-height: 1.57;
    letter-spacing: -0.35px;
    transform: skew(-0.03deg);
    word-break: break-word;
  }
  .daeContent {
    margin-bottom: 10px;
  }
  .reply {
    display: block;
    padding: 0 8px;
    height: 28px;
    margin-bottom: 12px;
    border: solid 1px #e0e0e0;
    font-size: 14px;
    color: #424242;
    transform: skew(-0.03deg);
    background: #f8f8f8;
    > span {
      color: ${COLOR_MAIN};
    }
  }
  & .replyWrap {
    width: calc(100% + 9.8%);
    margin-left: -4.9%;
    margin-bottom: -1px;

    /* padding: 12px 0; */
    /* padding: 0px 0 17px 0; */
    background-color: #f8f8f8;
    & > div:first-child > .titlewrap {
      padding-top: 12px;
    }
  }
  & .startBtn {
    right: 10px;
  }
  & .replyContent {
    display: block;
    position: relative;
    padding: 0 20px;

    &:last-child {
    }
  }
  & .disableReplyContent {
    display: none;
    position: relative;
    padding: 0 20px;

    &:last-child {
    }
  }
`
const Imgbox = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: url(${(props) => props.bg}) no-repeat center center / cover;
`
const BtnIcon = styled.button`
  position: absolute;
  top: 8px;
  right: 0;
  display: none;
  width: 36px;
  height: 36px;
  background: url(${IMG_SERVER}/images/api/ic_more.png) no-repeat center center / cover;
  z-index: 8;
  &.on {
    display: block;
  }
  &.onStart {
    right: 16px;
    display: block;
  }
`
const DetailBtn = styled.div`
  position: absolute;
  top: 36px;
  right: 24px;
  display: none;
  z-index: 9;
  flex-direction: column;
  width: 103px;
  padding: 10px 0;
  justify-content: center;
  border: 1px solid #e0e0e0;
  &.active {
    display: flex;
    background-color: #fff;
  }
  &.activeFan {
    display: flex;
    background-color: #fff;
    right: 0px;
  }
  & a {
    display: none;
    text-align: center;
    padding: 6px;
    font-size: 14px;
    z-index: 9;
    letter-spacing: -0.35px;
    color: #757575;
    background-color: #fff;
    transform: skew(-0.03deg);
    &.on {
      display: block;
    }
  }
  & a:hover {
    background-color: #f8f8f8;
  }
`
/////댓글
const ReplyWrap = styled.div`
  display: block;
  position: relative;
  padding: 0 20px;
  border-top: 1px solid #e0e0e0;
  :last-child {
    border-bottom: none !important;
  }
  &.disable {
    display: none;
  }
`
////댓글 등록 인풋
const ReplySubmit = styled.div`
  display: flex;
  align-items: center;
  width: calc(100% - 40px);
  height: 36px;
  padding: 6px 0 12px 0;
  box-sizing: content-box;
  margin: 0px auto 0px auto;
  &.padding6 {
    padding: 12px 0;
  }
  & div {
    width: calc(100% - 60px);
    height: 36px;
    border: solid 1px #bdbdbd;
    padding-left: 10px;
    background-color: #ffffff;
    line-height: 34px;
    font-size: 16px;
    letter-spacing: -0.4px;
    color: #757575;
    p {
    }
  }
  & button {
    display: block;
    height: 100%;
    width: 60px;
    z-index: 2;
    border: solid 1px #632beb;
    background-color: #632beb;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: -0.4px;
    color: #ffffff;
  }
  &.hide {
    display: none;
  }
`
//대댓글 등록 버튼
const SecoundBigSubmit = styled.div`
  display: none;
  width: calc(100% - 40px);
  background-color: #fff;
  margin: 0 auto;
  border: solid 1px #bdbdbd;
  &.on {
    display: block;
  }
`
//대댓글 텍스트 아리아
const SecoundTextarea = styled.textarea`
  display: block;
  width: 100%;
  font-size: 16px;
  height: 84px;
  font-family: inherit;
  padding: 12px 20px;
  box-sizing: border-box;
  background-color: #fff;

  &::placeholder {
    color: #757575;
    font-size: 16px;
    letter-spacing: -0.35px;
    line-height: 1.57;
  }

  &:focus {
    outline: none;
  }
`
//대댓글수정
const DaeModifyWrap = styled.section`
  position: relative;
  width: 100%;
  border-top: solid 1px #bdbdbd;
  border-bottom: solid 1px #bdbdbd;
  & .modifyborder {
    margin: 0px 20px 12px 20px;
    border: solid 1px #bdbdbd;
    & .modifyInput {
      display: block;
      width: 100%;
      min-height: 84px;
      padding: 12px;
      font-size: 16px;
      line-height: 1.5;
      letter-spacing: -0.4px;
      text-align: left;
      color: #000000;
    }
  }
  & .titlewrap {
    padding: 12px 12px;
  }
  > div {
    display: flex;
    flex-direction: column;
    border: none;
  }
  &.disable {
    display: none;
  }
  & div:nth-child(2) > div {
    padding: 0;
  }
  & .countmodify {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .cancelbtns {
      height: 36px;
      background-color: #bdbdbd;
    }
    .btnwraps {
      display: flex;
      & button {
        width: 59px;
      }
    }
    .modifyTextCount {
      border: none;
      height: 36px;
      line-height: 36px;
      padding-left: 12px;
      background-color: #fff;
      border-top: solid 1px #bdbdbd;
      /* height: 52px; */
    }
  }
`
const StartBottom = styled.div`
  display: flex;
  > div.start{
    border: 1px solid #d0d0d0;
  }
  & span {
    font-size: 14px;
 
  line-height: 1.25;
  letter-spacing: -0.4px;
  text-align: left;
  color: #000000;

  :nth-child(2) {
    font-size: 14px;
    color: #632beb;
  }
  :nth-child(3) {
    font-size: 14px;
  font-weight: 600;
  line-height: 1.43;
  letter-spacing: -0.35px;
  text-align: left;
  color: #616161;
  }

  }

  &.bottomstart {
    border: none;
    /* border-bottom: 1px solid #eeeeee; */
    padding: 16px;

    > div {
      display: block;
      width: auto;
      padding: 16px 0 16px 16px;
      font-size: 14px;
      line-height: 1.43;
      letter-spacing: -0.35px;
      transform: skew(-0.03deg);
      color: #bdbdbd;
      font-size: 14px;
      letter-spacing: -0.35px;
      line-height: 1.43;
      transform: skew(-0.03deg);
    }

    input {
      display: block;
      width: calc(100% - 68px);
      padding: 16px 0 16px 16px;
      font-size: 14px;
      line-height: 1.43;
      letter-spacing: -0.35px;
      transform: skew(-0.03deg);
      border:1px solid #d0d0d0;
    }
  }
  > div {
    display: block;
    width: calc(100% - 68px);
    padding: 16px 0 16px 16px;
    font-size: 14px;
    line-height: 1.43;
    letter-spacing: -0.35px;
    transform: skew(-0.03deg);
    color: #bdbdbd;
    font-size: 14px;
    letter-spacing: -0.35px;
    line-height: 1.43;
    transform: skew(-0.03deg);
  }

  input {
    display: block;
    width: calc(100% - 68px);
    padding: 16px 0 16px 16px;
    font-size: 14px;
    line-height: 1.43;
    letter-spacing: -0.35px;
    transform: skew(-0.03deg);

    &::placeholder {
      color: #bdbdbd;
      font-size: 14px;
      letter-spacing: -0.35px;
      line-height: 1.43;
      transform: skew(-0.03deg);
    }
  }
  button {
    display: block;
    width: 68px;
    background-color: ${COLOR_MAIN};
    color: #fff;
    /* border-bottom: 1px solid ${COLOR_MAIN};
    border-top: 1px solid ${COLOR_MAIN}; */
  }
  &.on {
    margin-top: 18px;
  }
  &.show {
    display: flex;
    margin-top: 18px;
  }
  &.disable {
    display: none;
    margin-top: 18px;
  }
`
//큰댓글 수정
const WriteArea = styled.div`
  border-bottom: none;
  display: none;
  &.on {
    display: block;
  }
  &.onModify {
    display: block;
    margin-top: 10px;
    & button {
      padding: 15px 0;
    }
  }
  & .modiInput {
    border: 1px solid #bdbdbd;
    border-bottom: none;
  }
`
const CommentSubmitBtnCancel = styled.button`
  width: 92px;
  text-align: center;
  font-size: 16px;
  color: #fff;
  padding: 16px 0;
  background-color: #bdbdbd;
  position: relative;
`
const TextCountModify = styled.div`
  width: calc(100% - 68px);
  padding-left: 12px;
  font-size: 14px;
  line-height: 36px;
  height: 36px;
  box-sizing: border-box;
  border-top: solid 1px #bdbdbd;
`
const WriteAreaBottomModify = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`
const CommentSubmitBtnCancelModify = styled.button`
  width: 59px;
  padding: 0;
  text-align: center;
  font-size: 16px;
  padding: 0 !important;
  color: #fff;
  height: 36px;
  background-color: #bdbdbd;
  position: relative;
`
const CommentSubmitBtnModify = styled.button`
  display: block;
  width: 59px;
  height: 36px;
  padding: 0 !important;
  text-align: center;
  font-size: 16px;
  color: #fff;
  z-index: 2;
  border-top: solid 1px #632beb;
  background-color: #632beb;
  position: relative;
  margin-right: -1px;
`
//대댓글 수정 아이콘
const BtnIconModify = styled.button`
  position: absolute;
  top: 8px;
  right: 0;
  display: none;
  width: 36px;
  height: 36px;
  background: url(${IMG_SERVER}/images/api/ic_more.png) no-repeat center center / cover;
  z-index: 8;
  &.on {
    display: block;
  }
  &.onStart {
    right: 16px;
    display: block;
  }
`
const DetailBtnModify = styled.div`
  position: absolute;
  top: 52px;
  right: 0;
  display: none;
  z-index: 9;
  flex-direction: column;
  width: 103px;
  padding: 10px 0;
  justify-content: center;
  border: 1px solid #e0e0e0;
  &.active {
    display: flex;
    background-color: #fff;
  }
  & a {
    display: none;
    text-align: center;
    padding: 6px;
    font-size: 14px;
    z-index: 9;
    letter-spacing: -0.35px;
    color: #757575;
    background-color: #fff;
    transform: skew(-0.03deg);
    &.on {
      display: block;
    }
  }
  & a:hover {
    background-color: #f8f8f8;
  }
`
const BG = styled.div`
  display: none;
  position: fixed;
  z-index: 7;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  &.on {
    display: block;
  }
`
