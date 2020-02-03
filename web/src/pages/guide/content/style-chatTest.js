/**
 * @file style-chatTest.js
 * @brief 채팅하기
 */
import React, {useState} from 'react'
import styled from 'styled-components'
import SocketClusterClient from 'socketcluster-client'

//socket 설정
let socketConfig = {
  socketServerPort: 8000,
  socketServerHost: '121.134.5.158',
  socketServerSecure: false, //true=https

  restServer: 'http://121.134.5.158:8000', //RESTful Server

  locale: {
    ko_kr: 'ko_kr',
    en_us: 'en_us',
    en_de: 'en_de',
    en_ca: 'en_ca',
    ja_jp: 'ja_jp',
    zh_cn: 'zh_cn',
    zh_tw: 'zh_tw'
  },

  channel: {
    //public 채널명
    publicChannelName: 'channel.public.dalbit',

    //private 채널명(채팅방)
    privateChannelName: 'channel.'
  },

  packet: {
    send: {
      PACKET_SEND_CHAT: 'chat', //채팅 메세지
      PACKET_SEND_USRES: 'users',
      PACKET_SEND_LOGIN: 'login',
      PACKET_SEND_LOGIN_TK: 'loginToken',
      PACKET_SEND_EMIT: 'emit'
    },
    recv: {
      PACKET_RECV_CHAT: 'chat', //채팅 메세지
      PACKET_RECV_USERS: 'users',
      PACKET_RECV_LOGIN: 'login',
      PACKET_RECV_LOGIN_TK: 'loginToken',
      PACKET_RECV_EMIT: 'emit',
      PACKET_RECV_TOKEN: 'token', //Ant Media Server Token
      PACKET_RECV_CONNECT: 'connect', //다른 접속자 접속 알림 메세지
      PACKET_RECV_DISCONNECT: 'disconnect' //다른 접속자 접속해제 알림 메세지
    }
  },

  event: {
    socket: {
      CONNECT: 'connect',
      SUBSCRIBE: 'subscribe',
      SUBSCRIBEFAIL: 'subscribeFail',
      UNSUBSCRIBE: 'unsubscribe',
      SUBSCRIBESTATECHANGE: 'subscribeStateChange',
      DISCONNECT: 'disconnect',
      ERROR: 'error',
      MESSAGE: 'message',

      CONNECTABORT: 'connectAbort',
      CLOSE: 'close',
      OPEN: 'open',
      CONNECTING: 'connecting',
      RAW: 'raw',
      KICKOUT: 'kickOut',
      AUTHSTATECHANGE: 'authStateChange',
      SUBSCRIBEREQUEST: 'subscribeRequest',
      AUTHENTICATE: 'authenticate',
      DEAUTHENTICATE: 'deauthenticate'
    },
    channel: {
      SUBSCRIBE: 'subscribe',
      SUBSCRIBEFAIL: 'subscribeFail',

      DROPOUT: 'dropOut',
      UNSUBSCRIBE: 'unsubscribe',
      SUBSCRIBESTATECHANGE: 'subscribeStateChange'
    }
  },

  log: {
    socket: true
  }
}

// /************************************************************/

let options = {
  path: '/socketcluster/',
  port: socketConfig.socketServerPort,
  hostname: socketConfig.socketServerHost,
  autoConnect: true,
  secure: socketConfig.socketServerSecure,
  rejectUnauthorized: false,
  connectTimeout: 10000, //milliseconds
  ackTimeout: 10000, //milliseconds
  channelPrefix: null,
  disconnectOnUnload: true, //Only necessary during debug if using a self-signed certificate
  multiplex: true,
  autoReconnectOptions: {
    initialDelay: 10000, //milliseconds
    randomness: 10000, //milliseconds
    multiplier: 1.5, //decimal
    maxDelay: 60000 //milliseconds
  },
  authEngine: null,
  codecEngine: null,
  subscriptionRetryOptions: {}

  //path: '/socketcluster' 이와같이 사용시에 접속정보를 아래와 같이 입력해 주어야 합니다.
  //query: {
  //    //data: JSON.stringify(joinUserJson('authToken', 'id', 'nk', 'sex', 'age', 'level', 'img', true, '')) //접속자 정보 셋팅
  //    data: JSON.stringify(joinUserInfo) //접속자 정보 셋팅
  //}
}

// let socket = SocketClusterClient.connect(options)

// if (socketConfig.log.socket) {
//   console.dir(socket)
// }

// socket.on(socketConfig.event.socket.CONNECT /*'connect'*/, function(status) {
//   var logStr = '[socket.connect]\n'

//   try {
//     logStr += 'isAuthenticated:' + status.isAuthenticated + '\n'
//     logStr += 'status: ' + JSON.stringify(status) + '\n'
//     $('#loginTokenLabel').html(status.isAuthenticated)
//   } catch (e) {
//     logStr += 'error: ' + status + '\n'
//     $('#loginTokenLabel').html('error')
//   }

//   console.warn(logStr)
//   $('#socketLabel').html(socketConfig.event.socket.CONNECT)
// })

const socket = SocketClusterClient.create(options)
// ;(() => {
//   socket.emit('init', {name: 'bella'})

//   socket.on('welcome', msg => {
//     console.log(msg)
//   })
// })()
export default () => {
  //---------------------------------------------------------------------
  return (
    <>
      <Content></Content>
    </>
  )
}
//---------------------------------------------------------------------
const Btn = styled.button`
  width: 100px;
  height: 40px;
  color: white;
  background-color: skyblue;
  margin-right: 10px;
`
const Content = styled.section``
