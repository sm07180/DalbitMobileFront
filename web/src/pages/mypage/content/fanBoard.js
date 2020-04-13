/**
 * @file /mypage/content/fan-board.js
 * @brief 마이페이지 팬보드
 */

import React, {useEffect, useState, useContext, useRef} from 'react'
import styled from 'styled-components'
import qs from 'query-string'
// context
import {Context} from 'context'
import {WIDTH_PC, WIDTH_TABLET, IMG_SERVER} from 'context/config'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P, PHOTO_SERVER} from 'context/color'
//api
import Api from 'context/api'
//layout
export default props => {
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
        records: 1000
      }
    })
    if (res.result === 'success') {
      setFanTotal(
        res.data.list.filter(function(item) {
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
      // context.action.alert({
      //   callback: () => {},
      //   msg: res.message
      // })
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
      //console.log(res)
    } else if (res.result === 'fail') {
      context.action.alert({
        callback: () => {},
        msg: res.message
      })
    }
  }

  //댓글 등록 온체인지
  const textChange = e => {
    const target = e.currentTarget
    const lineBreakLenght = target.value.split('\n').length

    if (target.value.length > MaxCommentLength) return
    setComment(target.value)

    if (lineBreakLenght >= 2) {
      target.style.height = `106px`
    } else {
      target.style.height = `106px`
    }
  }
  //댓글 삭제
  const deletApiFun = value => {
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
  const placeholderText =
    '팬 보드에 글을 남겨주세요. 타인에게 불쾌감을 주는 욕설 또는 비하글은 이용약관 및 관련 법률에 의해 제재를 받을 수 있습니다.'
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
  //등록
  const submitClick = () => {
    fetchDataUpload()
    setComment('')
    setActive(false)
  }
  //대댓글보기
  const ShowReplyBtnState = (writeNumer, boardNumer) => {
    if (btnState === true) {
      setBtnState(false)
    } else {
      setBtnState(true)
    }
    context.action.updateBoardNumber(boardNumer)
    showReply(writeNumer, boardNumer)
  }
  useEffect(() => {
    if (context.boardNumber === broadNumbers) {
      setBtnState(true)
    } else if (context.boardNumber !== broadNumbers) {
      setBtnState(false)
    }
  }, [context.boardNumber])
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
    }, 100)
    setReplyRegist('')
  }
  //대댓글 value
  const textChangeReply = e => {
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
  const textModify = e => {
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
  const textChangeReplyModify = e => {
    const target = e.currentTarget

    if (target.value.length > MaxCommentLength) return
    setModifyInComment(target.value)
  }
  //대댓글수정
  const replyModify = (contents, boardNumer, boardIdx, profileImg, nickNm, memId, parseDT) => {
    setModifyInComment(contents)
    setModifyInShow(boardIdx)
    setModifyNumber(boardIdx)
    setHidden(true)
    clickRefresh()
    setModifyInfo({profileImg, nickNm, memId, parseDT})
  }
  //수정취소
  const moidfyCancel = () => {
    setHidden(false)
    setModifyInComment('')
    setModifyInShow('')
    setModifyComment('')
    setModifyShow('')
  }

  //dateformat
  const timeFormat = strFormatFromServer => {
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
      fanTotal.filter(function(item) {
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
  return (
    <>
      <TopWrap>
        <button onClick={() => window.history.back()}></button>
        <div className="title">팬 보드</div>
      </TopWrap>
      {/* 전체영역 */}
      <FanBoard className="fanboard">
        <WriteArea className={active === true ? 'on' : ''}>
          <WriteAreaTop>
            <OwnPhoto style={{backgroundImage: `url(${profile.profImg['thumb62x62']})`}} />
            <div style={{fontSize: '16px', letterSpacing: '-0.4px', marginLeft: '10px'}}>{profile.nickNm}</div>
          </WriteAreaTop>
          <Textarea placeholder={placeholderText} onChange={textChange} value={comment} />
          <WriteAreaBottom>
            <TextCount>
              <span style={{color: '#424242'}}>{`${comment.length * 2}`}</span>
              <span style={{color: '#9e9e9e'}}>{` / ${MaxCommentLength * 2}`}</span>
            </TextCount>
            <CommentSubmitBtn onClick={submitClick}>등록</CommentSubmitBtn>
          </WriteAreaBottom>
        </WriteArea>
        <article className={active === true ? 'on' : ''} onClick={() => setActive(true)}>
          <StartBottom>
            <div>{placeholderTextStart}</div>
            <button>등록</button>
          </StartBottom>
        </article>
        {/* 팬보드 큰댓글 등록 영역---- */}
        <ListArea>
          <ListTitle>
            <span>게시글</span>
            <span style={{marginLeft: '4px', fontWeight: 'bold'}}>{count}</span>
          </ListTitle>
          {fanTotal.map((item, index) => {
            const {profImg, nickNm, writeDt, writerNo, contents, replyCnt, boardIdx, status, boardNo, memId} = item
            let value = boardIdx
            let writeNumer = writerNo
            let boardNumer = boardNo
            let link = ''
            if (webview) {
              link = profile.memNo !== writerNo ? `/mypage/${writerNo}/initial?webview=${webview}` : `/menu/profile`
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
                      <a href={link}>
                        <span>{nickNm}</span>
                        <span>(@{memId})</span>
                      </a>
                      <span>{timeFormat(writeDt)}</span>
                    </div>
                    <BtnIcon
                      onClick={() => setShowBtn(boardIdx)}
                      className={writerNo === profile.memNo || urlrStr === profile.memNo ? 'on' : ''}></BtnIcon>
                    <DetailBtn className={showBtn === boardIdx ? 'active' : ''}>
                      <a
                        className={writerNo === profile.memNo ? 'on' : ''}
                        onClick={() => FanboardModify(contents, boardIdx, boardNumer)}>
                        수정하기
                      </a>
                      <a
                        className={writerNo === profile.memNo || urlrStr === profile.memNo ? 'on' : ''}
                        onClick={() => DeleteComment(value)}>
                        삭제하기
                      </a>
                    </DetailBtn>
                  </div>
                  <div className="content">
                    <pre>{contents}</pre>
                  </div>
                  <button className="reply" onClick={() => ShowReplyBtnState(writeNumer, boardNumer)}>
                    답글 {replyCnt !== 0 && <span>{replyCnt}</span>}
                  </button>
                </div>
                {/* 댓글수정 */}
                <WriteArea className={modifyShow === boardIdx ? 'onModify' : ''}>
                  <WriteAreaTop>
                    <OwnPhoto style={{backgroundImage: `url(${profile.profImg['thumb62x62']})`}} />
                    <div style={{fontSize: '16px', letterSpacing: '-0.4px', marginLeft: '10px'}}>{profile.nickNm}</div>
                  </WriteAreaTop>
                  <Textarea placeholder={placeholderText} onChange={textModify} value={modifyComment} />
                  <WriteAreaBottom>
                    <TextCount>
                      <span style={{color: '#424242'}}>{`${modifyComment.length * 2}`}</span>
                      <span style={{color: '#9e9e9e'}}>{` / ${MaxCommentLength * 2}`}</span>
                    </TextCount>
                    <CommentSubmitBtnCancel onClick={() => moidfyCancel()}>취소</CommentSubmitBtnCancel>
                    <CommentSubmitBtn onClick={() => fetchDataEdit(boardNumer)}>수정</CommentSubmitBtn>
                  </WriteAreaBottom>
                </WriteArea>
                {/*  큰댓글 컨텐츠 영역---- */}
                {boardNumer === broadNumbers && btnState === true && (
                  <div className="replyWrap">
                    {replyInfo.map((reply, index) => {
                      const {profImg, nickNm, writeDt, writerNo, contents, replyCnt, boardIdx, status, boardNo, memId} = reply
                      let value = boardIdx
                      const profileImg = profImg.thumb62x62
                      const parseDT = timeFormat(writeDt)
                      let link = ''
                      if (webview) {
                        link = profile.memNo !== writerNo ? `/mypage/${writerNo}/initial?webview=${webview}` : `/menu/profile`
                      } else {
                        link = profile.memNo !== writerNo ? `/mypage/${writerNo}` : `/menu/profile`
                      }
                      if (status !== 1) return
                      //console.log(boardIdx)
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
                            <BtnIcon
                              onClick={() => setShowBtnReply(boardIdx)}
                              className={writerNo === profile.memNo || urlrStr === profile.memNo ? 'on' : ''}></BtnIcon>
                            <DetailBtn className={showBtnReply === boardIdx ? 'active' : ''}>
                              <a
                                className={writerNo === profile.memNo ? 'on' : ''}
                                onClick={() => replyModify(contents, boardNumer, boardIdx, profileImg, nickNm, memId, parseDT)}>
                                수정하기
                              </a>
                              <a
                                className={writerNo === profile.memNo || urlrStr === profile.memNo ? 'on' : ''}
                                onClick={() => DeleteComment(value, writeNumer, boardNumer)}>
                                삭제하기
                              </a>
                            </DetailBtn>
                          </div>
                          <div className="content">{contents}</div>
                        </ReplyWrap>
                      )
                    })}
                    <StartBottom className={hidden === false ? '' : 'disable'}>
                      <input placeholder={placeholderTextStart} onChange={textChangeReply} value={replyRegist} maxLength={100} />
                      <button onClick={() => uploadReply(writeNumer, boardNumer)}>등록</button>
                    </StartBottom>
                    <MMwrap className={hidden === true ? '' : 'disable'}>
                      <StartBottom>
                        <div className="titlewrap">
                          <Imgbox bg={modifyInfo.profileImg} />
                          <div>
                            <span>{modifyInfo.nickNm}</span>
                            <span>(@{modifyInfo.memId})</span>
                            <span>{modifyInfo.parseDT}</span>
                          </div>
                        </div>

                        <input
                          placeholder={placeholderTextStart}
                          onChange={textChangeReplyModify}
                          value={modifyInComment}
                          maxLength={49}
                          ref={inputEl}
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
                      </StartBottom>
                    </MMwrap>
                  </div>
                )}
              </CommentBox>
            )
          })}
          {/*  대댓글 컨텐츠 영역---- */}
        </ListArea>
      </FanBoard>
      <BG onClick={clickRefresh} className={showBtn !== '' || showBtnReply !== '' ? 'on' : ''}></BG>
    </>
  )
}

const ReplyWrap = styled.div`
  display: block;
  position: relative;
  padding: 0 20px;
  border-bottom: 1px solid #eeeeee;

  &:last-child {
    border-bottom: 1px solid none;
  }

  &.disable {
    display: none;
  }
`
const ListTitle = styled.div`
  font-size: 16px;
  color: #616161;
  padding-bottom: 16px;
  letter-spacing: -0.4px;
  border-bottom: 1px solid #bdbdbd;

  & > span {
    vertical-align: center;
    transform: skew(-0.03deg);
  }
`

const ListArea = styled.div`
  margin: 24px 0;
`

const CommentSubmitBtn = styled.button`
  width: 92px;
  text-align: center;
  font-size: 16px;
  color: #fff;
  padding: 16px 0;
  background-color: #8556f6;
  position: relative;
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
const TextCount = styled.div`
  width: calc(100% - 92px);
  font-size: 14px;
  padding: 17px 20px;
  height: 50px;
  box-sizing: border-box;
  border-top: 1px solid #ededed;
  border-bottom: 1px solid #d0d0d0;
  & span {
    transform: skew(-0.03deg);
  }
`

const WriteAreaBottom = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`
const Textarea = styled.textarea`
  display: block;
  width: 100%;
  font-size: 14px;
  height: 106px;
  font-family: inherit;
  padding: 18px 20px;
  box-sizing: border-box;

  &::placeholder {
    color: #bdbdbd;
    font-size: 14px;
    letter-spacing: -0.35px;
    line-height: 1.57;
  }

  &:focus {
    outline: none;
  }
`

const OwnPhoto = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
`

const WriteAreaTop = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 12px 20px 0 20px;
`

const WriteArea = styled.div`
  border: 1px solid #d0d0d0;
  border-bottom: none;
  display: none;
  &.on {
    display: block;
  }
  &.onModify {
    display: block;
    margin-top: 10px;
  }
`
const StartBottom = styled.div`
  display: flex;
  border: 1px solid #d0d0d0;
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
//mother
const FanBoard = styled.div`
  margin-top: 24px;
  /* 등록 숨김 */
  article {
    display: block;
    cursor: pointer;
    &.on {
      display: none;
    }
  }
  & .CommentWrap {
    display: block;
  }
  & .disableCommentWrap {
    display: none;
  }
`
const CommentBox = styled.div`
  position: relative;
  display: none;
  width: 100%;
  border-bottom: 1px solid #eeeeee;
  &.show {
    display: block;
  }
  & .titlewrap {
    display: flex;
    justify-content: space-between;
    padding: 16px 0;
    div:nth-child(2) {
      display: flex;
      flex-wrap: wrap;
      width: calc(100% - 42px);
      a {
        display: flex;
      }
      a span:nth-child(1) {
        display: block;
        max-width: 60.56%;
        overflow-x: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #424242;
        font-size: 14px;
        font-weight: 600;
        letter-spacing: -0.35px;
        transform: skew(-0.03deg);
        line-height: 1.43;
        margin-right: 4px;
      }
      a span:nth-child(2) {
        display: block;
        width: calc(39.44% - 4px);
        color: ${COLOR_MAIN};
        font-size: 12px;
        line-height: 1.8;
        letter-spacing: -0.03px;
        transform: skew(-0.03deg);
      }
      a + span {
        display: block;
        width: 100%;
        margin-top: 2px;
        color: #9e9e9e;
        font-size: 12px;
        letter-spacing: -0.3px;
        transform: skew(-0.03deg);
      }
    }
  }
  .content {
    width: 100%;
    margin: 0 0 16px 0;
    font-size: 14px;
    color: #424242;
    line-height: 1.57;
    letter-spacing: -0.35px;
    transform: skew(-0.03deg);
    word-break: break-word;
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
    > span {
      color: ${COLOR_MAIN};
    }
  }
  & .replyWrap {
    width: calc(100% + 9.8%);
    margin-left: -4.9%;
    margin-bottom: -1px;
    padding: 18px 4.445% 18px 4.445%;
    border-top: 1px solid #eeeeee;
    border-bottom: 1px solid #eeeeee;
    background-color: #f8f8f8;

    & > div:first-child > .titlewrap {
      padding-top: 0;
    }
  }

  & .replyContent {
    display: block;
    position: relative;
    padding: 0 20px;
    border-bottom: 1px solid #eeeeee;

    &:last-child {
      border-bottom: 1px solid none;
    }
  }
  & .disableReplyContent {
    display: none;
    position: relative;
    padding: 0 20px;
    border-bottom: 1px solid #eeeeee;

    &:last-child {
      border-bottom: 1px solid none;
    }
  }
`
const Imgbox = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: url(${props => props.bg}) no-repeat center center / cover;
`

const DetailBtn = styled.div`
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
const BtnIcon = styled.button`
  position: absolute;
  top: 16px;
  right: 0;
  display: none;
  width: 36px;
  height: 36px;
  background: url(${IMG_SERVER}/images/api/ic_more.png) no-repeat center center / cover;
  z-index: 8;
  &.on {
    display: block;
  }
`

const MMwrap = styled.section`
  width: 100%;

  & .titlewrap {
    padding: 16px 20px;
  }
  > div {
    display: flex;
    flex-direction: column;
    border: none;
    > input {
      padding: 16px 4px;
      margin: 0 16px;
      width: calc(100% - 32px);
    }
  }
  &.disable {
    display: none;
  }
  & div:nth-child(2) > div {
    padding: 0;
  }
  & .countmodify {
    width: calc(100% - 16px);

    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 0 16px 16px;
    .cancelbtns {
      height: 52px;
      background-color: #bdbdbd;
    }
    .btnwraps {
      display: flex;
    }
    .modifyTextCount {
      border: none;
      height: 52px;
    }
  }
`
const TopWrap = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid ${COLOR_MAIN};
  align-items: center;
  margin-top: 20px;
  padding-bottom: 12px;
  button:nth-child(1) {
    width: 24px;
    height: 24px;
    background: url(${IMG_SERVER}/images/api/btn_back.png) no-repeat center center / cover;
  }
  .title {
    width: calc(100% - 24px);
    color: ${COLOR_MAIN};
    font-size: 18px;
    font-weight: bold;
    letter-spacing: -0.5px;
    text-align: center;
  }
`
