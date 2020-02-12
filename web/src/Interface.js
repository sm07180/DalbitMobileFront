/**
 * @file Interface.js
 * @brief Native,Windows ->React로 Interface
 * @notice
 * @code document.dispatchEvent(new CustomEvent('native-goLogin', {detail:{info:'someDate'}}))
 */
import React, {useEffect, useContext} from 'react'
//context
import {Context} from 'context'

export default () => {
  //context
  const context = useContext(Context)
  //---------------------------------------------------------------------
  function update(event) {
    switch (event.type) {
      case 'native-reciveAuthToken': //-----------------Native reciveAuthToken
        alert(JSON.stringify(event.detail, null, 1))
        break
      case 'native-goLogin': //-------------------------Native goLogin
        alert(JSON.stringify(event.detail, null, 1))
        context.action.updatePopup('LOGIN')
        break
      case 'native-minium': //--------------------------Native minium
        alert(JSON.stringify(event.detail, null, 1))
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
    document.addEventListener('native-goLogin', update)
    document.addEventListener('native-minium', update)
    document.addEventListener('native-reciveAuthToken', update)
    /*----react----*/
    document.addEventListener('react-gnb-open', update)
    document.addEventListener('react-gnb-close', update)
    return () => {
      /*----native----*/
      document.removeEventListener('native-goLogin', update)
      document.removeEventListener('native-minium', update)
      document.removeEventListener('native-reciveAuthToken', update)
      /*----react----*/
      document.removeEventListener('react-gnb-open', update)
      document.removeEventListener('react-gnb-close', update)
    }
  }, [])
  return <React.Fragment />
}
