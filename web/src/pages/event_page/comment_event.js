import React, {useEffect, useState, useContext} from 'react'

//context
import {Context} from 'context'

// static
import refreshIcon from './static/refresh.svg'
import deleteIcon from './static/close.svg'

import API from 'context/api'

export default function CommentEvent() {
  const [eventIndex, setEventIndex] = useState(1)
  const [commentTxt, setCommentTxt] = useState('')
  const [commentList, setCommentList] = useState([])

  const globalCtx = useContext(Context)
  const {token} = globalCtx

  const timeFormat = strFormatFromServer => {
    let date = strFormatFromServer.slice(0, 8)
    date = [date.slice(0, 4), date.slice(4, 6), date.slice(6)].join('.')
    let time = strFormatFromServer.slice(8)
    time = [time.slice(0, 2), time.slice(2, 4), time.slice(4)].join(':')
    return `${date} ${time}`
  }

  async function fetchCommentData() {
    const {result, data} = await API.getEventComment({eventIdx: eventIndex})
    if (result === 'success') {
      const {list} = data
      setCommentList(list)
    }
  }

  useEffect(() => {
    fetchCommentData()

    return () => {
      // console.log('remove comment event component')
    }
  }, [])

  return (
    <div className="comment-event-wrap">
      <img src="https://image.dalbitlive.com/event/200603/comment_img.png" className="main" />

      <div className="input-wrap">
        <textarea
          placeholder="댓글을 입력해주세요.&#13;&#10;(최대 300자)"
          value={commentTxt}
          onChange={e => {
            const target = e.currentTarget
            const value = target.value
            if (value.length >= 300) return
            setCommentTxt(value)
          }}></textarea>

        <button
          onClick={() => {
            async function AddComment(memNo, eventIdx, depth, content) {
              const {result, data} = await API.postEventComment({memNo, eventIdx, depth, content})
              if (result === 'success') {
                fetchCommentData()
                window.scrollTo(0, document.body.scrollHeight)
              }
            }
            if (token.isLogin) {
              setCommentTxt('')
              AddComment(token.memNo, eventIndex, 1, commentTxt)
            } else {
              alert('로그인 유저만 등록 가능합니다.')
            }
          }}>
          등록
        </button>
      </div>
      <div className="comment-list-wrap">
        <div className="title-wrap">
          <div className="title">
            댓글 <span>{`${commentList.length}`}</span>개
          </div>
          <img
            src={refreshIcon}
            onClick={() => {
              setCommentList([])
              fetchCommentData()
            }}
          />
        </div>
        <div className="comments">
          {commentList.map((value, idx) => {
            const {replyIdx, profImg, memId, writerNo, writeDt, content} = value

            return (
              <div className="each" key={`comment-${idx}`}>
                <div className="profile-img" style={{backgroundImage: `url(${profImg.thumb120x120})`}}></div>
                <div className="content">
                  <div className="name-date-wrap">
                    {memId} <span className="date">{timeFormat(writeDt)}</span>
                  </div>
                  <div className="text">{content}</div>
                </div>

                {token.memNo === writerNo && (
                  <button
                    className="btn-delete"
                    onClick={() => {
                      async function DeleteComment(replyIdx, eventIdx) {
                        const {result, data} = await API.deleteEventComment({replyIdx, eventIdx})
                        if (result === 'success') {
                          fetchCommentData()
                        }
                      }
                      globalCtx.action.confirm({
                        msg: '댓글을 삭제하시겠습니까?',
                        callback: () => {
                          DeleteComment(replyIdx, eventIndex)
                        }
                      })
                    }}>
                    <img src={deleteIcon}></img>
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
