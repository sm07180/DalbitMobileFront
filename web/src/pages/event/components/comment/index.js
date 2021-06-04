import React, {useState, useContext} from 'react'
import {useHistory} from 'react-router-dom'

//context
import {Context} from 'context'
import {PHOTO_SERVER} from 'context/config'
import Utility from 'components/lib/utility'
// static
import deleteIcon from '../../static/close.svg'
import './comment.scss'

export default function eventComment({
  commentList,
  commentAdd,
  commentUpd,
  commentTxt,
  setCommentTxt,
  setCommentNo,
  commentDel,
  fetchCommentData
}) {
  const globalCtx = useContext(Context)
  const {token} = globalCtx
  const history = useHistory()
  const context = useContext(Context)

  const [moreState, setMoreState] = useState(-1)
  const [modifyState, setModifyState] = useState(true)
  const [refreshState, setRefreshState] = useState(false)

  const timeFormat = (strFormatFromServer) => {
    let date = strFormatFromServer.slice(0, 8)
    date = [date.slice(4, 6), date.slice(6)].join('.')
    let time = strFormatFromServer.slice(8)
    time = [time.slice(0, 2), time.slice(2, 4)].join(':')
    return `${date} ${time}`
  }

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
    fetchCommentData()
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
            if (value.length >= 300) return
            setCommentTxt(value)
            if (value.length == 0) {
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
          댓글 <span>{`${commentList.length}`}</span>개
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
                      <img src={`https://photo.dalbitlive.com${image_profile}?120x120`} alt={mem_nick} />
                    </div>
                    <div className="textBox">
                      <div className="nick">
                        {mem_nick} <span className="date">{ins_date}</span>
                      </div>
                      <p className="msg" dangerouslySetInnerHTML={{__html: Utility.nl2br(tail_conts)}}></p>
                    </div>

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
                              수정하기
                            </button>
                            <button
                              onClick={() => {
                                commentDel(tail_no, tail_mem_no), setMoreState(-1)
                              }}>
                              삭제하기
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )
              })}
            </>
          ) : (
            <span>아직 작성된 댓글이 없습니다. 이벤트에 참여하는 첫 번째 회원님이 되어주세요</span>
          )}
        </div>
      </div>
    </div>
  )
}
