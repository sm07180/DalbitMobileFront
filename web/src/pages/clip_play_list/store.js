import React, {useState, createContext} from 'react'
//Context
const PlayListStore = createContext()
const {Provider} = PlayListStore
//
const PlayListProvider = (props) => {
  //state
  const [isEdit, setIsEdit] = useState(false)
  const [list, setList] = useState([])
  const [clipType, setClipType] = useState([])
  const [sortType, setSortType] = useState(0)
  const [deleteList, setDeleteList] = useState('')
  const [sortList, setSortList] = useState('')
  //---------------------------------------------------------------------
  const action = {
    updateIsEdit: (bool) => {
      setIsEdit(bool)
    },

    updateList: (array) => {
      setList(array)
    },

    updateClipType: (array) => {
      setClipType(array)
    },

    updateSortType: (int) => {
      setSortType(int)
    },

    updateDeleteList: (string) => {
      //101597902525112|101598246751457 형식
      setDeleteList(string)
    },

    updateSortList: (string) => {
      //101597902525112|101598246751457 형식
      setSortList(string)
    }
  }
  //---------------------------------------------------------------------
  const value = {isEdit, list, clipType, sortType, deleteList, sortList, action}
  return <Provider value={value}>{props.children}</Provider>
}
export {PlayListStore, PlayListProvider}
