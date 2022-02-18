import React, {useContext, useState, useEffect, useRef, useCallback} from 'react'
import Api from 'context/api'
import {useParams} from 'react-router-dom'
import qs from 'query-string'
//context
import {Context} from 'context'
import {Hybrid} from 'context/hybrid'
//layout
import Layout2 from 'pages/common/layout2.5';
import Header from 'components/ui/new_header';
import BoardList from '../../pages/mypage/content/board_list';
import WriteBoard from '../../pages/mypage/content/board_write';
import NoResult from "components/ui/noResult/NoResult";

//scss
import '../mypage/index.scss'
export default (props) => {
  const globalCtx = useContext(Context)
  const {webview} = qs.parse(location.search)
  let params = useParams()
  const LocationClip = params.clipNo
  //state
  const [boardList, setBoardList] = useState([])
  const [totalCount, setTotalCount] = useState(-1)
  //list fetch
  async function fetchReplyList() {
    const {result, data, code} = await Api.getClipReplyList({
      clipNo: LocationClip,
      records: 999
    })
    if (result === 'success' && code === '0') {
      setBoardList(data.list)
      if (data.paging) {
        setTotalCount(data.paging.total)
      } else {
        setTotalCount(0)
      }
    } else {
      globalCtx.action.alert({
        msg: message
      })
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
  const goBack = () => {
    sessionStorage.removeItem('webview')
    Hybrid('CloseLayerPopup')
  }
  //---------------------------------------------------------------------
  useEffect(() => {
    fetchReplyList()
  }, [])
  useEffect(() => {
    globalCtx.action.updateSetBack(null)
    globalCtx.action.updatePlayer(false)
    return () => {}
  }, [])
  //-----------------------render
  return (
    <Layout2 {...props} webview={webview} status="no_gnb" type={'clipBack'}>
      <div id="clip_reply">
        <div className="fanboard">
          {!props.type ? <Header title="클립 댓글" goBack={goBack} /> : <></>}
          <WriteBoard {...props} type={'clip_board'} set={setAction} />
          {totalCount === -1 && (
            <div className="loading">
              <span/>
            </div>
          )}
          {totalCount > 0 ?
            <BoardList list={boardList} totalCount={totalCount} set={setAction} type="clip_board" />
            :
            <NoResult />
          }
        </div>
      </div>
    </Layout2>
  )
}
//---------------------------------------------------------------------
