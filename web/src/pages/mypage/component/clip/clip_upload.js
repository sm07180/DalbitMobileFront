import React, {useContext, useEffect, useState, useCallback} from 'react'
import {useHistory} from 'react-router-dom'
import qs from 'query-string'
import _ from 'lodash'

import Api from 'context/api'
import {Context} from 'context'
import {Hybrid} from 'context/hybrid'
import Utility from 'components/lib/utility'
import {clipJoin} from 'pages/common/clipPlayer/clip_func'
import {OS_TYPE} from 'context/config.js'
import UploadSubTab from './component/sub_tab'
import UploadClip from './component/upload_list_item'

//flag
let currentPage = 1
let timer
let moreState = false

const noClipMsgList = ['등록된 클립이 없습니다.', '청취한 회원이 없습니다', '좋아요 회원이 없습니다 ', '선물한 회원이 없습니다 ']

function ClipUpload() {
  let history = useHistory()
  const customHeader = JSON.parse(Api.customHeader)

  const context = useContext(Context)
  const {webview} = qs.parse(location.search)

  const [dataList, setDataList] = useState({
    isLoading: false,
    list: []
  })
  const [nextList, setNextList] = useState([])
  const [slctedBtnIdx, setSlctedBtnIdx] = useState(null)
  // 토탈페이지

  const [uploadListLoding, setUpLoadLoading] = useState('')

  const uploadModal = () => {
    Hybrid('ClipUploadJoin')
  }

  const fetchUploadDataList = async (fetchNext = false, tabType = context.clipTab) => {
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
          setDataList({isLoading: false, list: []})
        }
        moreState = false
      } else {
        setUpLoadLoading(true)
        if (fetchNext) {
          moreState = true
          setNextList(data.list)
        } else {
          setDataList({isLoading: false, list: data.list})
          fetchUploadDataList(true)
        }
      }
    } else {
      context.action.alert({
        msg: message
      })
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
        memNo: context.urlStr,
        page: nowPage,
        records: 100
      }
      localStorage.setItem('clipPlayListInfo', JSON.stringify(playListInfoData))
      clipJoin(data, context, webview)
    } else {
      if (code === '-99') {
        context.action.alert({
          msg: message,
          callback: () => {
            history.push('/login')
          }
        })
      } else {
        context.action.alert({
          msg: message
        })
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
    setDataList({isLoading: true, list: []})
    fetchUploadDataList()
  }, [context.clipTab])

  useEffect(() => {
    window.addEventListener('scroll', scrollEvtHdr)
    return () => {
      window.removeEventListener('scroll', scrollEvtHdr)
    }
  }, [nextList])

  const eventGoClipHandler = (type) => {
    if (customHeader['os'] === OS_TYPE['Desktop']) {
      context.action.updatePopup('APPDOWN', 'appDownAlrt', 3)
    } else {
      let alrtText = '클립 업로드는 청취중인 방송을 \n종료 한 후 가능합니다.'
      if (type === 'goClip') alrtText = '클립 청취는 청취중인 방송을 \n 종료 한 후 가능합니다.'
      if (webview === 'new' && Utility.getCookie('native-player-info') !== undefined) {
        context.action.alert({msg: alrtText})
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
            {noClipMsgList[context.clipTab]}
            <br /> {context.urlStr === context.profile.memNo && '클립을 업로드해 보세요.'}
          </span>
          {context.urlStr === context.profile.memNo ? (
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
        contextClipTab={context.clipTab}
        contextClipTabAction={context.action.updateClipTab}
        fetchUploadDataList={fetchUploadDataList}
      />

      <div
        className="uploadWrap"
        style={{
          padding: context.profile.memNo !== context.urlStr && '0',
          minHeight: context.profile.memNo !== context.urlStr && '300px',
          backgroundColor: context.profile.memNo !== context.urlStr && '#eeeeee'
        }}>
        {uploadListLoding && createContents()}
      </div>
    </>
  )
}

export default ClipUpload
