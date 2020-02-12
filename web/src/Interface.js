/**
 * @file Interface.js
 * @brief Native,Windows ->React로 Interface
 * @notice
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
      case 'react-gnb-open': //-------------------------GNB 열기
        context.action.updateGnbVisible(true)
        break
      case 'react-gnb-close': //------------------------GNB 닫기
        context.action.updateGnbVisible(false)
        break
      case 'native-goLogin': //native
        console.log(event.detail)
        context.action.updatePopup('LOGIN')
        break
      default:
        break
    }
  }
  //---------------------------------------------------------------------
  //useEffect addEventListener
  useEffect(() => {
    document.addEventListener('native-goLogin', update)
    document.addEventListener('react-gnb-open', update)
    document.addEventListener('react-gnb-close', update)
    return () => {
      document.removeEventListener('native-goLogin', update)
      document.removeEventListener('react-gnb-open', update)
      document.removeEventListener('react-gnb-close', update)
    }
  }, [])
  return <React.Fragment />
}
