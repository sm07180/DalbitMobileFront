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
      case 'native-player-show': //---------------------Native player-show (IOS)
        context.action.updateMediaPlayerStatus(true)
        // context.action.updateRoomInfo(event.detail)
        break
      case 'native-start': //---------------------------Native player-show (Android)
        //  context.action.updateNativePlayer(event.detail)
        Utility.setCookie('native-player-info', 'native-start', 100)
        context.action.updateMediaPlayerStatus(true)
        break
      case 'native-end': //-----------------------------Native end
        context.action.updateMediaPlayerStatus(false)
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
    document.addEventListener('native-start', update) //진행중
    document.addEventListener('native-end', update) //진행중
    /*----react----*/
    document.addEventListener('react-gnb-open', update)
    document.addEventListener('react-gnb-close', update)
    return () => {
      /*----native----*/
      document.removeEventListener('native-navigator', update)
      document.removeEventListener('native-player-show', update)
      document.removeEventListener('native-start', update) //진행중
      document.removeEventListener('native-end', update) //진행중
      /*----react----*/
      document.removeEventListener('react-gnb-open', update)
      document.removeEventListener('react-gnb-close', update)
    }
  }, [])
  return <React.Fragment />
}
