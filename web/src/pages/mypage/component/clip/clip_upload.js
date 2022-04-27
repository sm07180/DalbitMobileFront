import React, {useCallback, useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import qs from 'query-string'

import Api from 'context/api'
import {Hybrid} from 'context/hybrid'
import Utility from 'components/lib/utility'
import {clipJoin} from 'pages/common/clipPlayer/clip_func'
import {OS_TYPE} from 'context/config.js'
import UploadSubTab from './component/sub_tab'
import UploadClip from './component/upload_list_item'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage, setGlobalCtxUpdatePopup} from "redux/actions/globalCtx";

//flag
let currentPage = 1
let timer
let moreState = false

const noClipMsgList = ['등록된 클립이 없습니다.', '청취한 회원이 없습니다', '좋아요 회원이 없습니다 ', '선물한 회원이 없습니다 ']

function ClipUpload() {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  let history = useHistory()
  const customHeader = JSON.parse(Api.customHeader)

  const {webview} = qs.parse(location.search)

  const [dataList, setDataList] = useState({
    isLoading: false,
    list: [],
    totalData: 0
  })
  const [nextList, setNextList] = useState([])
  const [slctedBtnIdx, setSlctedBtnIdx] = useState(null)
  // 토탈페이지

  const [uploadListLoding, setUpLoadLoading] = useState('')

  const uploadModal = () => {
    Hybrid('ClipUploadJoin')
  }

  const fetchUploadDataList = async (fetchNext = false, tabType = globalState.clipTab) => {
    /**
     * refer to - API 정의서 클립 시트 - 내 클립 상세 현황 조회
     * context.clipTab - 0 | 1 | 2 | 3
     * 마이클립: 1 | 청취: 2 | 좋아요 : 3 | 선물: 4
     */
    if (!fetchNext) currentPage = 1

    tabType += 1
    const {result, data, message} = await Api.getMyClipDetail({
      myClipType: tabType,
      page: fetchNext ? ++currentPage : currentPage,
      records: 10
    })

    if (result === 'success' && data.hasOwnProperty('list')) {
      setUpLoadLoading(true)
      if (data.list.length === 0) {
        if (!fetchNext) {
          setDataList({isLoading: false, list: [], totalData: 0})
        }
        moreState = false
      } else {
        setUpLoadLoading(true)
        if (fetchNext) {
          moreState = true
          setNextList(data.list)
        } else {
          setDataList({isLoading: false, list: data.list, totalData: data.paging.total})
          fetchUploadDataList(true)
        }
      }
    } else {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: message
      }))
    }
  }

  const getPageFormIdx = useCallback((idx) => {
    if (idx < 100) return 1
    idx = String(idx)
    return Number(idx.substring(0, idx.length - 2)) + 1
  }, [])

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

  const showMoreList = () => {
    setDataList({...dataList, list: dataList.list.concat(nextList)})
    fetchUploadDataList(true)
  }

  const scrollEvtHdr = () => {
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

  useEffect(() => {
    setDataList({isLoading: true, list: [], totalData: 0})
    fetchUploadDataList()
  }, [globalState.clipTab])

  useEffect(() => {
    window.addEventListener('scroll', scrollEvtHdr)
    return () => {
      window.removeEventListener('scroll', scrollEvtHdr)
    }
  }, [nextList])

  const eventGoClipHandler = (type) => {
    if (customHeader['os'] === OS_TYPE['Desktop']) {
      dispatch(setGlobalCtxUpdatePopup({popup: ['APPDOWN', 'appDownAlrt', 3]}))
    } else {
      let alrtText = '클립 업로드는 청취중인 방송을 \n종료 한 후 가능합니다.'
      if (type === 'goClip') alrtText = '클립 청취는 청취중인 방송을 \n 종료 한 후 가능합니다.'
      if (webview === 'new' && Utility.getCookie('native-player-info') !== undefined) {
        dispatch(setGlobalCtxMessage({type: "alert", msg: alrtText}))
        return
      }
      if (type === 'goClip') {
        history.push(`/clip`)
      } else {
        uploadModal()
      }
    }
  }

  const createContents = () => {
    if (dataList.list.length === 0 && !dataList.isLoading) {
      return (
        <div className="noResult">
          <span className="noResult__guideTxt">
            {noClipMsgList[globalState.clipTab]}
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
    } else if (dataList.isLoading) {
      return (
        <div className="loadingWrap">
          <div className="loading">
            <span></span>
          </div>
        </div>
      )
    } else {
      return (
        <UploadClip
          dataList={dataList}
          setDataList={setDataList}
          slctedBtnIdx={slctedBtnIdx}
          setSlctedBtnIdx={setSlctedBtnIdx}
          fetchDataPlay={fetchDataPlay}
        />
      )
    }
  }

  return (
    <>
      <UploadSubTab
        totalData={dataList.totalData}
        contextClipTab={globalState.clipTab}
      />

      <div
        className="uploadWrap"
        style={{
          padding: globalState.profile.memNo !== globalState.urlStr && '0',
          minHeight: globalState.profile.memNo !== globalState.urlStr && '300px',
          backgroundColor: globalState.profile.memNo !== globalState.urlStr && '#eeeeee'
        }}>
        {uploadListLoding && createContents()}
      </div>
    </>
  )
}

export default ClipUpload
