/**
 * @file chat.js
 * @brief 채팅하기
 */
import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
import {Context} from 'context'
import Api from 'context/api'

const SocketClusterClient = require('socketcluster-client')
//socket object
let socket = null

//public subscribe object
let publicChannelHandle = null

//private subscribe object
let privateChannelHandle = null

const isServiceConfig = true
let socketConfig = null

let loginInfo = null

export const socketClusterDestory = (destorySocket, destoryChannel) => {
  if (destoryChannel != undefined && destoryChannel != '') {
    if (destoryChannel == socketConfig.channel.publicChannelName) {
      console.log('채널 해제')
      if (publicChannelHandle != null) {
        publicChannelHandle.unsubscribe()
        publicChannelHandle.destroy()
        publicChannelHandle = null
      }
    } else {
      if (privateChannelHandle != null) {
        privateChannelHandle.unsubscribe()
        privateChannelHandle.destroy()
        privateChannelHandle = null
      }
    }
  }
  if (destorySocket) {
    if (socket != null) {
      if (publicChannelHandle != null) {
        publicChannelHandle.unsubscribe()
        publicChannelHandle.destroy()
        publicChannelHandle = null
      }
      if (privateChannelHandle != null) {
        privateChannelHandle.unsubscribe()
        privateChannelHandle.destroy()
        privateChannelHandle = null
      }
      //socket.destroy()
      socket = null
    }
    //$('#loginTokenLabel').html('')
  }
}

