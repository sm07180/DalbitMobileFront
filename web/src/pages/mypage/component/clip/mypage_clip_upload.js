import React, {useCallback, useEffect, useState} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import Api from 'context/api'
import {Hybrid} from 'context/hybrid'
import Utility from 'components/lib/utility'
import {clipJoin} from 'pages/common/clipPlayer/clip_func'
import qs from 'query-string'
import {OS_TYPE} from 'context/config.js'
//svg
import LikeIcon from '../clip_like.svg'
import MessageIcon from './message_w.svg'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage, setGlobalCtxUpdatePopup} from "redux/actions/globalCtx";
//flag
let currentPage = 1
let timer
let moreState = false
export default function MyPageClipUpload() {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  let history = useHistory()
  let {memNo, category} = useParams()
  const customHeader = JSON.parse(Api.customHeader)

  const {webview} = qs.parse(location.search)

  const [uploadList, setUploadList] = useState([])
  const [nextList, setNextList] = useState([])
  // 토탈페이지

  const [uploadListLoding, setUpLoadLoading] = useState('')

  const uploadModal = () => {
    Hybrid('ClipUploadJoin')
  }
  const fetchDataList = async (next) => {
    if (!next) currentPage = 1
    currentPage = next ? ++currentPage : currentPage
    const res = await Api.getUploadList({
      memNo: globalState.urlStr,
      page: currentPage,
      records: 10
    })
    if (res.result === 'success' && res.data.hasOwnProperty('list')) {
      setUpLoadLoading(true)
      if (res.data.list.length === 0) {
        if (!next) {
          setUploadList([])
        }
        moreState = false
      } else {
        setUpLoadLoading(true)
        if (next) {
          moreState = true
          setNextList(res.data.list)
        } else {
          setUploadList(res.data.list)
          fetchDataList('next')
        }
      }
    } else {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: res.message
      }))
    }
  }

  // 플레이가공
  const fetchDataPlay = async (clipNum, idx) => {
    const {result, data, message, code} = await Api.postClipPlay({
      clipNo: clipNum
    })
    if (result === 'success') {
      const nowPage = getPageFormIdx(idx)
      const playListInfoData = {
        memNo: globalState.urlStr,
        page: nowPage,
        records: 100
      }
      localStorage.setItem('clipPlayListInfo', JSON.stringify(playListInfoData))
      clipJoin(data, dispatch, globalState, webview)
    } else {
      if (code === '-99') {
        dispatch(setGlobalCtxMessage({
          type: "alert",
          msg: message,
          callback: () => {
            history.push('/login')
          }
        }))
      } else {
        dispatch(setGlobalCtxMessage({
          type: "alert",
          msg: message
        }))
      }
    }
  }

  const getPageFormIdx = useCallback((idx) => {
    if (idx < 100) return 1
    idx = String(idx)
    return Number(idx.substring(0, idx.length - 2)) + 1
  }, [])

  const showMoreList = () => {
    setUploadList(uploadList.concat(nextList))
    fetchDataList('next')
  }
  const scrollEvtHdr = (event) => {
    if (timer) window.clearTimeout(timer)
    timer = window.setTimeout(function () {
      //스크롤
      const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight
      const body = document.body
      const html = document.documentElement
      const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
      const windowBottom = windowHeight + window.pageYOffset
      if (moreState && windowBottom >= docHeight - 300) {
        showMoreList()
      } else {
      }
    }, 10)
  }

  const eventGoClipHandler = (type, clipNo, idx) => {
    if (customHeader['os'] === OS_TYPE['Desktop']) {
      if (globalState.token.isLogin === false) {
        dispatch(setGlobalCtxMessage({
          type: "alert",
          msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
          callback: () => {
            history.push('/login')
          }
        }))
      } else {
        dispatch(setGlobalCtxUpdatePopup({popup: ['APPDOWN', 'appDownAlrt', 3]}));
      }
    } else {
      let alrtText = '클립 업로드는 청취중인 방송을 \n종료 한 후 가능합니다.'
      if (type === 'goClip') alrtText = '클립 청취는 청취중인 방송을 \n 종료 한 후 가능합니다.'
      if (type === 'play') alrtText = '선택한 클립 재생은 청취중인 방송을\n 종료 한 후 가능합니다.'
      if (webview === 'new' && Utility.getCookie('native-player-info') !== undefined) {
        return dispatch(setGlobalCtxMessage({type: "alert", msg: alrtText}))
      }
      switch (type) {
        case 'upload':
          uploadModal()
          break
        case 'goClip':
          history.push(`/clip`)
          break
        case 'play':
          fetchDataPlay(clipNo, idx)
          break
      }
    }
  }

  useEffect(() => {
    fetchDataList()
  }, [globalState.urlStr])

  useEffect(() => {
    window.addEventListener('scroll', scrollEvtHdr)
    return () => {
      window.removeEventListener('scroll', scrollEvtHdr)
    }
  }, [nextList])

  const createContents = () => {
    if (uploadList.length === 0) {
      return (
        <div className="noResult">
          <span className="noResult__guideTxt">
            등록된 클립이 없습니다.
            <br/> {globalState.urlStr === globalState.profile.memNo && '클립을 업로드해 보세요.'}
          </span>
          {globalState.urlStr === globalState.profile.memNo ? (
            <button
              className="noResult__uploadBtn"
              onClick={() => {
                eventGoClipHandler('upload')
              }}>
              클립 업로드
            </button>
          ) : (
            <button
              className="noResult__uploadBtn"
              onClick={() => {
                eventGoClipHandler('goClip')
              }}>
              청취 하러가기
            </button>
          )}
        </div>
      )
    } else {
      const windowHalfWidth = (window.innerWidth - 32) / 2
      return (
        <div className="listSimple">
          <ul className="listSimpleBox">
            {uploadList.map((item, idx) => {
              const {bgImg, byeolCnt, clipNo, goodCnt, memNo, nickName, playCnt, subjectType, title, replyCnt} = item
              return (
                <React.Fragment key={`uploadList-${idx}`}>
                  <li
                    className="listSimpleItem"
                    onClick={() => {
                      eventGoClipHandler('play', clipNo, idx)
                    }}
                    style={{
                      backgroundImage: `url('${bgImg[`thumb336x336`]}')`,
                      height: `${windowHalfWidth}px`,
                      cursor: 'pointer'
                    }}>
                    <div className="topWrap">
                      <div className="topWrap__count">
                        <img className="topWrap__count--icon" src={MessageIcon} />
                        <span className="topWrap__count--num">{replyCnt}</span>
                        <img className="topWrap__count--icon" src={LikeIcon} />
                        <span className="topWrap__count--num">
                          {goodCnt > 999 ? Utility.printNumber(goodCnt) : Utility.addComma(goodCnt)}
                        </span>
                      </div>
                    </div>

                    <div className="bottomWrap">
                      <p className="bottomWrap__nick">{nickName}</p>
                      <p className="bottomWrap__title">{title}</p>
                    </div>
                  </li>
                </React.Fragment>
              )
            })}
          </ul>
        </div>
      )
    }
  }
  return (
    <div
      className="uploadWrap"
      style={{
        padding: globalState.profile.memNo !== globalState.urlStr && '0',
        minHeight: globalState.profile.memNo !== globalState.urlStr && '300px',
        backgroundColor: globalState.profile.memNo !== globalState.urlStr && '#eeeeee'
      }}>
      {uploadListLoding && createContents()}
    </div>
  )
}
