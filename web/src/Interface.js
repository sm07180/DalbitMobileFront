/**
 * @file Interface.js
 * @brief Native,Windows ->React로 Interface
 * @notice
 * @code document.dispatchEvent(new CustomEvent('native-goLogin', {detail:{info:'someDate'}}))
 */
import React, {useEffect, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import _ from 'lodash'
//context
import {Context} from 'context'
//util
import Utility from 'components/lib/utility'

export default () => {
  //context
  const context = useContext(Context)
  //history
  let history = useHistory()
  //---------------------------------------------------------------------
  function update(event) {
    // alert(event.type)
    switch (event.type) {
      case 'native-navigator': //-----------------------Native navigator
        const {url, info} = event.detail
        history.push(url, {...info, type: 'native-navigator'})
        break
      case 'native-player-show': //---------------------Native player-show (IOS)
        /**
         * @report 쿠키파싱이잘되지않아서,roomNo받아서 다시load처리
         */
        //  let _ios = JSON.stringify(encodeURIComponent(event.detail))
        let _ios = event.detail
        alert(_ios)
        let _ios1 = decodeURIComponent(_ios)
        alert(_ios1)
        //_ios = encodeURIComponent(_ios)

        //_ios = JSON.stringify(_ios)
        //  alert(_ios)
        //console.log(_ios)

        document.cookie = 'native-player-info=' + _ios + ';'
        alert(decodeURIComponent(Utility.getCookie('native-player-info')))

        // _ios = decodeURIComponent(_ios)
        // alert(_ios)
        // _ios = JSON.parse(_ios)
        // alert(_ios)
        // _ios = JSON.stringify(_ios)
        // alert(_ios)

        context.action.updateMediaPlayerStatus(true)
        context.action.updateNativePlayer(event.detail)
        break
      case 'native-start': //---------------------------Native player-show (Android)
        const _android = JSON.stringify(event.detail)
        Utility.setCookie('native-player-info', _android, 100)
        context.action.updateMediaPlayerStatus(true)
        context.action.updateNativePlayer(event.detail)
        break
      case 'native-end': //-----------------------------Native end (Android)
        context.action.updateMediaPlayerStatus(false)
        //Utility.setCookie('native-player-info', '', -1)
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
