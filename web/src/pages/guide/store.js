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
  //initalize

  //state
  //---------------------------------------------------------------------
  const [state, setState] = useState({title: 'GUIDE'})
  //---------------------------------------------------------------------
  const action = {
    //updateState
    updateState: obj => {
      setState(state => ({...state, ...obj}))
    }
  }
  //---------------------------------------------------------------------
  const value = {state, action}
  return <Provider value={value}>{props.children}</Provider>
}
export {Context, GuideProvider}
