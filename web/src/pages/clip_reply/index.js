import React, {useContext, useState, useEffect, useRef, useCallback} from 'react'
import Api from 'context/api'
import {useHistory, useParams} from 'react-router-dom'
import qs from 'query-string'
//context
import {Context} from 'context'
import {Hybrid, isHybrid} from 'context/hybrid'
//layout
import Layout2 from 'pages/common/layout2.5';
import Header from 'components/ui/header/Header';
import BoardList from '../../pages/mypage/content/board_list';
import WriteBoard from '../../pages/mypage/content/board_write';
import NoResult from "components/ui/noResult/NoResult";

//scss
import '../mypage/index.scss'

const ClipReply = (props) => {
  const globalCtx = useContext(Context)
  const {webview} = qs.parse(location.search);
  const history = useHistory();

  let params = useParams()
  const LocationClip = params.clipNo
  //state
  const [boardList, setBoardList] = useState([])
  const [totalCount, setTotalCount] = useState(-1);

  //list fetch
  async function fetchReplyList() {
    const {result, data, code, message} = await Api.getClipReplyList({ clipNo: LocationClip, records: 999 });
    if (result === 'success' && code === 'C001') {
      setBoardList(data.list)
      if (data.paging) {
        setTotalCount(data.paging.total)
      } else {
        setTotalCount(0)
      }
    } else {
      /*globalCtx.action.alert({ msg: message })*/
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
    if(isHybrid()) {
      sessionStorage.removeItem('webview')
      Hybrid('CloseLayerPopup')
    } else {
      history.goBack();
    }
  };

  //---------------------------------------------------------------------
  useEffect(() => {
    fetchReplyList()
  }, []);

  useEffect(() => {
    globalCtx.action.updateSetBack(null)
    globalCtx.action.updatePlayer(false)
    return () => {}
  }, []);

  return (
    <div id="clip_reply">
      {!props.type ? <Header title="클립 댓글" type={'back'} backEvent={goBack}/> : <></>}
      <div className="fanboard">
        <WriteBoard {...props} type={'clip_board'} set={setAction} />
        {totalCount > 0 ?
          <BoardList list={boardList} totalCount={totalCount} set={setAction} type="clip_board" />
          :
          <NoResult />
        }
      </div>
    </div>
  )
}

export default ClipReply;
