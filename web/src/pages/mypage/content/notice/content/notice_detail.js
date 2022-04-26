import React, {useCallback, useEffect, useState} from 'react'

import Api from 'context/api'

import {IMG_SERVER, PHOTO_SERVER} from 'context/config'
import Utility from 'components/lib/utility'

import {useHistory} from 'react-router-dom'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

const records = 9999

let timer

const NoticeDetail = (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const {yourMemNo, detailItem, noticeList, setNoticeList} = props

  const history = useHistory()

  const [zoom, setZoom] = useState(false)

  const [replyPage, setReplyPage] = useState(1)
  const [replyList, setReplyList] = useState(null)
  const [replyToggle, setReplyToggle] = useState(false)
  const [replyMoreIdx, setReplyMoreIdx] = useState(-1)
  const [replyModifyIdx, setReplyModifyIdx] = useState(-1)
  const [replyWriteToggle, setReplyWriteToggle] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [replyPaging, setReplyPaging] = useState(null)
  const [replyModifyText, setReplyModifyText] = useState('')
  const deleteNotice = useCallback(
    (noticeIdx) => {
      async function deleteNoiceContent() {
        const {result, data, message} = await Api.mypage_notice_delete({
          data: {
            memNo: yourMemNo,
            noticeIdx: noticeIdx
          }
        })
        if (result === 'success') {
          dispatch(setGlobalCtxMessage({
            visible: true,
            type: 'confirm',
            msg: `게시글을 삭제 하시겠습니까?`,
            callback: () => {
              setNoticeList(
                noticeList.filter((v) => {
                  if (noticeIdx !== v.noticeIdx) {
                    return v
                  }
                })
              )
              setTimeout(() => {
                history.goBack()
              }, 100)
            }
          }))
        } else {
          dispatch(setGlobalCtxMessage({
            visible: true,
            type: 'alert',
            msg: message
          }))
        }
      }
      deleteNoiceContent()
    },
    [yourMemNo]
  )

  const fetchReply = useCallback(async () => {
    setReplyPage(1)
    setReplyModifyIdx(-1)
    setReplyModifyText('')

    const {result, data} = await Api.getMypageNoticeReply({
      memNo: yourMemNo,
      noticeIdx: detailItem.noticeIdx,
      page: 1,
      records: records
    })

    if (result === 'success') {
      setReplyList(data.list)
      if (data.paging) {
        setReplyPaging(data.paging)
      }
    }
  }, [yourMemNo, detailItem.noticeIdx])

  const selectReply = useCallback(async () => {
    const res = await Api.getMypageNoticeReply({
      memNo: yourMemNo,
      noticeIdx: detailItem.noticeIdx,
      page: replyPage,
      records: records
    })

    if (res.result === 'success') {
      if (res.data.paging) {
        setReplyPaging(res.data.paging)
      }
      if (replyList !== null && replyList.length > 0) {
        setReplyList(replyList.concat(res.data.list))
      } else {
        setReplyList(res.data.list)
      }
    } else {
      if (res.code === '0') {
        setReplyList(res.data.list)
      } else {
        dispatch(setGlobalCtxMessage({
          type: "toast",
          msg: '댓글 조회에 실패하였습니다'
        }))
      }
    }
  }, [yourMemNo, replyPage, detailItem.noticeIdx, replyList])

  const insertReply = useCallback(async () => {
    const res = await Api.insertMypageNoticeReply({
      memNo: yourMemNo,
      noticeIdx: detailItem.noticeIdx,
      contents: replyText
    })
    if (res.result === 'success') {
      dispatch(setGlobalCtxMessage({
        type: "toast",
        msg: res.message
      }))
      fetchReply()

      setNoticeList(
        noticeList.map((v) => {
          if (v.noticeIdx === detailItem.noticeIdx) {
            v.replyCnt++
          }
          return v
        })
      )

      setReplyToggle(true)
    } else {
      dispatch(setGlobalCtxMessage({
        type: "toast",
        msg: res.message
      }))
    }
    resetState()
  }, [replyText, yourMemNo, detailItem.noticeIdx, noticeList])

  const deleteReply = useCallback(
    async (replyIdx) => {
      const res = await Api.deleteMypageNoticeReply({
        memNo: yourMemNo,
        replyIdx: replyIdx
      })

      if (res.result === 'success') {
        dispatch(setGlobalCtxMessage({
          type: "toast",
          msg: res.message
        }))

        fetchReply()

        setNoticeList(
          noticeList.map((v) => {
            if (v.noticeIdx === detailItem.noticeIdx) {
              v.replyCnt--
            }
            return v
          })
        )
      } else {
        dispatch(setGlobalCtxMessage({
          type: "toast",
          msg: res.message
        }))
      }
    },
    [yourMemNo, noticeList]
  )

  const modifyReply = useCallback(async () => {
    const res = await Api.modifyMypageNoticeReply({
      memNo: yourMemNo,
      replyIdx: replyModifyIdx,
      contents: replyModifyText
    })

    if (res.result === 'success') {
      dispatch(setGlobalCtxMessage({
        type: "toast",
        msg: res.message
      }))
      fetchReply()
    } else {
      dispatch(setGlobalCtxMessage({
        type: "toast",
        msg: res.message
      }))
    }
  }, [replyModifyText, replyModifyIdx, yourMemNo])

  const Link = useCallback((linkMemNo) => {
    history.push(`/mypage/${linkMemNo}`)
  }, [])

  const resetState = useCallback(() => {
    setReplyWriteToggle(false)
    setReplyText('')
  }, [])

  useEffect(() => {
    if (replyPage !== 1) {
      selectReply()
    }
  }, [replyPage])

  // useEffect(() => {
  //   let didFetch = false
  //   const scrollEvHdr = () => {
  //     if (timer) window.clearTimeout(timer)
  //     if (replyToggle === true) {
  //       timer = window.setTimeout(() => {
  //         const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight
  //         const body = document.body
  //         const html = document.documentElement
  //         const docHeight = Math.max(
  //           body.scrollHeight,
  //           body.offsetHeight,
  //           html.clientHeight,
  //           html.scrollHeight,
  //           html.offsetHeight
  //         )
  //         const windowBottom = windowHeight + window.pageYOffset
  //         const diff = 466
  //         if (!didFetch) {
  //           if (docHeight - diff < windowBottom) {
  //             if (replyPaging !== null) {
  //               if (replyPaging.totalPage > replyPage) {
  //                 setReplyPage(replyPage + 1)
  //               }
  //             }
  //           }
  //         }
  //       }, 100)
  //     }
  //   }

  //   window.addEventListener('scroll', scrollEvHdr)

  //   return () => {
  //     window.removeEventListener('scroll', scrollEvHdr)
  //     didFetch = true
  //   }
  // }, [replyPage, replyPaging, replyToggle])

  useEffect(() => {
    fetchReply()
  }, [])

  return (
    <>
      {detailItem !== null && (
        <div
          className="noticeDetail"
          onClick={() => {
            setReplyMoreIdx(-1)
          }}>
          <strong className="noticeDetail__title">
            {detailItem.title}
            <p>{Utility.timeFormat(detailItem.writeDt)}</p>
          </strong>
          <span className="noticeDetail__profile">
            <img src={detailItem.profImg['thumb292x292']} />
            {detailItem.nickNm}
          </span>
          <div className="noticeDetail__content">
            <pre>{detailItem.contents}</pre>
            {detailItem.imagePath ? (
              <img
                src={`${PHOTO_SERVER}${detailItem.imagePath}`}
                className="noticeDetail__img"
                onClick={() =>
                  setZoom(`
                      ${PHOTO_SERVER}${detailItem.imagePath}
                      `)
                }
              />
            ) : (
              ''
            )}
            {zoom && (
              <div
                className="zoom"
                onClick={() => {
                  setZoom(false)
                }}>
                <div className="zoomWrap">
                  <img src="https://image.dalbitlive.com/svg/close_w_l.svg" className="closeButton" />
                  <img src={`${typeof zoom === 'string' && zoom}`} className="zoomImg" />
                </div>
              </div>
            )}
          </div>
          <div className="noticeDetail__reply">
            {/* 답글 영역 */}

            <div className="count_box">
              <p className="replyToggle view_number">
                조회수 <span className="count">{detailItem.readCnt}</span>
              </p>

              <button
                className={`replyToggle ${replyToggle ? 'on' : ''}`}
                onClick={() => {
                  setReplyToggle(!replyToggle)
                }}>
                {replyPaging === null ? '답글쓰기' : '답글'}
                <span className="count">{replyPaging === null ? '' : replyPaging.total}</span>
              </button>
            </div>

            {replyToggle === true && replyList !== null && (
              <ul className="replyBox">
                {replyList.map((v, i) => {
                  return (
                    <li key={i} className="replyItem">
                      {replyModifyIdx === v.replyIdx ? (
                        <div className="writeWrap">
                          <div className={`writeBox open`}>
                            <div className="writeHeader">
                              <img
                                src={v.profileImg.thumb62x62}
                                className="writeHeader__thumb"
                                alt="프로필 이미지"
                                onClick={() => Link(v.writerMemNo)}
                              />
                              <p className="writeHeader__nick">{v.nickName}</p>
                            </div>
                            <div className="writeContent">
                              <textarea
                                placeholder="내용을 입력해주세요"
                                value={replyModifyText}
                                onChange={(e) => {
                                  setReplyModifyText(e.target.value)
                                }}></textarea>
                            </div>
                          </div>

                          <div className="writeBottom">
                            <div className="countBox">
                              <div className="countBox__count" style={{marginLeft: 'auto'}}>
                                <span>{replyModifyText.length}</span> / 100
                              </div>
                            </div>
                            <button
                              className="btnAdd"
                              onClick={() => {
                                modifyReply()
                              }}>
                              수정
                            </button>
                          </div>
                          <button className="btnToggle" onClick={() => setReplyModifyIdx(-1)}>
                            접기 <img src="https://image.dalbitlive.com/svg/ico_check_wrap.svg" alt="접기" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="headerBox">
                            <img src={v.profileImg.thumb62x62} className="headerBox__thumb" onClick={() => Link(v.writerMemNo)} />
                            <div className="infoBox">
                              <p className="infoBox__name">{v.nickName}</p>
                              <span className="infoBox__date">{Utility.timeFormat(v.writeDt)}</span>
                            </div>
                            {(v.writerMemNo === globalState.token.memNo || yourMemNo === globalState.token.memNo) && (
                              <>
                                <button
                                  className="btnMore"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    if (v.replyIdx === replyMoreIdx) {
                                      setReplyMoreIdx(-1)
                                    } else {
                                      setReplyMoreIdx(v.replyIdx)
                                    }
                                  }}>
                                  <img src={`${IMG_SERVER}/mypage/ico_morelist_g.svg`} alt="필터" />
                                </button>

                                <div className={`moreList ${replyMoreIdx === v.replyIdx && 'active'}`}>
                                  {v.writerMemNo === globalState.token.memNo && (
                                    <button
                                      onClick={() => {
                                        setReplyModifyText(v.contents)
                                        setReplyModifyIdx(v.replyIdx)
                                      }}>
                                      수정하기
                                    </button>
                                  )}
                                  <button
                                    onClick={() => {
                                      deleteReply(v.replyIdx)
                                    }}>
                                    삭제하기
                                  </button>
                                </div>
                              </>
                            )}
                          </div>

                          <div className="contentBox">
                            <pre>{v.contents}</pre>
                          </div>
                        </>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          <div className="writeWrap">
            <div
              className={`writeBox ${replyWriteToggle === true && 'open'}`}
              onClick={() => {
                setReplyWriteToggle(true)
              }}>
              <div className="writeHeader">
                <img src={globalState.profile.profImg.thumb62x62} className="writeHeader__thumb" alt="프로필 이미지"/>
                {replyWriteToggle === false ? (
                  <p>
                    답글쓰기 <span className="gray">최대 100자</span>
                  </p>
                ) : (
                  <p className="writeHeader__nick">{globalState.profile.nickNm}</p>
                )}
              </div>
              {replyWriteToggle === true && (
                <div className="writeContent">
                  <textarea
                    placeholder="내용을 입력해주세요"
                    value={replyText}
                    onChange={(e) => {
                      setReplyText(e.target.value)
                    }}></textarea>
                </div>
              )}
            </div>
            {replyWriteToggle === true && (
              <div className="writeBottom">
                <div className="countBox">
                  <div className="countBox__count"
                       style={{marginLeft: globalState.token.memNo === yourMemNo ? 'auto' : ''}}>
                    <span>{replyText.length}</span> / 100
                  </div>
                </div>
                <button className="btnAdd" onClick={insertReply}>
                  등록
                </button>
              </div>
            )}

            {/* {replyWriteToggle === true && (
              <button className="btnToggle" onClick={() => setReplyWriteToggle(false)}>
                접기 <img src="https://image.dalbitlive.com/svg/ico_check_wrap.svg" alt="접기" />
              </button>
            )} */}
          </div>
          {yourMemNo === globalState.token.memNo && (
            <div className="noticeDetail__button">
              <button
                onClick={() => {
                  history.push(`/mypage/${yourMemNo}/notice/isModify?idx=${detailItem.noticeIdx}`)
                }}>
                수정
              </button>
              <button onClick={() => deleteNotice(detailItem.noticeIdx)}>삭제</button>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default NoticeDetail
