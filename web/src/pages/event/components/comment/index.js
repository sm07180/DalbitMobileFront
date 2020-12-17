import React, {useContext} from 'react'

//context
import {useHistory} from 'react-router-dom'
import {Context} from 'context'

// static
import deleteIcon from '../../static/close.svg'

import './comment.scss'

export default function eventComment({commentList, commentAdd, commentTxt, setCommentTxt, commentDel}) {
  const globalCtx = useContext(Context)
  const {token} = globalCtx
  const history = useHistory()

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
        msg: '로그인 후 참여해주세요.',

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
          {commentList.map((value, idx) => {
            const {replyIdx, profImg, nickNm, writerNo, writeDt, content} = value

            return (
              <div className="listItem" key={`comment-${idx}`}>
                <div
                  className="thumb"
                  onClick={() => {
                    history.push(`/mypage/${writerNo}`)
                  }}>
                  <img src={profImg.thumb120x120} alt={nickNm} />
                </div>
                <div className="textBox">
                  <div className="nick">
                    {nickNm} <span className="date">{timeFormat(writeDt)}</span>
                  </div>
                  <p className="msg">{content}</p>
                </div>

                {token.memNo === writerNo && (
                  <button
                    className="btnDelete"
                    onClick={() => {
                      commentDel(replyIdx)
                    }}>
                    <img src={deleteIcon} alt="삭제하기" />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
