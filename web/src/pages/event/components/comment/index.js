import React, {useState, useContext} from 'react'
import {useHistory} from 'react-router-dom'

//context
import {Context} from 'context'
import {PHOTO_SERVER} from 'context/config'
import Utility from 'components/lib/utility'

// static
import NoResult from 'components/ui/noResult'
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

  const [moreState, setMoreState] = useState(-1)
  const [modifyState, setModifyState] = useState(true)
  const [refreshState, setRefreshState] = useState(false)

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
        <textarea
          placeholder="댓글을 입력해주세요. (최대 300자)"
          value={commentTxt}
          onChange={(e) => {
            const target = e.currentTarget
            const value = target.value
            if (value.length >= 300) {
              context.action.toast({msg: '최대 300자 이내 입력 가능합니다.'})
            } else {
              setCommentTxt(value)
            }
            if (value.length === 0) {
              setModifyState(true)
            }
          }}></textarea>
        {modifyState === true ? (
          <button
            onClick={() => {
              // globalCtx.action.alert({
              //   msg: '댓글 이벤트가 종료되었습니다.'
              // })
              commentAdd()
            }}>
            등록
          </button>
        ) : (
          <button
            onClick={() => {
              commentUpd(), setModifyState(true)
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
            <img src="https://image.dalbitlive.com/main/ico_live_refresh_new_s.svg" alt="새로고침" />
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
                        <span className="date">{ins_date}</span>
                      </div>
                      <p className="msg" dangerouslySetInnerHTML={{__html: Utility.nl2br(tail_conts)}}></p>
                    </div>
                    {token.isAdmin ? (
                      <>
                        <button
                          className=""
                          onClick={() => {
                            commentDel(tail_no, tail_mem_no)
                          }}>
                          X
                        </button>
                      </>
                    ) : (
                      <>
                        {parseInt(token.memNo) === tail_mem_no && modifyState === true && (
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
                                    setMoreState(-1), setModifyState(false)
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
                        )}
                      </>
                    )}
                  </div>
                )
              })}
              <NoResult />
            </>
          ) : (
            <NoResult text="아직 작성된 댓글이 없습니다." brText=" 이벤트에 참여하는 첫 번째 회원님이 되어주세요!" />
          )}
        </div>
      </div>
    </div>
  )
}
