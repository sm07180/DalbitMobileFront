import React, {useState, useContext, useEffect} from 'react'
import API from 'context/api'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'

import Comment from '../../components/comment'

export default function awardEventComment() {
  const globalCtx = useContext(Context)
  const {token} = globalCtx
  const history = useHistory()

  //댓글 state
  const [eventIndex, setEventIndex] = useState(4)
  const [commentList, setCommentList] = useState([])
  const [commentTxt, setCommentTxt] = useState('')

  async function fetchCommentData() {
    const {result, data} = await API.getEventComment({eventIdx: eventIndex})
    if (result === 'success') {
      const {list} = data
      setCommentList(list)
    }
  }

  const commentAdd = () => {
    async function AddComment(memNo, eventIdx, depth, content) {
      const {result, data} = await API.postEventComment({memNo, eventIdx, depth, content})
      if (result === 'success') {
        fetchCommentData()
        // window.scrollTo(0, document.body.scrollHeight)
      }
    }
    if (token.isLogin) {
      if (commentTxt === '') {
        globalCtx.action.alert({
          msg: '내용을 입력해주세요.'
        })
      } else {
        setCommentTxt('')
        AddComment(token.memNo, eventIndex, 1, commentTxt)
      }
    } else {
      globalCtx.action.alert({
        msg: '로그인 후 이용해 주세요.',
        callback: () => {
          history.push(`/login?redirect=/event/award`)
        }
      })
    }
  }

  const commentDel = (replyIdx) => {
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
  }

  useEffect(() => {
    fetchCommentData()
  }, [])

  return (
    <div className="tabCommentWrap">
      <img src="https://image.dalbitlive.com/event/award/201214/comment-img-b.png" className="tabCommentWrap__topImg" />
      <Comment
        commentList={commentList}
        commentAdd={commentAdd}
        commentTxt={commentTxt}
        setCommentTxt={setCommentTxt}
        commentDel={commentDel}
      />
    </div>
  )
}
