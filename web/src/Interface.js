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
    switch (event.type) {
      case 'native-navigator': //-----------------------Native navigator
        const {url, info} = event.detail
        history.push(url, {...info, type: 'native-navigator'})
        break
      case 'native-player-show': //---------------------Native player-show (IOS)
        // let _ios = {}
        // _ios.bjNickNm = event.detail.bjNickNm
        // _ios.roomNo = event.detail.roomNo
        // _ios.bjProfImg = event.detail.bjProfImg.thumb150x150
        // _ios.title = event.detail.title
        // _ios = JSON.stringify(_ios)

        const _ios = {
          roomNo: event.detail.roomNo,
          bjProfImg: event.detail.bjProfImg.thumb150x150,
          title: event.detail.title,
          bjNickNm: event.detail.bjNickNm
        }
        alert(JSON.stringify(_ios, null, 1))
        _ios = JSON.stringify(_ios)
        Utility.setCookie('native-player-info', _ios, 100)
        context.action.updateMediaPlayerStatus(true)
        context.action.updateNativePlayer(JSON.parse(_ios))
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