export const scConnection = obj => {
  const setServiceConfig = () => {
    socketConfig.socketServerPort = 8000
    socketConfig.socketServerHost = 'devsv1.dalbitcast.com'
    socketConfig.socketServerSecure = true
    socketConfig.restServer = 'https://devsv1.dalbitcast.com:8000'
  }
  //socket 설정
  socketConfig = {
    socketServerPort: 8001,
    socketServerHost: '121.134.5.158',
    socketServerSecure: false, //true=https

    restServer: 'http://121.134.5.158:8001', //RESTful Server

    locale: {
      ko_KR: 'koKR',
      en_US: 'enUS'
    },

    channel: {
      publicChannelName: 'channel.public.dalbit'
    },

    packet: {
      send: {
        PACKET_SEND_CHAT: 'chat', //채팅 메세지
        PACKET_SEND_USRES: 'users',
        PACKET_SEND_LOGIN: 'login',
        PACKET_SEND_LOGIN_TK: 'loginToken',
        PACKET_SEND_EMIT: 'emit',
        PACKET_SEND_CHAT_END: 'chatEnd', //BJ/채팅종료
        PACKET_SEND_REQKICKOUT: 'reqKickOut', //강퇴
        PACKET_SEND_REQGIFDAL: 'reqGiftDal', //달선물
        PACKET_SEND_REQGRANT: 'reqGrant' //매니저 지정 / 해제
      },
      recv: {
        PACKET_RECV_CHAT: 'chat', //채팅 메세지
        PACKET_RECV_USERS: 'users',
        PACKET_RECV_LOGIN: 'login',
        PACKET_RECV_LOGIN_TK: 'loginToken',
        PACKET_RECV_EMIT: 'emit',
        PACKET_RECV_TIME: 'time', //서버시간
        PACKET_RECV_TOKEN: 'token', //Ant Media Server Token
        PACKET_RECV_CONNECT: 'connect', //다른 접속자 접속 알림 메세지
        PACKET_RECV_DISCONNECT: 'disconnect', //다른 접속자 접속해제 알림 메세지
        PACKET_RECV_CHAT_END: 'chatEnd', //BJ/채팅종료
        PACKET_RECV_BJRECONNECT: 'bjReconnect', //BJ 재접속 알림메세지 -> update 2020-02-20 김호겸
        PACKET_RECV_REQWELCOME: 'reqWelcome', // 인사말
        PACKET_RECV_REQKICKOUT: 'reqKickOut', // 강퇴
        PACKET_RECV_REQGIFDAL: 'reqGiftDal', // 달선물
        PACKET_RECV_REQGIFIMG: 'reqGiftImg', //이미지 선물
        PACKET_RECV_REQGUEST: 'reqGuest', // 게스트 초대/취소/승락/거절
        PACKET_RECV_REQFAN: 'reqFan', // 팬등록/해제
        PACKET_RECV_REQGOOD: 'reqGood', // 좋아요
        PACKET_RECV_REQBOOSTER: 'reqBooster', //부스터실행
        PACKET_RECV_REQNOTICE: 'reqNotice', //공지사항작성
        PACKET_RECV_REQSTORY: 'reqStory', //사연작성
        PACKET_RECV_REQCHANGECOUNT: 'reqChangeCount', //랭킹,좋아요 수
        PACKET_RECV_REQROOMCHANGETIME: 'reqRoomChangeTime', //채팅방 방송시간 변경
        PACKET_RECV_REQROOMCHANGEINFO: 'reqRoomChangeInfo', //채팅방 정보 변경
        PACKET_RECV_REQGRANT: 'reqGrant', //매니저 지정 / 해제
        PACKET_RECV_REQPLAYTOKEN: 'reqPLayToken', // playToken 생성 요청
        PACKET_RECV_REQMICON: 'reqMicOn', //마이크 On
        PACKET_RECV_REQMICOFF: 'reqMicOff', //마이크 Off
        PACKET_RECV_REQCALLING: 'reqCalling', // 통화중
        PACKET_RECV_REQENDCALL: 'reqEndCall' //통화 종료
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

    command: {
      CHATROOM_OUT_BJ: 'bjOut', //BJ방나감 - 구독해제(채팅방종료)
      CHATROOM_OUT: 'roomOut', //채팅방 종료 - 구독해제(채팅방종료)
      CHATROOM_OUT_END: 'roomExpectedOut', //서버에서 채팅방 종료 - expected_end_date
      CHATROOM_OUT_END_BJ: 'roomExceptionOut' //서버에서 채팅방 종료 - exception_date
    },

    log: {
      socket: true
    }
  }

  if (isServiceConfig) {
    setServiceConfig()
  }
  //console.log('context.customHeader = ' + context.customHeader)
  //ssocketClusterDestory(true)
  // /************************************************************/
  //const HeaderObj = context.customHeader
  let options = {
    path: '/socketcluster/?data=' + JSON.stringify({authToken: obj.token.authToken, memNo: obj.token.memNo, locale: obj.customHeader.locale}),
    //path: '/socketcluster/',
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
  console.table(options)
  socket = SocketClusterClient.connect(options)
  console.log('소켓 연결 시도 ')

  socket.on(socketConfig.event.socket.CONNECT /*'connect'*/, function(status) {
    if (socket.getState() === 'open') {
      if (window.location.pathname === '/') {
        // public 채널로 입장
        socketClusterBinding('channel.public.dalbit')
      }
    }

    var logStr = '[socket.connect]\n'
    try {
      logStr += 'isAuthenticated:' + status.isAuthenticated + '\n'
      logStr += 'status: ' + JSON.stringify(status) + '\n'
      //   $('#loginTokenLabel').html(status.isAuthenticated)
    } catch (e) {
      logStr += 'error: ' + status + '\n'
      //   $('#loginTokenLabel').html('error')
    }
    console.warn(logStr)
    //$('#socketLabel').html(socketConfig.event.socket.CONNECT)
  })

  socket.on(socketConfig.event.socket.SUBSCRIBE /*'subscribe'*/, function(channelname, data) {
    //channelname, {channel: "test"}
    var logStr = '[socket.subscribe]\n'
    logStr += 'channel: ' + channelname + '\n'
    logStr += 'data: ' + JSON.stringify(data) + '\n'
    console.warn(logStr)
  })
  ///// subscribeFail 구독(채팅방입장) 실패
  ///// 동 이벤트는 channelObj.on(socketConfig.event.channel.SUBSCRIBEFAIL,..) 채널의 subscribeFail 이벤트 발생후 발생됨
  ///// 따라서 어느 한곳에서 관련 처리를 해주면 됨
  socket.on(socketConfig.event.socket.SUBSCRIBEFAIL /*'subscribeFail'*/, function(message, channelname) {
    //SilentMiddlewareBlockedError: Action was silently blocked by subscribe middleware
    var logStr = '[socket.subscribeFail]\n'
    logStr += 'channel: ' + channelname + '\n'
    logStr += 'message: ' + message + '\n'
    console.warn(logStr)
    //$('#socketLabel').html(socketConfig.event.socket.SUBSCRIBEFAIL)
  })

  //접속 실패 후, 소켓 close
  socket.on(socketConfig.event.socket.CLOSE /*'close'*/, function(error) {
    var logStr = '[socket.close]\n'
    logStr += 'error.code: ' + error + '\n'
    console.warn(logStr)
  }) ///// channel unsubscribe
  ///// 동 이벤트는 channelObj.on(socketConfig.event.channel.UNSUBSCRIBE,..) 채널의 unsubscribe 이벤트 발생후 발생됨
  socket.on(socketConfig.event.socket.UNSUBSCRIBE /*'unsubscribe'*/, function(channelname, data) {
    //socket.unsubscribe(channelname);
    var logStr = '[socket.unsubscribe]\n'
    logStr += 'channel: ' + channelname + '\n'
    logStr += 'data: ' + data + '\n'
    console.warn(logStr)
  })

  ///// channel subscribe 상태 변경
  ///// 동 이벤트는 channelObj.on(socketConfig.event.channel.SUBSCRIBESTATECHANGE,..) 채널의 subscribeFail 이벤트 발생후 발생됨
  ///// 따라서 어느 한곳에서 관련 처리를 해주면 됨
  socket.on(socketConfig.event.socket.SUBSCRIBESTATECHANGE /*'subscribeStateChange'*/, function(data) {
    //{"channel":"public.channel","oldState":"subscribed","newState":"unsubscribed"}
    //{"channel":"public.channel","oldState":"subscribed","newState":"pending"}
    //{"channel":"public.channel","oldState":"pending","newState":"subscribed","subscriptionOptions":{"channel":"public.channel"}}
    var logStr = '[socket.subscribeStateChange]\n'
    logStr += 'data: ' + JSON.stringify(data) + '\n'
    console.warn(logStr)
    //$('#socketLabel').html(socketConfig.event.socket.SUBSCRIBESTATECHANGE)
    //receiveMessageData(JSON.parse(data))
  })

  /////socket 접속 실패
  socket.on(socketConfig.event.socket.DISCONNECT /*'disconnect'*/, function(code, msg) {
    var logStr = '[socket.disconnect]\n'
    logStr += 'error.code: ' + code + '\n'
    logStr += 'error.msg: ' + msg + '\n'
    console.warn(logStr)
    //$('#socketLabel').html(socketConfig.event.socket.DISCONNECT)
  })

  //접속 실패 후, 소켓 close 후, 에러내용 표시
  socket.on(socketConfig.event.socket.ERROR /*'error'*/, function(err) {
    //throw 'Socket error - ' + err;
    var logStr = '[socket.error]\n'
    logStr += 'error: ' + err + '\n'
    console.warn(logStr)
    //$('#socketLabel').html(socketConfig.event.socket.ERROR)
  })

  //접속 실패 (연결중 연결 실패시에도 포함)
  socket.on(socketConfig.event.socket.CONNECTABORT /*'connectAbort'*/, function(data) {
    var logStr = '[socket.connectAbort]\n'
    logStr += 'data: ' + data + '\n'
    console.warn(logStr)
  })

  //접속 실패 후, 소켓 close
  socket.on(socketConfig.event.socket.CLOSE /*'close'*/, function(error) {
    var logStr = '[socket.close]\n'
    logStr += 'error.code: ' + error + '\n'
    console.warn(logStr)
  })

  //접속 실패 후, 재접속 시도
  socket.on(socketConfig.event.socket.CONNECTING /*'connecting'*/, function(data) {
    var logStr = '[socket.connecting]\n'
    logStr += 'data: ' + data + '\n'
    console.warn(logStr)
  })

  socket.on(socketConfig.event.socket.RAW /*'raw'*/, function(data) {
    var logStr = '[socket.raw]\n'
    logStr += 'data: ' + data + '\n'
    console.warn(logStr)
  })

  socket.on(socketConfig.event.socket.KICKOUT /*'kickOut'*/, function(data) {
    var logStr = '[socket.kickOut]\n'
    logStr += 'data: ' + data + '\n'
    console.warn(logStr)
  })

  socket.on(socketConfig.event.socket.AUTHSTATECHANGE /*'authStateChange'*/, function(data) {
    var logStr = '[socket.authStateChange]\n'
    try {
      logStr += 'oldState: ' + data.oldState + '\n'
      logStr += 'newState: ' + data.newState + '\n'
      logStr += 'signedAuthToken:' + data.signedAuthToken + '\n'
      logStr += 'authToken: ' + JSON.stringify(data.authToken) + '\n'
    } catch (e) {
      logStr += e + '\n'
    }
    console.warn(logStr)
    //$('#socketLabel').html(socketConfig.event.socket.AUTHSTATECHANGE)
  })

  //channel subscribe 요청
  socket.on(socketConfig.event.socket.SUBSCRIBEREQUEST /*'subscribeRequest'*/, function(channel) {
    var logStr = '[socket.subscribeRequest]\n'
    logStr += 'channel: ' + channel + '\n'
    console.warn(logStr)
  })

  socket.on(socketConfig.event.socket.AUTHENTICATE /*'authenticate'*/, function(data) {
    var logStr = '[socket.authenticate]\n'
    logStr += 'data: ' + data + '\n'
    console.warn(logStr)
  })

  socket.on(socketConfig.event.socket.DEAUTHENTICATE /*'deauthenticate'*/, function(data) {
    var logStr = '[socket.deauthenticate]\n'
    logStr += 'data: ' + data + '\n'
    console.warn(logStr)
  })

  socket.on(socketConfig.event.socket.MESSAGE /*'message'*/, function(data) {
    /*
1. 
[socket.messages]
event: undefined
data: {"rid":1,"data":{"id":"nfYzknO9xCbxGEBTAAAE","pingTimeout":20000,"isAuthenticated":false}}
or
[socket.messages]
event: undefined
data: {"rid":1,"data":{"id":"diQQFZBaErkJiGW-AAAH","pingTimeout":20000,"isAuthenticated":true}}

1-1.
[socket.authStateChange]
oldState: unauthenticated
newState: authenticated
signedAuthToken:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aWQiOiIxMTU3OTYxMTU5NTk5NzY3IiwibW5vIjoiMTE1NzkxMTY1OTU5OTc2NyIsImxvY2FsZSI6ImtvX2tyIiwiY2hhbm5lbCI6InB1YmxpYy5jaGFubmVsIiwiaWF0IjoxNTc5NjcyNjEyLCJleHAiOjE1Nzk3NTkwMTJ9.sfKJyLZ4nxV_yS_8uEaj2Bo5v2remBdNdGSIdsWJZNM
authToken: {"authToken":"1157961159599767","memNo":"1157911659599767","locale":"koKR","channel":"public.channel","iat":1579672612,"exp":1579759012}

1-2.
[socket.authenticate]
data: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aWQiOiIxMTU3OTYxMTU5NTk5NzY3IiwibW5vIjoiMTE1NzkxMTY1OTU5OTc2NyIsImxvY2FsZSI6ImtvX2tyIiwiY2hhbm5lbCI6InB1YmxpYy5jaGFubmVsIiwiaWF0IjoxNTc5NjcyNjEyLCJleHAiOjE1Nzk3NTkwMTJ9.sfKJyLZ4nxV_yS_8uEaj2Bo5v2remBdNdGSIdsWJZNM

2.
[socket.connect]
isAuthenticated:false
status: {"id":"nfYzknO9xCbxGEBTAAAE","pingTimeout":20000,"isAuthenticated":false,"authToken":null}
or
[socket.connect]
isAuthenticated:true
status: {"id":"diQQFZBaErkJiGW-AAAH","pingTimeout":20000,"isAuthenticated":true,"authToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aWQiOiIxMTU3OTYxMTU5NTk5NzY3IiwibW5vIjoiMTE1NzkxMTY1OTU5OTc2NyIsImxvY2FsZSI6ImtvX2tyIiwiY2hhbm5lbCI6InB1YmxpYy5jaGFubmVsIiwiaWF0IjoxNTc5NjcyNjEyLCJleHAiOjE1Nzk3NTkwMTJ9.sfKJyLZ4nxV_yS_8uEaj2Bo5v2remBdNdGSIdsWJZNM"}

3.
[socket.subscribeRequest]
channel: channel.public.dalbit
x.
[socket.messages]
event: undefined
data: {"rid":2}

4.
[channel:subscribeStateChange]
channel: channel.public.dalbit
data: {"channel":"channel.public.dalbit","oldState":"pending","newState":"subscribed","subscriptionOptions":{"channel":"channel.public.dalbit"}}

5.
[channel:subscribe]
channel: channel.public.dalbit

6.
[socket.subscribeStateChange]
data: {"channel":"channel.public.dalbit","oldState":"pending","newState":"subscribed","subscriptionOptions":{"channel":"channel.public.dalbit"}}

7.
[socket.subscribe]
channel: channel.public.dalbit
data: {"channel":"channel.public.dalbit"}

8.
[socket.messages]
event: #publish
channel: channel.public.dalbit
cmd: connect
authToken: 11579659599767
id: 010-1234-9090
nk: 달빛DJ
locale: koKR
login: true
msg: 

9.
[channel:watch]
channel: channel.public.dalbit
data: {
  "user": {
      "authToken":"1234567890",
      "mmemNono":"1234567890",
      "locale":"koKR",
      "id":"1234567890",
      "nk":"1234567890",
      "sex":"",
      "age":"",
      "level":"",
      "grade":"",
      "login":false
  },
  "connect":{"count":16},
  "cmd":"connect",
  "msg":"",
  "conTime":"2020-01-22 14:46:03",
  "msgTime":"2020-01-22 14:46:07",
  "server":"server.chat.01"
}

x.
[socket.messages] -- login (success)
event: undefined
data: {"rid":3,"data":true}

x.
sendMessage emit login success: true

x.
[socket.messages] -- login (fail)
event: undefined
data: {"rid":6,"error":"Authentication failed"}

x.
sendMessage emit login error Authentication failed

x.
[socket.authStateChange] -- token
oldState: unauthenticated
newState: authenticated
signedAuthToken:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aWQiOiIxMTU3OTYxMTU5NTk5NzY3IiwibW5vIjoiMTE1NzkxMTY1OTU5OTc2NyIsImxvY2FsZSI6ImtvX2tyIiwiY2hhbm5lbCI6InB1YmxpYy5jaGFubmVsIiwiaWF0IjoxNTc5NjcyNjEyLCJleHAiOjE1Nzk3NTkwMTJ9.sfKJyLZ4nxV_yS_8uEaj2Bo5v2remBdNdGSIdsWJZNM
authToken: {"authToken":"1157961159599767","memNo":"1157911659599767","locale":"koKR","channel":"public.channel","iat":1579672612,"exp":1579759012}

x.
[socket.authenticate]
data: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aWQiOiIxMTU3OTYxMTU5NTk5NzY3IiwibW5vIjoiMTE1NzkxMTY1OTU5OTc2NyIsImxvY2FsZSI6ImtvX2tyIiwiY2hhbm5lbCI6InB1YmxpYy5jaGFubmVsIiwiaWF0IjoxNTc5NjcyNjEyLCJleHAiOjE1Nzk3NTkwMTJ9.sfKJyLZ4nxV_yS_8uEaj2Bo5v2remBdNdGSIdsWJZNM

x.
[socket.messages]
event: undefined
data: {"rid":7,"data":true}

x.
sendMessage emit loginToken success: true

메세지전송실패 (로그인 안되어 있음)
[socket.messages]
event: undefined
data: {"rid":3,"error":{"message":"Action was silently blocked by publishIn middleware","name":"SilentMiddlewareBlockedError","type":"publishIn"}}

socket.js:733 sendMessage socket error SilentMiddlewareBlockedError: Action was silently blocked by publishIn middleware

메세지전송성공
[socket.messages]
event: #publish
channel: channel.public.dalbit
cmd: chat
authToken: 11579659599767
id: 010-1234-9090
nk: 달빛DJ
locale: koKR
login: true
msg: 11111111111111

[channel:watch]
channel: channel.public.dalbit
data: {"cmd":"chat","chat":{"memNo":""},"msg":"11111111111111","user":{"authToken":"11579659599767","memNo":"11579659599767","locale":"koKR","id":"010-1234-9090","nk":"달빛DJ","sex":"m","age":"1980-11-23","level":0,"grade":"0","login":true},"conTime":"2020-01-22 15:13:57","msgTime":"2020-01-22 15:14:06","server":"server.chat.01"}

[socket.messages]
event: undefined
data: {"rid":6}

sendMessage socket: {"cmd":"chat","chat":{"memNo":""},"msg":"11111111111111"}

*/
    //console.log(JSON.stringify(data))
    var logStr = '[socket.messages]\n'
    try {
      var dataObj = JSON.parse(data)
      if (dataObj.event != undefined) {
        logStr += 'event: ' + dataObj.event + '\n'

        //소켓접속실패
        if (dataObj.event == '#disconnect') {
          logStr += data + '\n'
          logStr += dataObj.data + '\n'
          return
        }
        if (dataObj.event == '#setAuthToken') {
          logStr += dataObj.data + '\n'
          return
        }
        if (dataObj.event == '#removeAuthToken') {
          logStr += dataObj.data + '\n'
          return
        }
        /*if (dataObj.event == 'subscribeFail') {
                  logStr += 'channel: ' + dataObj.channel + '\n';
                  logStr += 'channel: ' + dataObj.data + '\n';
                  return;
              }*/

        if (dataObj.event == 'time') {
          logStr += 'cmd: ' + dataObj.data.cmd + '\n'
          logStr += 'time: ' + dataObj.data.time + '\n'
          //return;
        } else if (dataObj.event == 'chat') {
          //logStr += 'channel: ' + dataObj.channel + '\n';
          logStr += 'cmd: ' + dataObj.data.cmd + '\n'
          //logStr += 'authToken: ' + dataObj.data.user.authToken + '\n';
          logStr += 'id: ' + dataObj.data.user.id + '\n'
          logStr += 'nk: ' + dataObj.data.user.nk + '\n'
          logStr += 'locale: ' + dataObj.data.user.locale + '\n'
          logStr += 'login: ' + dataObj.data.user.login + '\n'
          logStr += 'msg: ' + dataObj.data.msg + '\n'
        } else if (dataObj.event == 'emit') {
          //logStr += 'channel: ' + dataObj.channel + '\n';
          logStr += 'cmd: ' + dataObj.data.cmd + '\n'
          //logStr += 'authToken: ' + dataObj.data.user.authToken + '\n';
          logStr += 'id: ' + dataObj.data.user.id + '\n'
          logStr += 'nk: ' + dataObj.data.user.nk + '\n'
          logStr += 'locale: ' + dataObj.data.user.locale + '\n'
          logStr += 'login: ' + dataObj.data.user.login + '\n'
          logStr += 'msg: ' + dataObj.data.recvMsg.msg + '\n'
        } else {
          logStr += 'channel: ' + dataObj.data.channel + '\n'
          logStr += 'cmd: ' + dataObj.data.data.cmd + '\n'
          //logStr += 'authToken: ' + dataObj.data.data.user.authToken + '\n';
          logStr += 'id: ' + dataObj.data.data.user.id + '\n'
          logStr += 'nk: ' + dataObj.data.data.user.nk + '\n'
          logStr += 'locale: ' + dataObj.data.data.user.locale + '\n'
          logStr += 'login: ' + dataObj.data.data.user.login + '\n'
          logStr += 'msg: ' + dataObj.data.data.recvMsg.msg + '\n'
        }
        //if(JSON.parse(data).event === '#publish' || JSON.parse(data).event === '#publish')
        console.log('receiveMessageData')
        receiveMessageData(JSON.parse(data))
      } else {
        /*if (dataObj.type == 'subscribe') {
                  //{"rid":5,"error":{"message":"Action was silently blocked by subscribe middleware","name":"SilentMiddlewareBlockedError","type":"subscribe"}}
                  //logStr += 'rid: ' + dataObj.rid + '\n';
                  logStr += 'error.type: ' + dataObj.error.type + '\n';
                  logStr += 'error.name: ' + dataObj.error.name + '\n';
                  logStr += 'error.message: ' + dataObj.error.message + '\n';
              } else*/ if (
          dataObj.data &&
          dataObj.data.cmd == 'login'
        ) {
          //{"rid":2,"data":{"cmd":"login","params":{},"msg":{"authToken":"11579140995534","memNo":"11579140995534","channel":"public.channel","id":"id_11579140995534","error":null,"success":true},"user":{"authToken":"11579140995534","memNo":"11579140995534","id":"id_11579140995534","nk":"nk_11579140995534","sex":"sex_11579140995534","age":"age_11579140995534","level":"level_11579140995534"}}}
          //logStr += 'rid: ' + dataObj.rid + '\n';
          logStr += 'login: ' + JSON.stringify(dataObj.data.recvMsg.msg) + '\n'
        } else if (dataObj.error && dataObj.error.type == 'subscribe') {
          /*{
                      "rid":2,
                      "error":{
                          "message":"Action was silently blocked by subscribe middleware",
                          "name":"SilentMiddlewareBlockedError",
                          "type":"subscribe",
                          "errJson":{
                              "error":true,
                              "code":4600,"event":"","socket":"KJNzXzyEs_QHJCZ0AAAE","ip":"121.134.5.158","channel":"public.channel",
                              "user":{
                                  "authToken":"11578531294874","memNo":"11578531294874","id":"id_11578531294874","nk":"nk_11578531294874","sex":"sex_11578531294874","age":"age_11578531294874","level":"level_11578531294874"
                              },
                              "message":""
                          }
                      }
                  }*/
          logStr += 'error.type: ' + dataObj.error.type + '\n'
          logStr += 'error.code: ' + dataObj.error.errJson.code + '\n'
          logStr += 'error.string: ' + dataObj.error.errJson.message + '\n'
          logStr += 'error.name: ' + dataObj.error.name + '\n'
          logStr += 'error.message: ' + dataObj.error.message + '\n'
          logStr += 'error.channel: ' + dataObj.error.errJson.channel + '\n'
        } else {
          //{"rid":1,"data":{"id":"6GsffXOj8DPfBJUvAAAA","pingTimeout":20000,"isAuthenticated":false}}
          logStr += 'event: undefined\n'
          logStr += 'data: ' + data + '\n'
        }
      }
    } catch (e) {
      logStr += 'data: ' + data + '\n'
      logStr += 'error: ' + e + '\n'
    }
    console.warn(logStr)
  })

  //서버시간 수신
  socket.on(socketConfig.packet.recv.PACKET_RECV_TIME, function(data) {
    console.warn(data.time)
    receiveMessageData(data)
  })

  //Ant Media Serber 발행 Token 정보
  socket.on(socketConfig.packet.recv.PACKET_RECV_TOKEN, function(data) {
    alert(JSON.stringify(data))
    receiveMessageData(data)
  })
  socket.on(socketConfig.packet.recv.PACKET_RECV_CHAT_END, function(data) {
    alert(JSON.stringify(data))
    receiveMessageData(data)
  })
  socket.on(socketConfig.packet.recv.PACKET_RECV_BJRECONNECT, function(data) {
    receiveMessageData(data)
  })
  socket.on(socketConfig.packet.recv.PACKET_RECV_REQWELCOME, function(data) {
    receiveMessageData(data)
  })
  socket.on(socketConfig.packet.recv.PACKET_RECV_REQKICKOUT, function(data) {
    receiveMessageData(data)
  })
  socket.on(socketConfig.packet.recv.PACKET_RECV_REQGIFDAL, function(data) {
    receiveMessageData(data)
  })
  socket.on(socketConfig.packet.recv.PACKET_RECV_REQGIFIMG, function(data) {
    receiveMessageData(data)
  })
  socket.on(socketConfig.packet.recv.PACKET_RECV_REQGUEST, function(data) {
    receiveMessageData(data)
  })
  socket.on(socketConfig.packet.recv.PACKET_RECV_REQFAN, function(data) {
    receiveMessageData(data)
  })
  socket.on(socketConfig.packet.recv.PACKET_RECV_REQGOOD, function(data) {
    receiveMessageData(data)
  })
  socket.on(socketConfig.packet.recv.PACKET_RECV_REQBOOSTER, function(data) {
    receiveMessageData(data)
  })
  socket.on(socketConfig.packet.recv.PACKET_RECV_REQNOTICE, function(data) {
    receiveMessageData(data)
  })
  socket.on(socketConfig.packet.recv.PACKET_RECV_REQSTORY, function(data) {
    receiveMessageData(data)
  })
  socket.on(socketConfig.packet.recv.PACKET_RECV_REQCHANGECOUNT, function(data) {
    receiveMessageData(data)
  })
  socket.on(socketConfig.packet.recv.PACKET_RECV_REQROOMCHANGETIME, function(data) {
    receiveMessageData(data)
  })
  socket.on(socketConfig.packet.recv.PACKET_RECV_REQROOMCHANGEINFO, function(data) {
    receiveMessageData(data)
  })
  socket.on(socketConfig.packet.recv.PACKET_RECV_REQGRANT, function(data) {
    receiveMessageData(data)
  })
  socket.on(socketConfig.packet.recv.PACKET_RECV_REQPLAYTOKEN, function(data) {
    receiveMessageData(data)
  })
  socket.on(socketConfig.packet.recv.PACKET_RECV_REQMICON, function(data) {
    receiveMessageData(data)
  })
  socket.on(socketConfig.packet.recv.PACKET_RECV_REQMICOFF, function(data) {
    receiveMessageData(data)
  })
  socket.on(socketConfig.packet.recv.PACKET_RECV_REQCALLING, function(data) {
    receiveMessageData(data)
  })
  socket.on(socketConfig.packet.recv.PACKET_RECV_REQENDCALL, function(data) {
    receiveMessageData(data)
  })
}

// var event = new CustomEvent('socket-receiveMessageData', { detail: elem.dataset.time });
// document.dispatchEvent(event)
// 서버로 받은 데이터
export const receiveMessageData = recvData => {
  console.log('서버로 부터 받은 데이터 = ' + recvData)
  if (recvData && recvData.data.channel !== 'channel.public.dalbit' && recvData.data.data.cmd === 'chatEnd') {
    if (recvData.data.data.recvMsg.msg === 'bjOut') {
      socketClusterDestory(false, recvData.data.channel)
      window.location.replace('https://' + window.location.hostname)
    }
  }
  if (recvData && recvData.data.channel !== 'channel.public.dalbit') {
    const destroyEvent = new CustomEvent('socketSendData', {detail: recvData.data})
    document.dispatchEvent(destroyEvent)
  }
}

// export async function retoken(obj) {
//   const {rooomNo} = obj
//   const res = await Api.broadcast_reToken({data: {roomNo: rooomNo}})
//   //Error발생시
//   if (res.result === 'fail') {
//     console.log(res.message)
//     return
//   }

//   console.log(res.data)
// }

export const socketClusterBinding = (channel, Info) => {
  //소켓 접속 완료 상테 (connecting - 접속중 , close - 소켓 종료)
  //socketClusterDestory(false, channel)
  // var isSocketConnected = false
  // var scState = ''
  // try {
  //   scState = socket.getState() || 'nothing' //connecting, open, closed
  //   if (scState == 'open') {
  //     isSocketConnected = true
  //   }
  // } catch (e) {
  //   scState = 'nothing'
  // }
  // if (!isSocketConnected) {
  //   console.log('socket 서버 접속이 되지 않았습니다. (접속상태:' + scState + ')')
  //   //return false
  // }

  //socketReload = socket
  if (socket != null) {
    if (socket.state === 'open') {
      if (channel == '') {
        alert('채널이 없습니다.')
        return
      }
      if (window.location.pathname === '/') {
        publicChannelHandle = socketChannelBinding(publicChannelHandle, channel)
      } else {
        privateChannelHandle = socketChannelBinding(privateChannelHandle, channel)
      }
    } else {
      console.warn('소켓 상태 = ' + socket.state + ',' + channel + privateChannelHandle)
      if (window.location.pathname !== '/' && channel) {
        setTimeout(() => {
          privateChannelHandle = socketChannelBinding(privateChannelHandle, channel)
        }, 500)
      }
    }
  } else {
    //socket = socketReload
    if (socket != null) {
      if (window.location.pathname !== '/') {
        privateChannelHandle = socketChannelBinding(privateChannelHandle, channel)
      }
    } else {
      //  console.warn('소켓 null')
      if (Info) scConnection(Info)
      if (socket.state === 'open') privateChannelHandle = socketChannelBinding(privateChannelHandle, channel)
    }
  }
}

export const socketChannelBinding = (channelObj, channelObjName) => {
  if (channelObj == null) {
    socket.subscribe(channelObjName)
    console.log(channelObjName + '채널 입장')
    return channelObj
    //console.log('채널 입장')
  }
}
export const scDestory = () => {
  console.log('해제 전 소켓 상태 = ' + socket.getState())
  socket.disconnect()

  alert('소켓 해제')
  console.log('해제 후 소켓 상태 = ' + socket.getState())
}
export const SendMessageChat = objChat => {
  const params = {
    //memNo: objChat.bjMemNo,
    memNo: ''
    // isFan: objChat.isFan,
    // auth: objChat.auth,
    // ctrlRole: objChat.ctrlRole
  }
  console.log('sendMessage = ' + JSON.stringify(params))
  sendMessage.socket(objChat.roomNo, socketConfig.packet.send.PACKET_SEND_CHAT, params, objChat.msg)
}

// 방송방 종료
export const SendMessageChatEnd = objChatInfo => {
  const params = {
    //memNo: objChat.bjMemNo,
    memNo: ''
  }
  console.log('sendMessage = ' + JSON.stringify(params))
  sendMessage.socket(objChatInfo.roomNo, socketConfig.packet.send.PACKET_SEND_CHAT_END, params, objChatInfo.auth === 3 ? 'bjOut' : 'roomOut')
}
//강퇴
export const SendMessageKickout = objChatInfo => {
  const params = {
    memNo: ''
  }
  console.log('sendMessage = ' + JSON.stringify(params))
  sendMessage.socket(objChatInfo.roomNo, socketConfig.packet.send.PACKET_SEND_REQKICKOUT, params, '')
}

//매니저 지정, 해제 매니저 지정시에는 sendMsg 값을 1 로, 매니저 해제시에는 sendMsg 값을 0 으로 설정하면 됩니다.
export const SendMessageReqGrant = objChatInfo => {
  const params = {
    memNo: objChatInfo.memNo
  }
  console.log('sendMessage = ' + JSON.stringify(params))
  sendMessage.socket(objChatInfo.roomNo, socketConfig.packet.send.PACKET_SEND_REQKICKOUT, params, objChatInfo.managerType)
}

export const sendMessageJson = function(cmd, params, msg) {
  if (cmd == /*'login'*/ socketConfig.packet.send.PACKET_SEND_LOGIN) {
    return {
      cmd: cmd,
      login: params, //user
      sendMsg: msg //''
    }
  } else if (cmd == /*'loginToken'*/ socketConfig.packet.send.PACKET_SEND_LOGIN_TK) {
    return {
      cmd: cmd,
      loginToken: params, //user
      sendMsg: msg //''
    }
  } else if (cmd == /*'emit'*/ socketConfig.packet.send.PACKET_SEND_EMIT) {
    return {
      cmd: cmd,
      emit: params, //self
      sendMsg: msg //''
    }
  } else if (cmd == /*'chat'*/ socketConfig.packet.send.PACKET_SEND_CHAT) {
    return {
      cmd: cmd,
      chat: params, //self
      sendMsg: msg //''
    }
  } else if (cmd == /*'chat'*/ socketConfig.packet.send.PACKET_SEND_CHAT_END) {
    return {
      cmd: cmd,
      chat: params, //self
      sendMsg: msg //''
    }
  } else if (cmd == /*'chat'*/ socketConfig.packet.send.PACKET_SEND_REQKICKOUT) {
    return {
      cmd: cmd,
      chat: params, //self
      sendMsg: msg //''
    }
  } else if (cmd == /*'chat'*/ socketConfig.packet.send.PACKET_SEND_REQGRANT) {
    return {
      cmd: cmd,
      chat: params, //self
      sendMsg: msg //''
    }
  }
}
export const sendMessage = {
  handle: function(handle, type, param, msg) {
    // param.memNo = $('#partnerNo').val();
    // param.memFan = $('#memFan').val();
    // param.memRole = $('#memRole').val();
    // param.memAuthority = $('#memAuthority').val();
    //var msgJson = sendMessageJson(type, param, msg)
    //handle(publicChannelHandle,privateChannelHandle) 체널에 전체 메세지가 전송됨 (다른 채널에는 메세지 전송 안됨)
    /*{
      cmd: 'chat',
      chat: {
          memNo: '회원SEQ'
      },
      sendMsg: 'message'
      }*/
    // handle.publish(msgJson, function(err) {
    //   if (err) {
    //     console.error('sendMessage handle error ' + err)
    //   } else {
    //     console.log('sendMessage handle: ' + JSON.stringify(msgJson))
    //   }
    // })
  },
  socket: function(channel, type, param, msg) {
    // param.memNo = ''
    // param.isFan = ''
    // param.roomRole = ''
    // param.roleRight = ''
    var msgJson = sendMessageJson(type, param, msg)
    //해당 체널에 전체 메세지가 전송됨 (다른 채널에는 메세지 전송 안됨) ===== subscribe 구독하지 않아도 메세지 전송은 된다!!!
    /*{
      cmd: 'chat',
      chat: {
          memNo: '회원SEQ'
      },
      sendMsg: 'message'
      }*/
    socket.publish(channel, msgJson, function(err) {
      if (err) {
        console.error('sendMessage socket error ' + err)
      } else {
        console.log('sendMessage socket: ' + JSON.stringify(msgJson))
      }
    })
  },
  emit: function(type, param, msg) {
    //param.memNo = $('#partnerNo').val();
    // param.memFan = $('#memFan').val();
    // param.memRole = $('#memRole').val();
    // param.memAuthority = $('#memAuthority').val();
    //-전송되는 publicChannelName 채널은 서버에서 정의된 채널로 동작됨
    //-즉, 메세지가 전송되는 채널은 클라이언트에서 정의할수 없고 서버에서 정의된 채널로 메세지가 전송됨
    //-selfMsg=true 이면 다른 접속자에게 메세지 전송 없이, 자기 자신의 정보 변경을 위한 자기 자신에게만 보내는 메세지
    /*{
          cmd: 'emit',
          emit: false,
          sendMsg: 'message'
      }*/
    socket.emit('chat', sendMessageJson(type, param, msg), function(err, data) {
      if (err) {
        console.error('sendMessage emit error ' + err)
      } else {
        if (data.success) {
          //서버에서 필요한 작업 성공
          console.log('sendMessage emit: ' + JSON.stringify(data))
        } else {
          console.log('sendMessage emit: ' + JSON.stringify(data))
        }
      }
    })
  },
  loginToken: function(user) {
    /*{
          cmd: 'loginToken',
          loginToken: {
          authToken: 'JWT토큰',
          memNo: '회원SEQ',
          locale: 'koKR'
          }
          sendMsg: ''
      }*/
    socket.emit('loginToken', sendMessageJson(socketConfig.packet.send.PACKET_SEND_LOGIN_TK, user, ''), function(err, success) {
      if (err) {
        console.error('sendMessage emit loginToken error ' + err)
        //$('#loginTokenLabel').html(err)
      } else {
        //$('#loginTokenLabel').html(success)
        if (success) {
          //서버에서 필요한 작업 성공
          console.log('sendMessage emit loginToken success: ' + success)
        } else {
          console.log('sendMessage emit loginToken fail: ' + success)
        }
      }
    })
  },
  login: function(user) {
    /*{
      cmd: 'login',
      login: {
          authToken: 'JWT토큰',
          memNo: '회원SEQ',
          locale: 'koKR'
      }
      msg: ''
      }*/
    socket.emit('login', sendMessageJson(socketConfig.packet.send.PACKET_SEND_LOGIN, user, ''), function(err, success) {
      if (err) {
        console.error('sendMessage emit login error ' + err)
        //$('#socketLoginLabel').html(err)
      } else {
        //$('#socketLoginLabel').html(success)
        if (success) {
          //서버에서 필요한 작업 성공
          console.log('sendMessage emit login success: ' + success)
        } else {
          console.log('sendMessage emit login fail: ' + success)
        }
      }
    })
  }
}
export default props => {
  //---------------------------------------------------------------------
  const context = useContext(Context)
  useEffect(() => {
    loginInfo = context
    //console.warn('소켓 처음 연결 = ' + loginInfo.isLogin ? '로그인' : '비로그인' + '회원')
    //console.log('소켓 연결 토큰 값 = ' + JSON.stringify(loginInfo))

    scConnection(loginInfo)
  }, [])

  return (
    <>
      <Content>
        {/* <button onClick={() => scConnection(loginInfo)}>소켓 연결</button>
        <br></br>
        <button onClick={() => scDestory()}>소켓 해제</button>
        <br></br>
        <button onClick={() => socketClusterBinding('channel.public.dalbit')}>채널입장</button>
        <br></br>
        {/* <button onClick={() => socketClusterDestory(false, 'channel.public.dalbit')}>채널퇴장</button> */}
        {/* <br></br>
        <button onClick={() => SendMessageChat()}>채팅메세지(channel Pulblish)</button> */}
      </Content>
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
