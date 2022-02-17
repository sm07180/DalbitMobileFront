import React, {useContext, useEffect, useState} from 'react'
import Api from 'context/api'
import {arrayMove, List} from 'react-movable'
import {PlayListStore} from '../store'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

export default (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const playListCtx = useContext(PlayListStore)

  sessionStorage.setItem('play_clip_no', '101600394204306')
  const playClipNo = sessionStorage.getItem('play_clip_no')

  const [isFilterOn, setIsFilterOn] = useState(false)
  const [isAllClick, setIsAllClick] = useState(false)

  const {isEdit, list, clipType, sortType, deleteList} = playListCtx

  const onChangeHandle = (oldIndex, newIndex) => {
    let arrayList = arrayMove(list, oldIndex, newIndex)
    playListCtx.action.updateList(arrayList)
    arrayList = arrayList.map((item, idx) => {
      return item['clipNo']
    })
    playListCtx.action.updateSortList(arrayList.join('|'))
    sortType !== 0 && playListCtx.action.updateSortType(0)
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
    playListCtx.action.updateSortType(idx)
    const {result, data, message} = await Api.getPlayList({
      params: {
        sortType: idx,
        records: 100
      }
    })
    if (result === 'success') {
      console.log(data.list)
      playListCtx.action.updateList(data.list)
      setIsFilterOn(false)
    } else {
      dispatch(setGlobalCtxMessage({type: "alert", msg: message}))
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
    playListCtx.action.updateSortType(0)
    const {result, message} = await Api.postPlayListEdit({
      data: {
        sortType: 0,
        deleteClipNoList: deleteList
      }
    })
    if (result === 'success') {
      handleFilterClick(0)
      playListCtx.action.updateDeleteList('')
    } else {
      dispatch(setGlobalCtxMessage({type: "alert", msg: message}))
    }
  }

  const handleAllClick = () => {
    if (isAllClick) {
      //선택해재
      playListCtx.action.updateDeleteList('')
      setIsAllClick(false)
    } else {
      //전체선택
      let all = list.map((item, idx) => {
        return item['clipNo']
      })
      playListCtx.action.updateDeleteList(all.join('|'))
      setIsAllClick(true)
    }
  }

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
        <button className={`playListSorter__selectBtn ${isAllClick ? 'on' : 'off'}`} onClick={handleAllClick}>
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
