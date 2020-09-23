import React, {useState, useContext, useEffect} from 'react'
import Header from 'components/ui/new_header.js'
import Layout from 'pages/common/layout'
import Api from 'context/api'
import {useHistory} from 'react-router-dom'

import {Hybrid} from 'context/hybrid'
import {Context} from 'context'
import {PlayListStore} from '../store'
import PlayList from './list'
import PlayListEdit from './edit'

export default () => {
  const globalCtx = useContext(Context)
  const {token} = globalCtx
  const playListCtx = useContext(PlayListStore)
  const history = useHistory()

  useEffect(() => {
    if (!token.isLogin) {
      history.push('/login?redirect=/clip/play_list')
    }
  }, [token])

  const {isEdit, sortType, deleteList, sortList} = playListCtx

  const goBack = () => {
    if (isEdit) {
      //에딧중이라면
      globalCtx.action.confirm({
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

  const fetchEdit = async () => {
    const {result, message} = await Api.postPlayListEdit({
      data: {
        sortType: sortType,
        sortClipNoList: sortList
      }
    })
    if (result === 'success') {
    } else {
      globalCtx.action.alert({msg: message})
    }
  }

  const handleBtnClick = () => {
    if (isEdit) {
      globalCtx.action.confirm({
        msg: '변경된 내용을 저장하시겠습니까?',
        callback: () => {
          playListCtx.action.updateIsEdit(false)
          fetchEdit()
        }
      })
    } else {
      playListCtx.action.updateIsEdit(true)
    }
  }

  return (
    <Layout status="no_gnb">
      <div id="clipPlayList">
        <Header title="재생목록" type="fixed" goBack={goBack} />
        <button
          className={`playlistEdit__headerBtn ${!isEdit ? '' : 'playlistEdit__headerBtn--edit'}`}
          onClick={() => handleBtnClick()}>
          {isEdit ? '완료' : '편집'}
        </button>
        <PlayList />
        <PlayListEdit />
      </div>
    </Layout>
  )
}
