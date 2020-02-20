/**
 * @file chat.js
 * @brief 채팅하기
 */
import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
import {Context} from 'context'
const SocketClusterClient = require('socketcluster-client')
// import {Context} from 'context'
// import Api from 'context/api'

//socket object
let socket = null

//public subscribe object
let publicChannelHandle = null

//private subscribe object
let privateChannelHandle = null

const isServiceConfig = true
let socketConfig = null

let loginInfo = null

const socketClusterDestory = (destorySocket, destoryChannel) => {
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

const scConnection = obj => {
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
        PACKET_SEND_CHAT_END: 'chatEnd' //BJ/채팅종료
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
        PACKET_RECV_CHAT_END: 'chatEnd' //BJ/채팅종료
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

  // /************************************************************/

  let options = {
    path: '/socketcluster/?data=' + JSON.stringify({authToken: obj.memNo, memNo: obj.memNo, locale: 'koKR'}),
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

  alert('소켓 연결')
  socket.on(socketConfig.event.socket.CONNECT /*'connect'*/, function(status) {
    console.log(socket.getState())
    if (socket.getState() === 'open') {
      // 해당 채널로 입장
      socketClusterBinding('channel.public.dalbit')
    }
    var logStr = '[socket.connect]\n'
    // try {
    //   logStr += 'isAuthenticated:' + status.isAuthenticated + '\n'
    //   logStr += 'status: ' + JSON.stringify(status) + '\n'
    //   $('#loginTokenLabel').html(status.isAuthenticated)
    // } catch (e) {
    //   logStr += 'error: ' + status + '\n'
    //   $('#loginTokenLabel').html('error')
    // }
    console.warn(logStr)
    //$('#socketLabel').html(socketConfig.event.socket.CONNECT)
  })

  socket.on(socketConfig.event.socket.SUBSCRIBE /*'subscribe'*/, function(channelname, data) {
    //channelname, {channel: "test"}
    var logStr = '[socket.subscribe]\n'
    // logStr += 'channel: ' + channelname + '\n';
    // logStr += 'data: ' + JSON.stringify(data) + '\n';
    console.warn(logStr)
    //$('#socketLabel').html(socketConfig.event.socket.SUBSCRIBE)
  })
  //접속 실패 후, 소켓 close
  socket.on(socketConfig.event.socket.CLOSE /*'close'*/, function(error) {
    var logStr = '[socket.close]\n'
    logStr += 'error.code: ' + error + '\n'
    console.warn(logStr)
    //$('#socketLabel').html(socketConfig.event.socket.CLOSE)
  })
}

const socketClusterBinding = channel => {
  //소켓 접속 완료 상테 (connecting - 접속중 , close - 소켓 종료)
  if (socket != null) {
    if (socket.state === 'open') {
      if (channel == '') {
        alert('채널이 없습니다.')
        return
      }
      publicChannelHandle = socketChannelBinding(publicChannelHandle, channel)
    } else {
      alert('소켓 상태 = ' + socket.state)
    }
  } else {
    alert('소켓 null')
  }
}

const socketChannelBinding = (channelObj, channelObjName) => {
  if (channelObj == null) {
    socket.subscribe(channelObjName)
    alert(channelObjName + '채널 입장')
    return channelObj
    //console.log('채널 입장')
  }
}
const scDestory = () => {
  console.log('해제 전 소켓 상태 = ' + socket.getState())
  socket.disconnect()

  alert('소켓 해제')
  console.log('해제 후 소켓 상태 = ' + socket.getState())
}
if (socket !== null) {
  // socket.on(socketConfig.event.socket.CONNECT /*'connect'*/, function() {
  //   var logStr = '[socket.connect]\n'
  //   // try {
  //   //     logStr += 'isAuthenticated:' + status.isAuthenticated + '\n';
  //   //     logStr += 'status: ' + JSON.stringify(status) + '\n';
  //   //     $('#loginTokenLabel').html(status.isAuthenticated);
  //   // } catch (e) {
  //   //     logStr += 'error: ' + status + '\n';
  //   //     $('#loginTokenLabel').html('error');
  //   // }
  //   console.warn(logStr)
  //   //$('#socketLabel').html(socketConfig.event.socket.CONNECT);
  // })
}
const SendMessageChat = obj => {
  return
  //sendMessage.handle(publicChannelHandle, socketConfig.packet.send.PACKET_SEND_CHAT, {}, '테스트1 메세지입니다. - Channel Publish')
  sendMessage.socket(obj.roomNo, socketConfig.packet.send.PACKET_SEND_CHAT, {}, obj.message)
}

var sendMessageJson = function(cmd, params, msg) {
  if (cmd == /*'login'*/ socketConfig.packet.send.PACKET_SEND_LOGIN) {
    return {
      cmd: cmd,
      login: params, //user
      msg: msg //''
    }
  } else if (cmd == /*'loginToken'*/ socketConfig.packet.send.PACKET_SEND_LOGIN_TK) {
    return {
      cmd: cmd,
      loginToken: params, //user
      msg: msg //''
    }
  } else if (cmd == /*'emit'*/ socketConfig.packet.send.PACKET_SEND_EMIT) {
    return {
      cmd: cmd,
      emit: params, //self
      msg: msg //''
    }
  } else if (cmd == /*'chat'*/ socketConfig.packet.send.PACKET_SEND_CHAT) {
    return {
      cmd: cmd,
      chat: params, //self
      msg: msg //''
    }
  } else if (cmd == /*'chat'*/ socketConfig.packet.send.PACKET_SEND_CHAT_END) {
    return {
      cmd: cmd,
      chat: params, //self
      msg: msg //''
    }
  }
}
var sendMessage = {
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
      msg: 'message'
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
    var msgJson = sendMessageJson(type, param, msg)
    //해당 체널에 전체 메세지가 전송됨 (다른 채널에는 메세지 전송 안됨) ===== subscribe 구독하지 않아도 메세지 전송은 된다!!!
    /*{
      cmd: 'chat',
      chat: {
          memNo: '회원SEQ'
      },
      msg: 'message'
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
          msg: 'message'
      }*/
    // socket.emit('chat', sendMessageJson(type, param, msg), function(err, data) {
    //   if (err) {
    //     console.error('sendMessage emit error ' + err)
    //   } else {
    //     if (data.success) {
    //       //서버에서 필요한 작업 성공
    //       console.log('sendMessage emit: ' + JSON.stringify(data))
    //     } else {
    //       console.log('sendMessage emit: ' + JSON.stringify(data))
    //     }
    //   }
    // })
  },
  loginToken: function(user) {
    /*{
          cmd: 'loginToken',
          loginToken: {
          authToken: 'JWT토큰',
          memNo: '회원SEQ',
          locale: 'koKR'
          }
          msg: ''
      }*/
    // socket.emit('loginToken', sendMessageJson(socketConfig.packet.send.PACKET_SEND_LOGIN_TK, user, ''), function(err, success) {
    //   if (err) {
    //     console.error('sendMessage emit loginToken error ' + err)
    //     //$('#loginTokenLabel').html(err)
    //   } else {
    //     //$('#loginTokenLabel').html(success)
    //     if (success) {
    //       //서버에서 필요한 작업 성공
    //       console.log('sendMessage emit loginToken success: ' + success)
    //     } else {
    //       console.log('sendMessage emit loginToken fail: ' + success)
    //     }
    //   }
    // })
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
    // socket.emit('login', sendMessageJson(socketConfig.packet.send.PACKET_SEND_LOGIN, user, ''), function(err, success) {
    //   if (err) {
    //     console.error('sendMessage emit login error ' + err)
    //     //$('#socketLoginLabel').html(err)
    //   } else {
    //     //$('#socketLoginLabel').html(success)
    //     if (success) {
    //       //서버에서 필요한 작업 성공
    //       console.log('sendMessage emit login success: ' + success)
    //     } else {
    //       console.log('sendMessage emit login fail: ' + success)
    //     }
    //   }
    // })
  }
}

export default props => {
  //---------------------------------------------------------------------
  const context = useContext(Context)
  console.log(props)
  // useEffect(() => {
  //   loginInfo = context.token
  //   //console.warn('소켓 처음 연결 = ' + loginInfo.isLogin ? '로그인' : '비로그인' + '회원')
  //   scConnection(loginInfo)
  // }, [])

  return (
    <>
      <Content>
        <button onClick={() => scConnection(loginInfo)}>소켓 연결</button>
        <br></br>
        <button onClick={() => scDestory()}>소켓 해제</button>
        <br></br>
        <button onClick={() => socketClusterBinding('channel.public.dalbit')}>채널입장</button>
        <br></br>
        {/* <button onClick={() => socketClusterDestory(false, 'channel.public.dalbit')}>채널퇴장</button> */}
        <br></br>
        <button onClick={() => SendMessageChat()}>채팅메세지(channel Pulblish)</button>
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
