import React, {useContext, useState, useEffect, useRef, useCallback} from 'react'
import Api from 'context/api'
import {useHistory, useParams} from 'react-router-dom'
import qs from 'query-string'
//context
import {Context} from 'context'
import Swiper from 'react-id-swiper'
import {isHybrid, Hybrid} from 'context/hybrid'
import {clipJoin} from 'pages/common/clipPlayer/clip_func'
//layout
import Layout2 from 'pages/common/layout2.5'
import Header from 'components/ui/new_header'
import BoardList from '../../pages/mypage/content/board_list'
import WriteBoard from '../../pages/mypage/content/board_write'
import NoResult from 'components/ui/noResult'
//scss
import '../mypage/index.scss'

export default (props) => {
  const {webview} = qs.parse(location.search)
  let params = useParams()
  const LocationClip = params.clipNo
  //state
  const [boardList, setBoardList] = useState([])

  const [totalCount, setTotalCount] = useState(0)
  //list fetch
  async function fetchReplyList() {
    const {result, data} = await Api.getClipReplyList({
      clipNo: LocationClip,
      records: 999
    })
    if (result === 'success') {
      setBoardList(data.list)
      setTotalCount(data.paging.total)
    }
  }
  //update list emit
  const setAction = (value) => {
    if (value === true) {
      fetchReplyList()
    }

    if (props.set) {
      props.set(true)
    }
  }

  useEffect(() => {
    fetchReplyList()
  }, [])

  const checkPlayer = () => {
    if (isHybrid()) {
      Hybrid('ClipPlayerEnter')
    } else {
      history.goBack()
    }
  }
  //---------------------------------------------------------------------
  return (
    <Layout2 {...props} webview={webview} status="no_gnb">
      <div id="clip_reply">
        <div className="fanboard">
          {!props.type ? <Header title="클립 댓글" goBack={checkPlayer} /> : <></>}
          <WriteBoard {...props} type={'clip_board'} set={setAction} />
          {/* 클립댓글 리스트 영역 */}
          {totalCount > 0 ? (
            <BoardList list={boardList} totalCount={totalCount} set={setAction} type="clip_board" />
          ) : (
            <NoResult />
          )}
        </div>
      </div>
    </Layout2>
  )
}
//---------------------------------------------------------------------
