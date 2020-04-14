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
import Room, {RoomJoin} from 'context/room'
//util
import Utility from 'components/lib/utility'

export default () => {
  //context
  const context = useContext(Context)
  //history
  let history = useHistory()
  //
  //---------------------------------------------------------------------
  function update(event) {
    switch (event.type) {
      case 'native-push': //----------------------------Native push
        /**
         * @title 네이티브 푸쉬관련
         * @push_type
            1 : 방송방 [room_no]
            2 : 메인
            31 : 마이페이지>팬 보드
            32 : 마이페이지>내 지갑
            33 : 마이페이지>캐스트>캐스트 정보 변경 페이지
            34 : 마이페이지>알림>해당 알림 글
            35 : 마이페이지
            36 : 레벨 업 DJ 마이페이지 [mem_no]
            4 : 등록 된 캐스트
            5 : 스페셜 DJ 선정 페이지
            6 : 이벤트 페이지>해당 이벤트 [board_idx]
            7 : 공지사항 페이지 [board_idx]
         */
        let pushMsg = decodeURIComponent(event.detail)
        pushMsg = pushMsg.trim()
        // alert(pushMsg)
        pushMsg = JSON.parse(pushMsg)
        const {push_type} = pushMsg
        let room_no, mem_no
        //---------------------[분기처리시작]
        switch (push_type) {
          case '1': //-----------------방송방 [room_no]
            room_no = pushMsg.room_no
            RoomJoin(room_no)
            break
          case '2': //------------------메인
            window.location.href = '/'
            break
          case '31': //-----------------마이페이지>팬 보드
            mem_no = pushMsg.mem_no
            window.location.href = `/mypage/${mem_no}/fanboard`
            break
          case '32': //-----------------마이페이지>내 지갑
            mem_no = pushMsg.mem_no
            window.location.href = `/mypage/${mem_no}/wallet`
            break
          case '33': //-----------------마이페이지>캐스트>캐스트 정보 변경 페이지(미정)
            mem_no = pushMsg.mem_no
            window.location.href = `/mypage/${mem_no}/`
            break
          case '34': //-----------------마이페이지>알림>해당 알림 글
            mem_no = pushMsg.mem_no
            window.location.href = `/mypage/${mem_no}/alert`
            break
          case '35': //-----------------마이페이지
            mem_no = pushMsg.mem_no
            window.location.href = `/mypage/${mem_no}/`
            break
          case '4': //------------------등록 된 캐스트(미정)
            window.location.href = `/`
            break
          case '5': //------------------스페셜 DJ 선정 페이지(미정)
            window.location.href = `/`
            break
          case '6': //------------------이벤트 페이지>해당 이벤트 [board_idx](미정)
            window.location.href = `/`
            break
          case '7': //------------------공지사항 페이지 [board_idx](미정)
            window.location.href = `/`
            break
          default:
            //------------------기본값
            window.location.href = `/`
            break
        }
        //---------------------[분기처리끝]
        break
      case 'native-auth-check': //----------------------Native RoomCheck
        if (context.token.memNo === event.detail.memNo) {
          Room.setAuth(true)
        } else {
          Room.setAuth(false)
          //  alert(context.token.memNo + ' : ' + event.detail.memNo)
          window.location.href = '/login'
          // alert('native-auth-check가 맞지않습니다. 로그인으로 이동')
        }

        if (Room !== undefined && Room.roomNo !== undefined && Room.roomNo !== '') {
        }
        break
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
        Utility.setCookie('native-player-info', _ios, 100)
        context.action.updatePlayer(true)
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
        context.action.updatePlayer(true)

        context.action.updateMediaPlayerStatus(true)
        context.action.updateNativePlayer(event.detail)
        break
      case 'native-end': //-----------------------------Native End (Android&iOS)
        context.action.updatePlayer(false)

        context.action.updateMediaPlayerStatus(false)
        //방송종료
        context.action.updateCastState(false)
        //(BJ)일경우 방송하기:방송중
        context.action.updateCastState(null)
        //종료시
        //App에서 방송종료 알림경우
        if (Room !== undefined && Room.roomNo !== undefined && Room.roomNo !== '') {
          Room.setRoomNo('')
        }
        break
      case 'react-debug': //-------------------------GNB 열기
        const detail = event.detail
        /**
         * @example debug({title:'타이틀내용',msg:'메시지내용', callback: () => { alert('test')      }})
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
    document.addEventListener('native-start', update) //완료
    document.addEventListener('native-end', update) //완료
    document.addEventListener('native-push', update) //푸쉬관련
    document.addEventListener('native-auth-check', update) //방인증정보

    /*----react----*/
    document.addEventListener('react-debug', update)
    document.addEventListener('react-gnb-open', update)
    document.addEventListener('react-gnb-close', update)
    return () => {
      /*----native----*/
      document.removeEventListener('native-navigator', update)
      document.removeEventListener('native-player-show', update)
      document.removeEventListener('native-start', update)
      document.removeEventListener('native-end', update)
      document.removeEventListener('native-push', update)
      document.removeEventListener('native-auth-check', update)
      /*----react----*/
      document.removeEventListener('react-debug', update)
      document.removeEventListener('react-gnb-open', update)
      document.removeEventListener('react-gnb-close', update)
    }
  }, [])
  return <React.Fragment />
}
