import React, {useEffect} from 'react'
import {Link} from 'react-router-dom'
import qs from 'query-string'
import _ from 'lodash'
import {OS_TYPE} from 'context/config.js'

import Api from 'context/api'
import Utility from 'components/lib/utility'
import {PUBLICITY_TYPE, UPLOAD_SUBTAB_TYPE} from 'pages/mypage/content/constant'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage, setGlobalCtxUpdatePopup} from "redux/actions/globalCtx";

export default function UploadClip(props) {
  const {dataList, setDataList, slctedBtnIdx, setSlctedBtnIdx, fetchDataPlay} = props
  const customHeader = JSON.parse(Api.customHeader)
  const {webview} = qs.parse(location.search)

  const {PRIVATE, PUBLIC} = PUBLICITY_TYPE // 0 | 1 in order
  const {SUBTAB_MY, SUBTAB_LISTEN, SUBTAB_LIKE, SUBTAB_GIFT} = UPLOAD_SUBTAB_TYPE // 0 | 1 | 2 | 3 in order
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const editDetailAPI = async (idx) => {
    const chosenItem = dataList.list[idx]

    const {result, data, message} = await Api.editMyClipDetail({
      clipNo: chosenItem.clipNo,
      openType: chosenItem.openType === PRIVATE ? PUBLIC : PRIVATE
    })

    if (result === 'success') {
      const clonedDataList = _.cloneDeep(dataList.list)
      clonedDataList[idx].openType = data.openType
      setDataList({isLoading: false, list: clonedDataList})
    } else {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: message
      }))
    }
  }

  const toggleConfirmModal = (idx) => {
    const chosenOpenType = dataList.list[idx].openType
    dispatch(setGlobalCtxMessage({
      type: "confirm",
      msg: chosenOpenType === 0 ? '공개정보를 공개로 변경하시겠습니까?' : '공개정보를 비공개로 변경하시겠습니까?',
      callback: () => {
        editDetailAPI(idx)
      }
    }));
  }

  const openButtonHandler = (e, idx) => {
    if (slctedBtnIdx !== idx) e.stopPropagation()
    setSlctedBtnIdx(idx)
  }

  const closeButtonHandler = () => setSlctedBtnIdx(null)

  const renderIcon = (item) => {
    switch (globalState.clipTab) {
      case SUBTAB_LISTEN:
        return (
          <span>
            <em className="icon_play"/>
            {Utility.printNumber(item.countPlay)}
          </span>
        )
      case SUBTAB_LIKE:
        return (
          <span>
            <em className="icon_good-color" />
            {Utility.printNumber(item.countGood)}
          </span>
        )
      case SUBTAB_GIFT:
        return (
          <span>
            <em className="icon_byeol" />
            {Utility.printNumber(item.countByeol)}
          </span>
        )
      default:
        return (
          <span>
            <em className="icon_byeol" />
            {Utility.printNumber(item.countByeol)}
          </span>
        )
    }
  }

  const eventClipPlayHandler = (clipNo, idx) => {
    if (customHeader['os'] === OS_TYPE['Desktop']) {
      dispatch(setGlobalCtxUpdatePopup({popup: ['APPDOWN', 'appDownAlrt', 3]}));
    } else {
      if (webview === 'new' && Utility.getCookie('native-player-info') !== undefined) {
        dispatch(setGlobalCtxMessage({
          type: "alert",
          msg: '선택한 클립 재생은 청취중인 방송을 \n 종료 한 후 가능합니다.'
        }));
        return;
      }
      fetchDataPlay(clipNo, idx)
    }
  }

  useEffect(() => {
    // close button modal on window click
    window.addEventListener('click', closeButtonHandler)
    return () => {
      window.removeEventListener('click', closeButtonHandler)
    }
  }, [])

  return (
    <ul className="upload_list">
      {dataList.list.map((item, idx) => {
        return globalState.clipTab === SUBTAB_MY ? (
          // [ 마이 클립 ]
          <li key={`upload_list-${idx}`} className="my_clip_item" onClick={() => closeButtonHandler(idx)}>
            <div className="thumb" onClick={() => eventClipPlayHandler(item.clipNo, idx)}>
              <img className="image_prof" src={item.bgImg['thumb120x120']} alt="profile image"/>
              <img
                className={`image_lock${item.openType === PRIVATE ? ' visible' : ''}`}
                src="https://image.dallalive.com/svg/lock_circle_g.svg"
                alt="locked"
              />
            </div>

            <div className="text_wrap">
              <div className="text_box" onClick={() => eventClipPlayHandler(item.clipNo, idx)}>
                <div className="title_box">
                  <span>{item.subjectName}</span>
                  <p>{item.title}</p>
                </div>
                <p>{item.nickName}</p>

                <div className="icon_box">
                  <span>
                    <em className="icon_play" />
                    {Utility.printNumber(item.countPlay)}
                  </span>
                  <span>
                    <em className="icon_byeol" />
                    {Utility.printNumber(item.countByeol)}
                  </span>
                  <span>
                    <em className="icon_good" />
                    {Utility.printNumber(item.countGood)}
                  </span>
                  <span>
                    <em className="icon_reply" />
                    {Utility.printNumber(item.countReply)}
                  </span>
                </div>
              </div>

              <div className="button_box">
                <em className="dot_button" onClick={(e) => openButtonHandler(e, idx)} />
                <button className={`more_button${slctedBtnIdx === idx ? ' active' : ''}`} onClick={() => toggleConfirmModal(idx)}>
                  {item.openType === PRIVATE ? '공개' : '비공개'}
                </button>
              </div>
            </div>
          </li>
        ) : (
          // [ 청취 회원 | 좋아요 회원 | 선물한 회원 ]
          <li key={`member_list-${idx}`} className="member_list">
            <Link to={`/profile/${item.memNo}`}>
              <div className="prof_thumb">
                <img src={item.profImg['thumb120x120']} alt="profile image" />
              </div>
            </Link>

            <div className="text_wrap">
              <Link to={`/profile/${item.memNo}`}>
                <div className="text_box">
                  <em className={`icon_wrap ${item.gender === 'f' ? 'icon_female' : 'icon_male'}`}>성별</em>
                  <p>{item.nickName}</p>
                </div>
              </Link>

              <div className="clip_box" onClick={() => fetchDataPlay(item.clipNo, idx)}>
                <div className="clip_thumb">
                  <img src={item.bgImg['thumb120x120']} alt="clip image" />
                </div>
                <div className="content_box">
                  <p>{item.title}</p>
                  {renderIcon(item)}
                </div>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
