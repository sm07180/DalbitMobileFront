/**
 * @file Interface.js
 * @brief Native,Windows ->React로 Interface
 * @notice
 * @code document.dispatchEvent(new CustomEvent('native-goLogin', {detail:{info:'someDate'}}))
 */
import React, {useEffect, useContext} from 'react'
import {useHistory} from 'react-router-dom'
//context
import {Context} from 'context'

export default props => {
  //context
  const context = useContext(Context)
  //history
  let history = useHistory()
  //---------------------------------------------------------------------
  function update(event) {
    switch (event.type) {
      case 'native-navigator': //-----------------------Native navigator
        const {url, info} = event.detail
        history.push(url, {...info, type: 'native-navigator'})
        break
      case 'native-player-show': //---------------------Native player-show
        context.action.updateMediaPlayerStatus(true)
        context.action.updateRoomInfo(event.detail)
        break
      case 'native-reciveAuthToken': //-----------------Native reciveAuthToken
        context.action.updateToken(event.detail)
        alert('native-reciveAuthToken')
        alert(JSON.stringify(event.detail, null, 1))
        break
      case 'native-goLogin': //-------------------------Native goLogin
        alert(JSON.stringify(event.detail, null, 1))
        context.action.updatePopup('LOGIN')
        break
      case 'react-gnb-open': //-------------------------GNB 열기
        context.action.updateGnbVisible(true)
        break
      case 'react-gnb-close': //------------------------GNB 닫기
        context.action.updateGnbVisible(false)
        break

      default:
        break
    }
  }

  //---------------------------------------------------------------------
  //useEffect addEventListener
  useEffect(() => {
    /*----native----*/
    document.addEventListener('native-navigator', update) //완료
    document.addEventListener('native-player-show', update) //완료
    document.addEventListener('native-goLogin', update)
    document.addEventListener('native-reciveAuthToken', update)
    /*----react----*/
    document.addEventListener('react-gnb-open', update)
    document.addEventListener('react-gnb-close', update)
    return () => {
      /*----native----*/
      document.removeEventListener('native-navigator', update)
      document.removeEventListener('native-player-show', update)
      document.removeEventListener('native-goLogin', update)
      document.removeEventListener('native-reciveAuthToken', update)
      /*----react----*/
      document.removeEventListener('react-gnb-open', update)
      document.removeEventListener('react-gnb-close', update)
    }
  }, [])
  return <React.Fragment />
}
