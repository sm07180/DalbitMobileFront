import React, {useState, useHistory, useContext, useEffect} from 'react'
import Header from 'components/ui/new_header.js'
import {Context} from 'context'
import Layout from 'pages/common/layout'
import Api from 'context/api'

import play_list from './play_list.scss'

export default () => {
  const globalCtx = useContext(Context)
  const [list, setList] = useState([])
  const [clipType, setClipType] = useState([])
  const [isEdit, setIsEdit] = useState(false)

  const fetchDataClipType = async () => {
    const {result, data, message} = await Api.getClipType({})
    if (result === 'success') {
      setClipType(data)
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
      setList(data.list)
    } else {
      globalCtx.action.alert({msg: message})
    }
  }

  const createList = () => {
    if (setList.length === 0) return null
    return list.map((item, idx) => {
      const {clipNo, title, nickName, subjectType, filePlayTime, bgImg, gender} = item
      const genderClassName = gender === 'f' ? 'female' : gender === 'm' ? 'male' : ''
      return (
        <li id="playListItem" key={`${idx}-playList`}>
          <div className="playListItem__thumb">
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

  return (
    <Layout status="no_gnb">
      <div id="clipPlayList">
        <Header title="재생목록" />
        <button className="playlistEdit__headerBtn">편집</button>
        {isEdit ? (
          <PlayListEdit list={list} clipType={clipType} />
        ) : (
          <div className="playListWrap">
            <ul className="playListBox">{createList()}</ul>
          </div>
        )}
      </div>
    </Layout>
  )
}
