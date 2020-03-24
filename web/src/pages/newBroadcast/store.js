import React, {useState, createContext} from 'react'

//Context
const BroadcastStore = createContext()
const {Provider} = BroadcastStore

const BroadcastProvider = props => {
  //state
  // const [list, setList] = useState([])
  //---------------------------------------------------------------------
  const action = {}
  const value = {action}

  return <Provider value={value}>{props.children}</Provider>
}

export {BroadcastStore, BroadcastProvider}
