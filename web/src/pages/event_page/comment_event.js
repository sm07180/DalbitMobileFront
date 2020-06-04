import React, {useEffect, useState} from 'react'

// static
import refreshIcon from './static/refresh.svg'

import API from 'context/api'

export default function CommentEvent() {
  const [commentTxt, setCommentTxt] = useState('')
  const [commentList, setCommentList] = useState([])

  useEffect(() => {
    return () => {
      console.log('remove comment event component')
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
            setCommentTxt(value)
          }}></textarea>

        <button
          onClick={() => {
            // submit text on server (api sync)
            async function AddComment(memNo, eventIdx, depth, content) {
              // const {result, data} = await API.postComment({})
            }
            // AddComment()
          }}>
          등록
        </button>
      </div>
      <div className="comment-list-wrap">
        <div className="title-wrap">
          <div className="title">
            댓글 <span>{`${commentList.length}`}</span>개
          </div>
          <img src={refreshIcon} onClick={() => console.log('refresh')} />
        </div>
        <div className="comments">
          {commentList.map((value, idx) => {
            return (
              <div className="each" key={`comment-${idx}`}>
                <div className="profile-img"></div>
                <div className="content">
                  <div className="name-date-wrap"></div>
                  <div className="text"></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
