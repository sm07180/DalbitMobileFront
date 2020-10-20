import React, {useState, useHistory, useContext, useEffect} from 'react'
import {Context} from 'context'
import Api from 'context/api'

import {Hybrid} from 'context/hybrid'
import {PlayListStore} from '../store'

import {clipJoin} from 'pages/common/clipPlayer/clip_func'

export default () => {
  const globalCtx = useContext(Context)
  const playListCtx = useContext(PlayListStore)

  const [playClipNo, setPlayClipNo] = useState(sessionStorage.getItem('play_clip_no'))
  const [totalList, setTotalList] = useState(0)

  const {isEdit, list, clipType, sortType} = playListCtx

  const fetchDataClipType = async () => {
    const {result, data, message} = await Api.getClipType({})
    if (result === 'success') {
      playListCtx.action.updateClipType(data)
    } else {
      globalCtx.action.alert({msg: message})
    }
  }

  const fetchPlayList = async () => {
    const {result, data, message} = await Api.getPlayList({
      params: {
        sortType: 1,
        records: 100
      }
    })
    if (result === 'success') {
      playListCtx.action.updateList(data.list)
      setTotalList(data.paging.total)
    } else {
      globalCtx.action.alert({msg: message})
    }
  }

  const clipPlay = async (clipNum) => {
    const {result, data, message} = await Api.postClipPlay({
      clipNo: clipNum
    })
    if (result === 'success') {
      clipJoin(data, globalCtx)
    } else {
      globalCtx.action.alert({msg: message})
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
