import React, {useState, useContext, useEffect} from 'react'
import API from 'context/api'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'
import {isHybrid} from 'context/hybrid'
import {OS_TYPE} from 'context/config.js'
import Api from 'context/api'

import Comment from '../../components/comment'

export default function awardEventComment() {
  const globalCtx = useContext(Context)
  const {token} = globalCtx
  const history = useHistory()

  //댓글 state
  const [eventIndex, setEventIndex] = useState(4)
  const [commentList, setCommentList] = useState([])
  const [commentTxt, setCommentTxt] = useState('')
  const [loginMedia, setLoginMedia] = useState('')

  const customHeader = JSON.parse(Api.customHeader)
  async function fetchCommentData() {
    const {result, data, message} = await API.postEventOneYearComment({pageNo:1,pagePerCnt:10})
    if (result === 'success') {
      console.log(data[1]);
      setCommentList(data[1])
    }else {
      console.log(message);
    }
  }

  const commentAdd = () => {
    async function AddComment(content) {
      const {result, data} = await API.postEventOneYearCommentInsert({content,loginMedia})
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
        msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
        callback: () => {
          history.push(`/login?redirect=/event/anniversary`)
        }
      })
    }
  }

  const commentDel = (replyIdx) => {
    async function DeleteComment(replyIdx, eventIdx) {
      const {result, data} = await API.postEventOneYearCommentDelete({replyIdx, eventIdx})
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
    // login medea setting
    if (customHeader['os'] === OS_TYPE['Android'] || customHeader['os'] === OS_TYPE['IOS']) {
      setLoginMedia('s')
    }else if(customHeader['os'] === 3) {
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
          commentTxt={commentTxt}
          setCommentTxt={setCommentTxt}
          commentDel={commentDel}
        />
    </>
  )
}
