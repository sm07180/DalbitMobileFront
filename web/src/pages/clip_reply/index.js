import React, {useEffect, useState} from 'react'
import Api from 'context/api'
import {useParams} from 'react-router-dom'
import qs from 'query-string'
//context
import {Hybrid} from 'context/hybrid'
//layout
import Layout2 from 'pages/common/layout2.5'
import Header from 'components/ui/new_header'
import BoardList from '../../pages/mypage/content/board_list'
import WriteBoard from '../../pages/mypage/content/board_write'
import NoResult from 'components/ui/noResult'
//scss
import '../mypage/index.scss'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxBackState, setGlobalCtxMessage, setGlobalCtxPlayer} from "redux/actions/globalCtx";

export default (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const {webview} = qs.parse(location.search)
  let params = useParams()
  const LocationClip = params.clipNo
  //state
  const [boardList, setBoardList] = useState([])
  const [totalCount, setTotalCount] = useState(-1)

  //list fetch
  async function fetchReplyList() {
    const {result, data} = await Api.getClipReplyList({
      clipNo: LocationClip,
      records: 999
    })
    if (result === 'success') {
      setBoardList(data.list)
      if (data.paging) {
        setTotalCount(data.paging.total)
      } else {
        setTotalCount(0)
      }
    } else {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: message
      }))
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
    dispatch(setGlobalCtxBackState(null))
    dispatch(setGlobalCtxPlayer(false));
    return () => {
    }
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
              <span></span>
            </div>
          )}
          {totalCount === 0 && <NoResult />}
          {totalCount > 0 && <BoardList list={boardList} totalCount={totalCount} set={setAction} type="clip_board" />}
        </div>
      </div>
    </Layout2>
  )
}
//---------------------------------------------------------------------
