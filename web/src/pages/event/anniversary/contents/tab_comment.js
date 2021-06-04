import React, {useState, useContext, useEffect} from 'react'
import API from 'context/api'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'
import {isHybrid} from 'context/hybrid'
import {OS_TYPE} from 'context/config.js'
import Api from 'context/api'

import Comment from '../../components/comment'

export default function awardEventComment(props) {
  const {tabState, setTabState} = props
  const globalCtx = useContext(Context)
  const {token} = globalCtx
  const history = useHistory()

  //댓글 state
  const [eventIndex, setEventIndex] = useState(4)
  const [commentList, setCommentList] = useState([])
  const [commentTxt, setCommentTxt] = useState('')
  const [loginMedia, setLoginMedia] = useState('')

  const customHeader = JSON.parse(Api.customHeader)
  // 댓글조회
  async function fetchCommentData() {
    const {result, data, message} = await API.postEventOneYearComment()
    if (result === 'success') {
      setCommentList(data[1])
    } else {
      console.log(message)
    }
  }
  // 댓글작성
  const commentAdd = () => {
    async function AddComment(content) {
      const {result, data} = await API.postEventOneYearCommentInsert({tailConts: content, tailLoginMedia: loginMedia})
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
        AddComment(commentTxt)
      }
    } else {
      globalCtx.action.alert({
        msg: '111해당 서비스를 위해<br/>로그인을 해주세요.',
        callback: () => {
          history.push(`/login?redirect=/event/anniversary?tab=comment`)
        }
      })
    }
  }
  // 댓글삭제
  const commentDel = (tail_no, tail_mem_no) => {
    async function DeleteComment(tail_no, tail_mem_no) {
      const {result, data} = await API.postEventOneYearCommentDelete({tailNo: tail_no, tailMemNo: tail_mem_no})
      if (result === 'success') {
        fetchCommentData()
      } else {
        console.log(message)
      }
    }
    globalCtx.action.confirm({
      msg: '댓글을 삭제하시겠습니까?',
      callback: () => {
        DeleteComment(tail_no, tail_mem_no)
      }
    })
  }
  // 댓글수정
  const commentUpd = (tail_no, tail_conts) => {
    async function UpdateComment(tail_no, tail_conts) {
      const {result, data} = await API.postEventOneYearCommentUpdate({
        tailNo: tail_no,
        tailConts: tail_conts,
        tailLoginMedia: loginMedia
      })
      if (result === 'success') {
        let textArea = document.getElementsByClassName('addInputBox')
        console.log(textArea)
      } else {
        console.log(tail_no, tail_conts)
      }
    }
    UpdateComment(tail_no, tail_conts)
  }

  useEffect(() => {
    // login medea setting
    if (customHeader['os'] === OS_TYPE['Android'] || customHeader['os'] === OS_TYPE['IOS']) {
      setLoginMedia('s')
    } else if (customHeader['os'] === 3) {
      setLoginMedia('w')
    }
    // fetch comment list
    fetchCommentData()
  }, [])

  return (
    <>
      <div className="tabContentWrap">
        <div className="tabContentWrap__imgWrap">
          <img src="https://image.dalbitlive.com/event/anniversary/comment.png" className="contentImg" />
        </div>
      </div>
      <Comment
        commentList={commentList}
        commentAdd={commentAdd}
        commentUpd={commentUpd}
        commentTxt={commentTxt}
        setCommentTxt={setCommentTxt}
        commentDel={commentDel}
      />
    </>
  )
}
