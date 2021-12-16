import React, {useState, useContext, useRef} from 'react'
import {useHistory} from 'react-router-dom'

//context
import {Context} from 'context'
import {IMG_SERVER} from 'context/config'
import Utility from 'components/lib/utility'

// static
import NoResult from 'components/ui/new_noResult'
import './comment.scss'

export default function eventComment({
  commentList,
  totalCommentCnt,
  commentAdd,
  commentUpd,
  commentTxt,
  setCommentTxt,
  setCommentNo,
  commentDel,
  setCurrentPage
}) {
  const globalCtx = useContext(Context)
  const {token} = globalCtx
  const history = useHistory()
  const focus = useRef()

  const [moreState, setMoreState] = useState(-1)
  const [modifyState, setModifyState] = useState(false)
  const [refreshState, setRefreshState] = useState(false)
  const [writeState, setWriteState] = useState(false)

  const loginCheck = () => {
    if (!token.isLogin) {
      globalCtx.action.alert({
        msg: '해당 서비스를 위해<br/>로그인을 해주세요.',

        callback: () => {
          history.push({
            pathname: '/login',
            state: {
              state: 'event/anniversary?tab=comment'
            }
          })
        }
      })
    } else {
    }
  }

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
  }

  return (
    <div className="commentEventWrap">
      <div className="addInputBox" onClick={() => loginCheck()}>
        <div className="userBox">
          <div className="photo">{/* <img src={globalCtx.profile.profImg.thumb62x62} /> */}</div>
          <div className="userNick">{globalCtx.profile.nickNm}test</div>
        </div>
        <textarea
          placeholder="댓글을 입력해주세요. (최대 300자)"
          value={commentTxt}
          ref={focus}
          onChange={(e) => {
            const target = e.currentTarget
            const value = target.value
            if (value.length >= 300) {
              globalCtx.action.toast({msg: '최대 300자 이내 입력 가능합니다.'})
            } else {
              setWriteState(true)
              setCommentTxt(value)
            }
          }}></textarea>
        {modifyState === false ? (
          <button
            className={`writeBtn ${writeState ? 'on' : ''}`}
            onClick={() => {
              commentAdd(setWriteState)
            }}>
            등록
          </button>
        ) : (
          <button
            className={`writeBtn ${writeState ? 'on' : ''}`}
            onClick={() => {
              commentUpd(setWriteState, setModifyState, commentTxt)
            }}>
            수정
          </button>
        )}
      </div>
      <div className="commentBox">
        <div className="totalBox">
          댓글 <span>{`${totalCommentCnt}`}</span>개
          <button
            className={`refreshBtn ${refreshState ? 'on' : ''}`}
            onClick={() => {
              refreshFunc()
            }}>
            <img src={`${IMG_SERVER}/main/ico_live_refresh_new_s.svg`} alt="새로고침" />
          </button>
          {/* <img
            onClick={() => {
              setCommentList([])
              fetchCommentData()
            }}
          /> */}
        </div>

        <div className="listBox">
          {commentList && commentList.length > 0 ? (
            <>
              {commentList.map((value, idx) => {
                const {tail_no, image_profile, mem_nick, tail_mem_no, ins_date, tail_conts} = value

                return (
                  <div className="listItem" key={`comment-${idx}`}>
                    <div
                      className="thumb"
                      onClick={() => {
                        history.push(`/mypage/${tail_mem_no}`)
                      }}>
                      <img
                        src={
                          image_profile
                            ? `https://photo.dalbitlive.com${image_profile}?120x120`
                            : `https://photo.dalbitlive.com/profile_3/profile_m_200327.jpg`
                        }
                        alt={mem_nick}
                      />
                    </div>
                    <div className="textBox">
                      <div className="nick">
                        {mem_nick}
                        <span className="date"> {ins_date}</span>
                      </div>
                      <p className="msg" dangerouslySetInnerHTML={{__html: Utility.nl2br(tail_conts)}}></p>
                    </div>

                    {parseInt(token.memNo) === tail_mem_no && modifyState === false ? (
                      <>
                        <button
                          className="btnMore"
                          onClick={() => {
                            moreToggle(idx)
                          }}></button>
                        {moreState === idx && (
                          <div className="moreList">
                            <button
                              onClick={() => {
                                setCommentNo(tail_no)
                                setCommentTxt(tail_conts)
                                setMoreState(-1), setModifyState(true)
                                focus.current.focus()
                              }}>
                              수정
                            </button>
                            <button
                              onClick={() => {
                                commentDel(tail_no, tail_mem_no), setMoreState(-1)
                              }}>
                              삭제
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      globalCtx.adminChecker === true &&
                      parseInt(token.memNo) !== tail_mem_no && (
                        <button
                          className="btnDelete"
                          onClick={() => {
                            commentDel(tail_no, tail_mem_no)
                          }}>
                          <img src="https://image.dalbitlive.com/svg/close_g_l.svg" alt="삭제하기" />
                        </button>
                      )
                    )}
                  </div>
                )
              })}
            </>
          ) : (
            <NoResult type="default" text="아직 작성된 댓글이 없습니다." />
          )}
        </div>
      </div>
    </div>
  )
}
