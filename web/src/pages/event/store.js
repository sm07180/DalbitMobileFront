/**
 * @file 모바일/고객센터/store.js
 * @brief 이벤트 context API
 * @author 이은비
 */
import React, {useState, createContext} from 'react'
//Context
const EventStore = createContext()
const {Provider} = EventStore
//
const EventProvider = props => {
  //state
  const [list, setList] = useState([])
  const [eventPage, setEventPage] = useState('')
  //---------------------------------------------------------------------
  const action = {
    /**
     * @brief Constructor
     * @param object $obj
     * @return void
     */
    updateList: list => {
      setList({...list})
    },
    updateEventPage: num => {
      setEventPage(num)
    }
  }
  //---------------------------------------------------------------------
  const value = {action, list, eventPage}
  return <Provider value={value}>{props.children}</Provider>
}
export {EventStore, EventProvider}
