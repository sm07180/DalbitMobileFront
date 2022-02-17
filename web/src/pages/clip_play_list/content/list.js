import React, {useContext, useEffect, useState} from 'react'
import Api from 'context/api'
import {PlayListStore} from '../store'

import {clipJoin} from 'pages/common/clipPlayer/clip_func'
import {OS_TYPE} from 'context/config.js'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

export default () => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const playListCtx = useContext(PlayListStore)
  const customHeader = JSON.parse(Api.customHeader)

  const [playClipNo, setPlayClipNo] = useState(localStorage.getItem('play_clip_no'))
  // const [playClipNo, setPlayClipNo] = useState('101604033535194')
  const [totalList, setTotalList] = useState(0)

  const {isEdit, list, clipType, sortType} = playListCtx

  const fetchDataClipType = async () => {
    const {result, data, message} = await Api.getClipType({})
    if (result === 'success') {
      playListCtx.action.updateClipType(data)
    } else {
      dispatch(setGlobalCtxMessage({type: "alert", msg: message}))
    }
  }

  const fetchPlayList = async () => {
    //clipPlayListInfo에 파라미터 값 받아서 여러곡 재생목록 조회해야 할 때
    const playListInfo = JSON.parse(localStorage.getItem('clipPlayListInfo'))

    if (!playListInfo) {
      //한곡만 재생할때 (푸쉬알람, 알람페이지, 클립 청취목록)
      //한곡만 조회할 수 없으므로 플레이 시 데이터를 필요한 것만 담아서 사용

      const oneClipPlayList = JSON.parse(localStorage.getItem('oneClipPlayList'))

      if (oneClipPlayList) {
        setTotalList(1)
        return playListCtx.action.updateList([{...oneClipPlayList}])
      }
    }

    if (playListInfo.hasOwnProperty('listCnt')) {
      if (playListInfo.hasOwnProperty('subjectType')) {
        //메인 top3
        const {result, data, message} = await Api.getMainTop3List({...playListInfo})
        if (result === 'success') {
          playListCtx.action.updateList(data.list)
          setTotalList(data.list.length)
        } else {
          dispatch(setGlobalCtxMessage({type: "alert", msg: message}))
        }
      } else {
        //추천(인기)
        const {result, data, message} = await Api.getPopularList({...playListInfo})
        if (result === 'success') {
          playListCtx.action.updateList(data.list)
          setTotalList(data.list.length)
        } else {
          dispatch(setGlobalCtxMessage({type: "alert", msg: message}))
        }
      }
    } else if (playListInfo.hasOwnProperty('memNo')) {
      if (playListInfo.hasOwnProperty('slctType')) {
        //마이페이지 청취내역(좋아요, 선물)
        const {result, data, message} = await Api.getHistoryList({...playListInfo})
        if (result === 'success') {
          playListCtx.action.updateList(data.list)
          setTotalList(data.list.length)
        } else {
          dispatch(setGlobalCtxMessage({type: "alert", msg: message}))
        }
      } else {
        //마이페이지 업로드목록
        const {result, data, message} = await Api.getUploadList({...playListInfo})
        if (result === 'success') {
          playListCtx.action.updateList(data.list)
          setTotalList(data.list.length)
        } else {
          dispatch(setGlobalCtxMessage({type: "alert", msg: message}))
        }
      }
    } else if (playListInfo.hasOwnProperty('recDate')) {
      const {result, data, message} = await Api.getMarketingClipList({...playListInfo})
      if (result === 'success') {
        playListCtx.action.updateList(data.list)
        setTotalList(data.list.length)
      } else {
        dispatch(setGlobalCtxMessage({type: "alert", msg: message}))
      }
    } else if (playListInfo.hasOwnProperty('rankType')) {
      const {result, data, message} = await Api.getClipRankingList({...playListInfo})
      if (result === 'success') {
        playListCtx.action.updateList(data.list)
        setTotalList(data.list.length)
      } else {
        dispatch(setGlobalCtxMessage({type: "alert", msg: message}))
      }
    } else {
      //나머지 기본 '/clip/list' 조회(최신, 테마슬라이더, 각 주제별, 서치)
      const {result, data, message} = await Api.getClipList({...playListInfo})
      if (result === 'success') {
        playListCtx.action.updateList(data.list)
        setTotalList(data.list.length)
      } else {
        dispatch(setGlobalCtxMessage({type: "alert", msg: message}))
      }
    }
  }

  const clipPlay = async (clipNum) => {
    const nextClipIdx = list.findIndex((item) => {
      return item.clipNo === clipNum
    })
    const {result, data, message} = await Api.postClipPlay({
      clipNo: clipNum
    })
    if (result === 'success') {
      clipJoin(data, 'new')
    } else {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: message,
        callback: () => {
          if (list[nextClipIdx + 1] !== undefined) {
            clipPlay(list[nextClipIdx + 1].clipNo)
          } else {
            clipPlay(list[0].clipNo)
          }
        }
      }))
    }
  }

  useEffect(() => {
    window.addEventListener('storage', () => {
      // alert('스토리지변경')
      setPlayClipNo(sessionStorage.getItem('play_clip_no'))
    })

    return () => {
      window.removeEventListener('storage', () => {
        // alert('스토리지변경')
        setPlayClipNo(sessionStorage.getItem('play_clip_no'))
      })
    }
  }, [])

  useEffect(() => {
    console.log('list', list)
    if (list.length > 0 && document.getElementsByClassName('playing')[0]) {
      const currentTop = document.getElementsByClassName('playing')[0].offsetTop
      // console.log('currentTop', currentTop)
      if (currentTop !== 0) {
        if (customHeader['os'] === OS_TYPE['IOS']) {
          // console.log('1')
          window.scrollTo(0, currentTop)
        } else {
          // console.log('2')
          window.scrollTo(0, currentTop)
        }
      }
    }
  }, [list])

  const createList = () => {
    if (list.length === 0) return null
    return list.map((item, idx) => {
      const {clipNo, title, nickName, subjectType, filePlayTime, bgImg, gender} = item
      const genderClassName = gender === 'f' ? 'female' : gender === 'm' ? 'male' : ''
      return (
        <li id="playListItem" className={`${clipNo === playClipNo ? 'playing' : 'off'}`} key={`${idx}-playList`}>
          <div
            className="playListItem__thumb"
            onClick={() => {
              clipPlay(clipNo)
            }}>
            {clipNo === playClipNo && (
              <div className="playingbarWrap">
                <div className="playingbar">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <img src={bgImg['thumb80x80']} alt="thumb" />
            <span className="playListItem__thumb--playTime">{filePlayTime}</span>
          </div>
          <div
            className="textBox"
            onClick={() => {
              clipPlay(clipNo)
            }}>
            <div className="textBox__iconBox">
              <span className="textBox__iconBox--type">
                {clipType.map((item, index) => {
                  const {value, cdNm} = item
                  if (value === subjectType) {
                    return <React.Fragment key={idx + 'typeList'}>{cdNm}</React.Fragment>
                  }
                })}
              </span>
              <span className={`textBox__iconBox--gender ${genderClassName}`}></span>
            </div>
            <p className="textBox__subject">{title}</p>
            <p className="textBox__nickName">{nickName}</p>
          </div>
        </li>
      )
    })
  }

  useEffect(() => {
    fetchDataClipType()
    document.body.style.height = 'auto'
    document.body.style.minHeight = 'auto'
  }, [])

  useEffect(() => {
    if (!isEdit) {
      playListCtx.action.updateDeleteList('')
      fetchPlayList()
    }
  }, [isEdit])

  if (list.length === 0) return null

  return (
    <>
      <div className={`playListWrap ${isEdit ? 'off' : 'on'}`}>
        <p className="totalListItem">
          총 목록 수 <span>{totalList}</span>
        </p>
        <ul className="playListBox">{createList()}</ul>
      </div>
    </>
  )
}
