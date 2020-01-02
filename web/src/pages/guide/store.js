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
const GuideProvider = props => {
  //state
  const [state, setState] = useState({title: 'GUIDE'})
  const [menuCode, setMenuCode] = useState('')
  //---------------------------------------------------------------------
  const action = {
    //updateCode
    updateCode: (str = 'default') => {
      setMenuCode(str)
    },
    //updateState
    updateState: obj => {
      setState(state => ({...state, ...obj}))
    }
  }
  //---------------------------------------------------------------------
  const value = {state, menuCode, action}
  return <Provider value={value}>{props.children}</Provider>
}
export {Context, GuideProvider}
