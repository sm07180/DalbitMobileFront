import React, {useState, useContext, useRef} from 'react'
import {useHistory} from 'react-router-dom'

import {IMG_SERVER, PHOTO_SERVER} from 'context/config'
import Utility from 'components/lib/utility'

// static
import NoResult from 'components/ui/noResult/NoResult'
import './comment.scss'
import moment from 'moment'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

const EventComment = (props) => {
  const {commentList,
    totalCommentCnt,
    myCommentView,
    setMyCommentView,
    commentAdd,
    commentRpt,
    commentDel,
    resetStoryList,
    contPlaceHolder,
    noResultMsg,
    maxLength,
    contTitle
  } = props;
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const {token} = globalState
  const history = useHistory()
  const contRef = useRef()
  const lengthRef = useRef()

  const [moreState, setMoreState] = useState(-1)
  const [writeState, setWriteState] = useState(false)

  const moreToggle = (boardIdx) => {
    if (boardIdx !== moreState) {
      setMoreState(boardIdx)
    } else {
      setMoreState(-1)
    }
  }

  // 사연 내용 validation
  const inputValueCheck = (e) => {
    const value = e.currentTarget.value

    if (value.length > 0) {
      setWriteState(true)
    } else {
      setWriteState(false)
    }

    lengthRef.current.innerText = e.currentTarget.value.length

    if (value.length >= maxLength) {
      dispatch(setGlobalCtxMessage({type: "toast",msg: `최대 ${maxLength}자 이내 입력 가능합니다.`}))
      return
    }
  }

  // 프로필 이동 이벤트
  const goProfile = (e) => {
    const {targetMemNo} = e.currentTarget.dataset

    if (targetMemNo !== undefined && targetMemNo > 0) {
      history.push(`/profile/${targetMemNo}`)
    }
  }

  // 댓글 쓰기 이벤트
  const contAddEvent = () => {
    if (contRef === undefined || lengthRef === undefined) return

    // 공백 제거
    contRef.current.value = contRef.current.value.trim()
    lengthRef.current.innerText = contRef.current.value.length

    if (contRef.current.value.length > 0) {
      setMoreState(-1)
      commentAdd(contRef.current.value)
      contRef.current.value = ''
      lengthRef.current.innerText = contRef.current.value.length
    } else {
      dispatch(setGlobalCtxMessage({type: "toast",msg: `${contTitle}을 입력해주세요.`}))
    }
  }

  // 댓글 삭제 이벤트
  const contDelEvent = (e) => {
    const {targetNum} = e.currentTarget.dataset

    if (targetNum !== undefined) {
      dispatch(setGlobalCtxMessage({type: "confirm",
        callback: () => {
          setMoreState(-1)
          commentDel(targetNum)
        },
        msg: `해당 ${contTitle}을 삭제하시겠습니까?\n`
      }))
    }
  }

  // 댓글 신고 이벤트
  const contRptEvent = (e) => {
    const {targetNum} = e.currentTarget.dataset

    if (targetNum !== undefined) {
      dispatch(setGlobalCtxMessage({type: "confirm",
        callback: () => {
          setMoreState(-1)
          commentRpt(targetNum)
        },
        msg: `해당 ${contTitle}을 신고하시겠습니까?\n`
      }))
    }
  }

  // 새로고침 이벤트
  const refreshList = (e) => {
    const target = e.currentTarget
    if (target !== undefined) {
      resetStoryList()
      target.classList.remove('on')
      setTimeout(() => {
        target.classList.add('on')
      }, 0)
    }
  }

  // 시간값 계산 함수
  const getFormatting = (data) => {
    const targetTime = moment(data)
    const duration = moment.duration(moment().diff(targetTime))

    if (duration.days() > 0) {
      return targetTime.format('YYYY-MM-DD')
    } else if (duration.hours() > 0) {
      return `${duration.hours()} 시간 전`
    } else if (duration.minutes() > 0) {
      return `${duration.minutes()} 분 전`
    } else {
      return `${duration.seconds()} 초 전`
    }
  }

  return (
    <div className="commentEventWrap">
      {globalState.token.isLogin && (
        <div className="addInputBox">
          <div className="textareaWrap">
            <textarea placeholder={contPlaceHolder} ref={contRef} onChange={inputValueCheck} maxLength={maxLength} />
            <div className="textCount">
              <strong ref={lengthRef}>0</strong>/{maxLength}
            </div>
          </div>
          <button className={`writeBtn ${writeState ? 'on' : ''}`} onClick={contAddEvent}>
            등록
          </button>
        </div>
      )}
      <div className="commentBox">
        <div className="totalBox">
          {contTitle}<span>{`${Utility.addComma(totalCommentCnt)}`}개</span>
          <button className="refreshBtn" onClick={refreshList}>
            <img src={`${IMG_SERVER}/main/ico_event_refresh.png`} alt="새로고침" />
          </button>
          {globalState.token.isLogin && <button className="myCommentBtn" onClick={()=>setMyCommentView(!myCommentView)}>{myCommentView ? "전체 댓글 보기" : "내 댓글 보기"}</button>}
        </div>
        {commentList.length > 0 ? (
          <>
            {commentList.map((value, idx) => {
              const {tail_no, image_profile, mem_nick, tail_mem_no, ins_date, tail_conts} = value

              return (
                <div className="listBox" key={`comment-${idx}`}>
                  <div className="listItem">
                    <div className="thumb" onClick={goProfile} data-target-mem-no={tail_mem_no}>
                      <img
                        src={`${
                          PHOTO_SERVER + (image_profile !== '' ? `${image_profile}?120x120` : '/profile_3/profile_m_200327.jpg')
                        }`}
                        alt={mem_nick}
                      />
                    </div>
                    <div className="user">
                      <div className="nick">
                        {mem_nick}
                        <span className="date"> {getFormatting(ins_date)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="listItem">
                    <p className="msg">{tail_conts}</p>
                  </div>

                  {parseInt(token.memNo) == tail_mem_no &&
                  <div className="btnMore" onClick={() => {moreToggle(idx)}}>
                    {moreState === idx &&
                    <div className="moreList">
                      {parseInt(token.memNo) == tail_mem_no ?
                          <button data-target-num={tail_no} onClick={contDelEvent}>삭제하기</button> :
                          <button data-target-num={tail_no} onClick={contRptEvent}>신고하기</button>
                      }
                    </div>
                    }
                  </div>
                  }
                </div>
              )
            })}
          </>
        ) : (
          <NoResult ment={noResultMsg}/>
        )
        }
      </div>
    </div>
  )
}

EventComment.defaultProps = {
  contPlaceHolder: '댓글을 입력해주세요. (최대 300자)',
  noResultMsg: '아직 작성된 댓글이 없습니다.',
  commentList: [],
  maxLength: 300,
  contTitle: '댓글'
}

export default EventComment
