import React, {useState, useContext, useRef} from 'react'
import {useHistory} from 'react-router-dom'

//context
import {Context} from 'context'
import {IMG_SERVER, PHOTO_SERVER} from 'context/config'
import Utility from 'components/lib/utility'

// static
import NoResult from 'components/ui/new_noResult'
import './comment.scss'
const EventComment = (props) => {
  const { commentList, totalCommentCnt, commentAdd, commentUpd, commentTxt, setCommentTxt, setCommentNo, commentDel, setCurrentPage, contPlaceHolder, noResultMsg, maxLength } = props;
  const globalCtx = useContext(Context)
  const {token} = globalCtx
  const history = useHistory()
  const contRef = useRef()

  const [moreState, setMoreState] = useState(-1)
  const [refreshState, setRefreshState] = useState(false)
  const [writeState, setWriteState] = useState(false)

  const moreToggle = (boardIdx) => {
    if (boardIdx !== moreState) {
      setMoreState(boardIdx)
    } else {
      setMoreState(-1)
    }
  }

  const refreshFunc = async () => {
    if (refreshState === false) {
      setRefreshState(true)
      await new Promise((resolve, _) => setTimeout(() => resolve(), 300))
      setRefreshState(false)
    } else {
      setRefreshState(false)
    }
    setCurrentPage(0)
  };

  // 사연 내용 validation
  const inputValueCheck = (e) => {
    const value = e.currentTarget.value;

    if (value.length > 0) {
      setWriteState(true)
    } else {
      setWriteState(false);
    }

    if (value.length >= maxLength) {
      globalCtx.action.toast({msg: `최대 ${maxLength}자 이내 입력 가능합니다.`})
    }
  };

  // 프로필 이동 이벤트
  const goProfile = (e) => {
    const { targetMemNo } = e.currentTarget.dataset;

    if (targetMemNo !== undefined && targetMemNo > 0) {
      history.push(`/mypage/${targetMemNo}`)
    }
  };
  
  // 댓글 쓰기 이벤트
  const contEvent = () => {
    if (contRef !== undefined && contRef.current.value.length > 0) {
      commentAdd(contRef.current.value);
      contRef.current.value = '';
    } else {
      globalCtx.action.toast({msg: '사연을 입력해주세요.'});
    }
  }

  return (
    <div className="commentEventWrap">
      {globalCtx.token.isLogin &&
        <div className="addInputBox">
          <div className="userBox">
            <div className="photo"><img src={globalCtx.profile.profImg.thumb62x62} /></div>
            <div className="userNick">{globalCtx.profile.nickNm}</div>
          </div>
          <textarea placeholder={contPlaceHolder} ref={contRef} onChange={inputValueCheck}/>
          <button className={`writeBtn ${writeState ? 'on' : ''}`} onClick={contEvent}>등록</button>
        </div>
      }
      <div className="commentBox">
        <div className="totalBox">
          댓글 <span>{`${totalCommentCnt}`}</span>개
          <button className={`refreshBtn ${refreshState ? 'on' : ''}`} onClick={refreshFunc}>
            <img src={`${IMG_SERVER}/main/ico_live_refresh_new_s.svg`} alt="새로고침" />
          </button>
        </div>

        <div className="listBox">
          {commentList.length > 0 ? (
            <>
              {commentList.map((value, idx) => {
                const {tail_no, image_profile, mem_nick, tail_mem_no, ins_date, tail_conts} = value

                return (
                  <div className="listItem" key={`comment-${idx}`}>
                    <div className="thumb" onClick={goProfile} data-target-mem-no={tail_mem_no}>
                      <img src={`${PHOTO_SERVER + (image_profile !== '' ? `${image_profile}?120x120` : '/profile_3/profile_m_200327.jpg')}`} alt={mem_nick}/>
                    </div>
                    <div className="textBox">
                      <div className="nick">
                        {mem_nick}
                        <span className="date"> {ins_date}</span>
                      </div>
                      <p className="msg" dangerouslySetInnerHTML={{__html: Utility.nl2br(tail_conts)}}/>
                    </div>

                    {parseInt(token.memNo) === tail_mem_no ? (
                      <>
                        <button className="btnMore" onClick={() => { moreToggle(idx) }}/>
                        {moreState === idx && (
                          <div className="moreList">
                            <button onClick={commentDel}>삭제</button>
                          </div>
                        )}
                      </>
                    ) : (
                      globalCtx.adminChecker === true &&
                      parseInt(token.memNo) !== tail_mem_no && (
                        <button className="btnDelete" onClick={commentDel}>
                          <img src="https://image.dalbitlive.com/svg/close_g_l.svg" alt="삭제하기" />
                        </button>
                      )
                    )}
                  </div>
                )
              })}
            </>
          ) : (
            <NoResult type="default" text={noResultMsg}/>
          )}
        </div>
      </div>
    </div>
  )
}

EventComment.defaultProps = {
  contPlaceHolder: '댓글을 입력해주세요. (최대 300자)',
  noResultMsg: '아직 작성된 댓글이 없습니다.',
  commentList: [],
  maxLength: 300,
};

export default EventComment;