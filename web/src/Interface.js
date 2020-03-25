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
        //(BJ)일경우 방송하기:방송중
        if (_.hasIn(event.detail, 'auth') && event.detail.auth === 3) {
          context.action.updateCastState(event.detail.roomNo)
        }
        const _ios = JSON.stringify(event.detail)
        Utility.setCookie('native-player-info', escape(encodeURIComponent(_ios)), 100)
        context.action.updateMediaPlayerStatus(true)
        context.action.updateNativePlayer(event.detail)
        break
      case 'native-start': //---------------------------Native player-show (Android)
        //(BJ)일경우 방송하기:방송중
        if (_.hasIn(event.detail, 'auth') && event.detail.auth === 3) {
          context.action.updateCastState(event.detail.roomNo)
        }
        //
        const _android = JSON.stringify(event.detail)
        Utility.setCookie('native-player-info', _android, 100)
        context.action.updateMediaPlayerStatus(true)
        context.action.updateNativePlayer(event.detail)
        break
      case 'native-end': //-----------------------------Native end (Android&iOS)
        context.action.updateMediaPlayerStatus(false)
        //방송종료
        context.action.updateCastState(false)
        //(BJ)일경우 방송하기:방송중
        context.action.updateCastState(null)
        //종료시
        // alert(JSON.stringify(event.detail))
        break
      case 'react-debug': //-------------------------GNB 열기
        const detail = event.detail
        /**
         * @example debug({title:'타이틀내용',msg:'메시지내용'})
         */
        context.action.alert(detail)
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
    document.addEventListener('react-debug', update)
    document.addEventListener('react-gnb-open', update)
    document.addEventListener('react-gnb-close', update)
    return () => {
      /*----native----*/
      document.removeEventListener('native-navigator', update)
      document.removeEventListener('native-player-show', update)
      document.removeEventListener('native-start', update) //진행중
      document.removeEventListener('native-end', update) //진행중
      /*----react----*/
      document.removeEventListener('react-debug', update)
      document.removeEventListener('react-gnb-open', update)
      document.removeEventListener('react-gnb-close', update)
    }
  }, [])
  return <React.Fragment />
}
