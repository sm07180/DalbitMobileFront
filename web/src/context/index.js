/*
import React, {useContext, useState} from 'react'
import {Context} from 'context'

const store = useContext(Context)

 */
import React, {useEffect, useState, createContext} from 'react'

//Context
const Context = createContext()
const {Provider} = Context

//
const GlobalProvider = props => {
  //initalize

  //state
  //---------------------------------------------------------------------
  const [state, setState] = useState({title: '현재 이용현황', isSub: false})
  const [popup_code, setPopup] = useState('')
  const [popup_visible, setVisible] = useState(false)

  //---------------------------------------------------------------------
  const action = {
    //updateState
    updateState: obj => {
      setState(state => ({...state, ...obj}))
    },
    //팝업컨텐츠
    updatePopup: str => {
      setPopup(str)
      //팝업
      setVisible(true)
    },
    //팝업 visible
    updatePopupVisible: bool => {
      setVisible(bool)
    }
  }
  //---------------------------------------------------------------------
  const value = {state, popup_code, popup_visible, action}
  return <Provider value={value}>{props.children}</Provider>
}
export {Context, GlobalProvider}
