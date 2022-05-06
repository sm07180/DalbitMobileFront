import React, {useContext, useEffect} from 'react'
import Header from 'components/ui/header/Header';
import Layout from 'pages/common/layout'
import Api from 'context/api'
import {useHistory} from 'react-router-dom'

import {Hybrid, isHybrid} from 'context/hybrid'
import {PlayListStore} from '../store'
import PlayList from './list'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

export default () => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const {token} = globalState
  const playListCtx = useContext(PlayListStore)
  const history = useHistory()

  useEffect(() => {
    if (!token.isLogin) {
      history.push('/login?redirect=/clip/play_list')
    }
  }, [token])

  const {isEdit, sortType, deleteList, sortList} = playListCtx
/*

  const goBack = () => {
    if (isEdit) {
      //에딧중이라면
      dispatch(setGlobalCtxMessage({type: "confirm",
        msg: '편집 중인 내용을 \n 취소하시겠습니까? \n 변경된 내용은 저장되지 않습니다.',
        callback: () => {
          Hybrid('CloseLayerPopup')
        }
      })
    } else {
      //에딧중이 아니라면
      Hybrid('CloseLayerPopup')
    }
  }
*/

  const fetchEdit = async () => {
    const {result, message} = await Api.postPlayListEdit({
      data: {
        sortType: sortType,
        sortClipNoList: sortList
      }
    })
    if (result === 'success') {
    } else {
      dispatch(setGlobalCtxMessage({type: "alert",msg: message}))
    }
  }

  const handleBtnClick = () => {
    if (isEdit) {
      dispatch(setGlobalCtxMessage({type: "confirm",
        msg: '변경된 내용을 저장하시겠습니까?',
        callback: () => {
          playListCtx.action.updateIsEdit(false)
          fetchEdit()
        }
      }))
    } else {
      playListCtx.action.updateIsEdit(true)
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

  return (
    <Layout status="no_gnb" >
      <div id="clipPlayList">
        <Header title="재생목록" type="back" backEvent={goBack}/>
        <PlayList />
      </div>
    </Layout>
  )
}
