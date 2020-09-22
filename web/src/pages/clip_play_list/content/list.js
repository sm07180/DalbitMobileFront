import React, {useState, useHistory, useContext, useEffect} from 'react'
import {Context} from 'context'
import Api from 'context/api'

import {Hybrid} from 'context/hybrid'
import {PlayListStore} from '../store'

export default () => {
  const globalCtx = useContext(Context)
  const playListCtx = useContext(PlayListStore)

  const {isEdit, list, clipType} = playListCtx

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
    } else {
      globalCtx.action.alert({msg: message})
    }
  }

  const createList = () => {
    if (list.length === 0) return null
    return list.map((item, idx) => {
      const {clipNo, title, nickName, subjectType, filePlayTime, bgImg, gender} = item
      const genderClassName = gender === 'f' ? 'female' : gender === 'm' ? 'male' : ''
      return (
        <li id="playListItem" key={`${idx}-playList`}>
          <div
            className="playListItem__thumb"
            onClick={() => {
              alert('재생')
            }}>
            <img src={bgImg['thumb80x80']} alt="thumb" />
            <span className="playListItem__thumb--playTime">{filePlayTime}</span>
          </div>
          <div className="textBox">
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
    if (!isEdit) fetchPlayList()
  }, [isEdit])

  if (list.length === 0) return null

  const goBack = () => {
    Hybrid('CloseLayerPopup')
  }

  const handleBtnClick = () => {
    setIsEdit(!isEdit)
  }

  const handleDataList = (list) => {
    console.log('데이터를 갖고옵시다', list)
  }

  return (
    <div className={`playListWrap ${isEdit ? 'off' : 'on'}`}>
      <ul className="playListBox">{createList()}</ul>
    </div>
  )
}
