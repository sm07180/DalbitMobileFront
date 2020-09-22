import React, {useState, useHistory, useContext, useEffect} from 'react'
import {Context} from 'context'
import Layout from 'pages/common/layout'
import Api from 'context/api'
import {List, arrayMove} from 'react-movable'
import {PlayListStore} from '../store'

export default (props) => {
  const globalCtx = useContext(Context)
  const playListCtx = useContext(PlayListStore)

  const [isFilterOn, setIsFilterOn] = useState(false)
  const [isAllClick, setIsAllClick] = useState(false)

  const {isEdit, list, clipType, sortType, deleteList} = playListCtx

  const onChangeHandle = (oldIndex, newIndex) => {
    playListCtx.action.updateList(arrayMove(list, oldIndex, newIndex))
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

  const handleListItemClick = (clipNo) => {
    if (deleteList.includes(clipNo)) {
      if (deleteList.includes(`|${clipNo}`)) {
        playListCtx.action.updateDeleteList(deleteList.replace(`|${clipNo}`, ''))
      } else {
        playListCtx.action.updateDeleteList(deleteList.replace(`${clipNo}`, ''))
      }
    } else {
      if (deleteList === '') {
        playListCtx.action.updateDeleteList(clipNo)
      } else {
        playListCtx.action.updateDeleteList(deleteList + `|${clipNo}`)
      }
    }
  }

  const deleteListFunc = async () => {
    const {result, message} = await Api.postPlayListEdit({
      data: {
        sortType: 0,
        deleteClipNoList: deleteList
      }
    })
    if (result === 'success') {
      handleFilterClick(0)
    } else {
      globalCtx.action.alert({msg: message})
    }
  }

  const handleAllClick = () => {}

  useEffect(() => {
    console.log(deleteList)
  }, [deleteList])

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
        <button className="playListSorter__selectBtn" onClick={handleAllClick}>
          {isAllClick ? '선택해제' : '전체선택'}
        </button>
        <button
          className="playListSorter__sortBtn"
          onClick={() => {
            setIsFilterOn(!isFilterOn)
          }}>
          {filterList[sortType]}
        </button>
        {deleteList ? (
          <button className="playListSorter__deleteBtn" onClick={deleteListFunc}>
            삭제
          </button>
        ) : (
          <button className="playListSorter__deleteBtn none">삭제</button>
        )}

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
            className={`playListBox`}>
            {children}
          </ul>
        )}
        renderItem={({value, props, isDragged}) => (
          <li
            {...props}
            id="playListItem"
            className={`edit ${deleteList.includes(value['clipNo']) ? 'on' : 'off'}`}
            onClick={() => {
              handleListItemClick(value['clipNo'])
            }}>
            <div className="playListItem__thumb edit">
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
