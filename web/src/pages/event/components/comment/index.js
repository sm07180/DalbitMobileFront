import React, {useContext} from 'react'

//context
import {useHistory} from 'react-router-dom'
import {Context} from 'context'
import {PHOTO_SERVER} from 'context/config'
// static
import deleteIcon from '../../static/close.svg'

import './comment.scss'

export default function eventComment({commentList, commentAdd, commentTxt, setCommentTxt, commentDel}) {
  const globalCtx = useContext(Context)
  const {token} = globalCtx
  const history = useHistory()
  console.log(token);

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
              state: 'event/award/comment'
            }
          })
        }
      })
    } else {
    }
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
          }}></textarea>

        <button
          onClick={() => {
            // globalCtx.action.alert({
            //   msg: '댓글 이벤트가 종료되었습니다.'
            // })
            commentAdd()
          }}>
          등록
        </button>
      </div>
      <div className="commentBox">
        <div className="totalBox">
          댓글 <span>{`${commentList.length}`}</span>개
          {/* <img
            onClick={() => {
              setCommentList([])
              fetchCommentData()
            }}
          /> */}
        </div>

        <div className="listBox">
          {commentList.length > 0 ? (
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
                      <p className="msg">{tail_conts}</p>
                    </div>

                    {parseInt(token.memNo) === tail_mem_no && (
                      <button
                        className="btnDelete"
                        onClick={() => {
                          commentDel(tail_no)
                        }}>
                        <img src={deleteIcon} alt="삭제하기" />
                      </button>
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
