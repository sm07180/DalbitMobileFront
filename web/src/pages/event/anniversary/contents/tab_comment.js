import React, {useState, useContext, useEffect, useLayoutEffect, useCallback} from 'react'
import {useHistory} from 'react-router-dom'
import API from 'context/api'
import {OS_TYPE, IMG_SERVER} from 'context/config'
import Utility from 'components/lib/utility'

import Comment from '../../components/comment'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage, setGlobalCtxUpdatePopup} from "redux/actions/globalCtx";

export default function awardEventComment(props) {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const {token} = globalState
  const history = useHistory()

  //댓글 state
  const [commentList, setCommentList] = useState([])
  const [commentTxt, setCommentTxt] = useState('')
  const [commentNo, setCommentNo] = useState('')
  const [totalCommentCnt, setTotalCommentCnt] = useState(0  )
  const [currentPage, setCurrentPage] = useState(0)
  const [loginMedia, setLoginMedia] = useState('')

  const customHeader = JSON.parse(API.customHeader)
  // 댓글조회
  let totalPage = 1
  let pagePerCnt = 10
  const fetchCommentData = useCallback(async () => {
    const {result, data, message} = await API.postEventOneYearComment({
      pageNo: currentPage,
      pagePerCnt: pagePerCnt
    })
    if (result === 'success') {
      setTotalCommentCnt(data[0])
      totalPage = Math.ceil(data[0] / pagePerCnt)
      if (currentPage > 1) {
        setCommentList(commentList.concat(data[1]))
      } else {
        setCommentList(data[1])
      }
    } else {
      console.log(message)
    }
  }, [currentPage])

  // 댓글작성
  const commentAdd = (setWriteState) => {
    async function AddComment(content) {
      const {result, message} = await API.postEventOneYearCommentInsert({tailConts: content, tailLoginMedia: loginMedia})
      if (result === 'success') {
        setCurrentPage(0)
        setWriteState(false)
        dispatch(setGlobalCtxMessage({type:"taost",msg: message}))
      } else {
        dispatch(setGlobalCtxMessage({type:"taost",msg: message}))
      }
    }
    if (token.isLogin) {
      if (commentTxt === '') {
        dispatch(setGlobalCtxMessage({type:"taost",
          msg: '내용을 입력해주세요.'
        }))
      } else {
        setCommentTxt('')
        AddComment(commentTxt)
      }
    } else {
      dispatch(setGlobalCtxMessage({type:"alert",
        msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
        callback: () => {
          history.push(`/login?redirect=/event/anniversary?tab=comment`)
        }
      }))
    }
  }
  // 댓글삭제
  const commentDel = (tail_no, tail_mem_no) => {
    async function DeleteComment(tail_no, tail_mem_no) {
      const {result, message} = await API.postEventOneYearCommentDelete({tailNo: tail_no, tailMemNo: tail_mem_no})
      if (result === 'success') {
        setCurrentPage(0)
        dispatch(setGlobalCtxMessage({type:"taost",msg: message}))
      } else {
        dispatch(setGlobalCtxMessage({type:"taost",
          msg: message
        }))
      }
    }
    if (globalState.adminChecker) {
      dispatch(setGlobalCtxMessage({type:"confirm",
        msg: '정말 삭제하시겠습니까?',
        callback: () => {
          DeleteComment(tail_no, tail_mem_no)
        },
        buttonText: {
          left: '취소',
          right: '삭제'
        }
      }))
    } else {
      dispatch(setGlobalCtxMessage({type:"confirm",
        msg: '등록된 댓글을 삭제하시겠습니까?',
        callback: () => {
          DeleteComment(tail_no, tail_mem_no)
        }
      }))
    }
  }
  // 댓글수정
  const commentUpd = (setWriteState, setModifyState) => {
    async function UpdateComment() {
      const {result, message} = await API.postEventOneYearCommentUpdate({
        tailNo: commentNo,
        tailConts: commentTxt,
        tailLoginMedia: loginMedia
      })
      if (result === 'success') {
        dispatch(setGlobalCtxMessage({type:"taost",msg: message}))
        setCurrentPage(0)
      } else {
        dispatch(setGlobalCtxMessage({type:"taost",
          msg: message
        }))
      }
      setWriteState(false)
      setModifyState(false)
    }
    if (commentTxt === '') {
      dispatch(setGlobalCtxMessage({type:"taost",
        msg: '내용을 입력해주세요.'
      }))
    } else {
      dispatch(setGlobalCtxMessage({type:"confirm",
        msg: '등록된 댓글을 수정하시겠습니까?',
        callback: () => {
          UpdateComment(commentNo, commentTxt)
          setCommentTxt('')
        }
      }))
    }
  }
  const scrollEvtHdr = () => {
    if (totalPage > currentPage && Utility.isHitBottom()) {
      setCurrentPage(currentPage + 1)
    }
  }
  useLayoutEffect(() => {
    if (currentPage === 0) setCurrentPage(1)
    window.addEventListener('scroll', scrollEvtHdr)
    return () => {
      window.removeEventListener('scroll', scrollEvtHdr)
    }
  }, [currentPage])

  useEffect(() => {
    if (currentPage > 0) fetchCommentData()
  }, [currentPage])

  useEffect(() => {
    // login medea setting
    if (customHeader['os'] === OS_TYPE['Android'] || customHeader['os'] === OS_TYPE['IOS']) {
      setLoginMedia('s')
    } else if (customHeader['os'] === 3) {
      setLoginMedia('w')
    }
  }, [])

  return (
    <>
      <div className="tabContentWrap">
        <div className="tabContentWrap__imgWrap">
          <img src={`${IMG_SERVER}/event/anniversary/comment.png`} className="contentImg" />
        </div>
      </div>
      <Comment
        commentList={commentList}
        totalCommentCnt={totalCommentCnt}
        commentAdd={commentAdd}
        commentUpd={commentUpd}
        commentTxt={commentTxt}
        setCommentTxt={setCommentTxt}
        setCommentNo={setCommentNo}
        commentDel={commentDel}
        fetchCommentData={fetchCommentData}
        setCurrentPage={setCurrentPage}
      />
    </>
  )
}
