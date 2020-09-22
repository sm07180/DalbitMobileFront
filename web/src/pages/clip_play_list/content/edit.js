import React, {useState, useHistory, useContext, useEffect} from 'react'
import {Context} from 'context'
import Layout from 'pages/common/layout'
import Api from 'context/api'
import {List, arrayMove} from 'react-movable'
import {PlayListStore} from '../store'

export default (props) => {
  const globalCtx = useContext(Context)
  const playListCtx = useContext(PlayListStore)
  const [scrollState, setScrollState] = useState(false)
  const [selectedItem, setSelectedItem] = useState([])
  const [isFilterOn, setIsFilterOn] = useState(false)

  const {isEdit, list, clipType, sortType} = playListCtx

  const onChangeHandle = (oldIndex, newIndex) => {
    playListCtx.action.updateList(arrayMove(list, oldIndex, newIndex))
  }

  const arrayToString = (array) => {}

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

  const updatePlayList = async (sort, deleteList, sortList) => {
    if (deleteList.length === 0) {
      deleteList = ''
    } else {
      deleteList = arrayToString(deleteList)
    }

    if (sortList.length === 0) {
      sortList = ''
    } else {
      sortList = arrayToString(sortList)
    }

    const {result, data, message} = await Api.postPlayListEdit({
      data: {
        sortType: sort,
        deleteClipNoList: deleteList,
        sortClipNoList: sortList
      }
    })
    if (result === 'success') {
      console.log('data', data)
    } else {
      globalCtx.action.alert({
        msg: message
      })
    }
  }

  const filterList = ['사용자설정', '많이 재생한 순', '좋아요 순', '선물 순', '재생목록 추가 순']

  const makeFilterBtn = () => {
    return filterList.map((item, idx) => {
      return (
        <li
          key={idx}
          className={`playListSorterList__item ${sortType === idx ? 'on' : 'off'}`}
          onClick={() => handleFilterClick(idx)}>
          {item}
        </li>
      )
    })
  }

  const handleFilterClick = async (idx) => {
    const {result, data, message} = await Api.getPlayList({
      params: {
        sortType: idx,
        records: 100
      }
    })
    if (result === 'success') {
      playListCtx.action.updateList(data.list)
      playListCtx.action.updateSortType(idx)
      setIsFilterOn(false)
    } else {
      globalCtx.action.alert({msg: message})
    }
  }

  useEffect(() => {
    if (isFilterOn) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [isFilterOn])

  return (
    <div className={`playListWrap ${isEdit ? 'on edit' : 'off'}`}>
      <div className="playListSorter">
        <button className="playListSorter__selectBtn">전체선택</button>
        <button
          className="playListSorter__sortBtn"
          onClick={() => {
            setIsFilterOn(!isFilterOn)
          }}>
          정렬순
        </button>
        <button className="playListSorter__deleteBtn">삭제</button>
        <ul className={`playListSorterList ${isFilterOn ? 'on' : 'off'}`}>{makeFilterBtn()}</ul>
      </div>
      <div
        className={`playListSorter__dim ${isFilterOn ? 'on' : 'off'}`}
        onClick={() => {
          setIsFilterOn(false)
        }}></div>
      <List
        values={list}
        onChange={({oldIndex, newIndex}) => onChangeHandle(oldIndex, newIndex)}
        renderList={({children, props}) => (
          <ul
            {...props}
            style={{
              padding: 0
            }}
            className={`playListBox ${scrollState ? 'on' : 'off'}`}>
            {children}
          </ul>
        )}
        renderItem={({value, props, isDragged}) => (
          <li {...props} id="playListItem">
            <div className="playListItem__thumb">
              <img src={value['bgImg']['thumb80x80']} alt="thumb" />
              <span className="playListItem__thumb--playTime">{value['filePlayTime']}</span>
            </div>
            <div className="textBox">
              <div className="textBox__iconBox">
                <span className="textBox__iconBox--type">
                  {clipType.map((item, index) => {
                    if (item.value === value['subjectType']) {
                      return <React.Fragment key={value['clipNo'] + 'typeList'}>{item.cdNm}</React.Fragment>
                    }
                  })}
                </span>
                <span
                  className={`textBox__iconBox--gender ${
                    value['gender'] === 'f' ? 'female' : value['gender'] === 'm' ? 'male' : ''
                  }`}></span>
              </div>
              <p className="textBox__subject">{value['title']}</p>
              <p className="textBox__nickName">{value['nickName']}</p>
              <button
                data-movable-handle
                style={{
                  cursor: isDragged ? 'grabbing' : 'grab',
                  marginRight: '3em'
                }}
                tabIndex={-1}>
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          </li>
        )}
      />
    </div>
  )
}
