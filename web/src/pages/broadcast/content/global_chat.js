/**
 *  @example
 * import Socket ,{setServiceConfig} from 'pages/broadcast/content/global_chat'
 *
 */
//---------------------------------------------------------------------
export default class Socket {
  /////////////////////////////////////////////////////////////////////
  //서비스 설정
  //var isServiceConfig = null
  static setServiceConfig = () => {
    socketConfig.socketServerPort = 8000
    socketConfig.socketServerHost = 'devsv1.dalbitcast.com'
    socketConfig.socketServerSecure = true
    socketConfig.restServer = 'https://devsv1.dalbitcast.com:8000'
  }
  /////////////////////////////////////////////////////////////////////

  //http://localhost:8000/?c1=public.channel.id&c2=private.user.id&h=localhost&p=8000

  /*var privateUniqueValue = new Date();
privateUniqueValue = String(privateUniqueValue.getHours()) +
                        String(privateUniqueValue.getMinutes()) +
                        String(privateUniqueValue.getSeconds()) +
                        String(privateUniqueValue.getMilliseconds()) +
                        String(Math.floor(Math.random() * 1000));*/

  //socket 설정
  static socketConfig = {
    socketServerPort: 8001,
    socketServerHost: '121.134.5.158', //devsv1.dalbitcast.com //devsv1.wawatoc.com
    socketServerSecure: false, //true=https
    //<== socketServerHost 로 접속이 안되면 다른 socketServerHost 로 접속시도를 하는 부분이 추기되어야 할것 같다.!

    //restServer: 'https://devsv1.dalbitcast.com:8000', //RESTful Server
    restServer: 'http://121.134.5.158:8001', //RESTful Server

    locale: {
      ko_KR: 'koKR',
      en_US: 'enUS'
    },

    channel: {
      //public 채널명
      //public.channel.serviceName 형식으로 사용하자.
      publicChannelName: 'channel.public.dalbit' //'public.channel',

      //private 채널명(채팅방)
      //private.user.id 형식으로 사용하자.
      //privateChannelName: 'channel.', //'channel.private.' //'private.user.' + privateUniqueValue
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

  // if (isServiceConfig) {
  //   setServiceConfig()
  // }

  /************************************************************/

  //query string parser
  /*function getQueryStringObject() {
    var a = window.location.search.substr(1).split('&');
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i) {
        var p = a[i].split('=', 2);
        if (p.length == 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
}

var qs = getQueryStringObject();
if (qs.c1 != undefined) {
    socketConfig.channel.publicChannelName = qs.c1;
}
if (qs.c2 != undefined) {
    socketConfig.channel.privateChannelName = qs.c2;
}
if (qs.h != undefined) {
    socketConfig.socketServerHost = qs.h;
}
if (qs.p != undefined) {
    socketConfig.socketServerPort = qs.p;
}*/

  /************************************************************/

  //socket object
  // const socket = null

  // //public subscribe object
  // const publicChannelHandle = null

  // //private subscribe object
  // const privateChannelHandle = null

  //로그인 접속자 정보 (JSON)
  //var joinUserInfo = null;
  /*var joinUserJson = function(authToken, id, nk, sex, age, level, img, mic, streamId) {
    joinUserInfo = {
        authToken: authToken,
        id: id,
        nk: nk,
        sex: sex,
        age: age,
        level: level,
        img: img,
        mic: mic,
        sid: streamId
    };
    return joinUserInfo;
};*/
  static joinUserJson = () => {
    var memTid = $('#memTid').val()
    var memNo = $('#memNo').val()
    if (memTid != '' && memNo != '') {
      return {
        authToken: memTid,
        memNo: memNo,
        locale: socketConfig.locale.ko_KR
      }
    } else {
      return null
    }
  }

  //전송 메세지 형식 (JSON)
  static sendMessageJson = (cmd, params, msg) => {
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
    //return {
    //    //user: joinUserInfo,
    //    cmd: cmd, //text
    //    params: params, //json {param: value}
    //    msg: msg //text
    //};
  }

  //메세지 수신 JSON
  /*
{
    cmd: 'chat',
    params: {},
    msg: '',
    user: {
        authToken: '1',
        memNo: 'memNo',
        id: 'id',
        nk: 'nk_1',
        sex: 'sex_1',
        age: 'age_1',
        level: 'level_1'
    }
}
{
    cmd: 'connect',
    params: {},
    msg: {
        msg: '', 
        count: 1
    },
    user: {
        authToken: '1',
        memNo: 'memNo',
        id: 'id',
        nk: 'nk_1',
        sex: 'sex_1',
        age: 'age_1',
        level: 'level_1'
    }
}
*/

  /************************************************************/

  static axiosGet = (url, params, headers, callback) => {
    axios
      .get(socketConfig.restServer + url, {
        params: params,
        headers: headers,
        validateStatus: function(status) {
          return status == 200
        }
      })
      .then(function(response) {
        callback(null, response.data)
        /*alert(JSON.stringify(response.data));
        console.log('response: ' + response.data);
        console.log('response: ' + response.status);
        console.log('response: ' + response.statusText);
        console.log('response: ' + response.headers);
        console.log('response: ' + response.config);
        console.log('response: ' + response.request);*/
      })
      .catch(function(error) {
        callback(error)
        /*if (error.response) {
            console.log('error: ' + error.response.data);
            console.log('error: ' + error.response.status);
            console.log('error: ' + error.response.headers);
        } else if (error.request) {
            console.log('error: ' + error.request);
        } else {
            console.log('error: ' + error.message);
        }
        console.log(error.config);*/
      })
    /*.finally(function () {
        console.log('done');
    });*/
  }

  static axiosPost = (url, params, headers, callback) => {
    axios
      .post(socketConfig.restServer + url, params, {
        headers: headers,
        validateStatus: function(status) {
          return status == 200
        }
      })
      .then(function(response) {
        callback(null, response.data)
        /*alert(JSON.stringify(response.data));
        console.log('response: ' + response.data);
        console.log('response: ' + response.status);
        console.log('response: ' + response.statusText);
        console.log('response: ' + response.headers);
        console.log('response: ' + response.config);
        console.log('response: ' + response.request);*/
      })
      .catch(function(error) {
        callback(error)
        /*if (error.response) {
            console.log('error: ' + error.response.data);
            console.log('error: ' + error.response.status);
            console.log('error: ' + error.response.headers);
        } else if (error.request) {
            console.log('error: ' + error.request);
        } else {
            console.log('error: ' + error.message);
        }
        console.log(error.config);*/
      })
    /*.finally(function () {
        console.log('done');
    });*/
  }

  static axiosDelete = (url, params, headers, callback) => {
    axios
      .delete(socketConfig.restServer + url, {
        params: params,
        headers: headers,
        validateStatus: function(status) {
          return status == 200
        }
      })
      .then(function(response) {
        callback(null, response.data)
        /*alert(JSON.stringify(response.data));
        console.log('response: ' + response.data);
        console.log('response: ' + response.status);
        console.log('response: ' + response.statusText);
        console.log('response: ' + response.headers);
        console.log('response: ' + response.config);
        console.log('response: ' + response.request);*/
      })
      .catch(function(error) {
        callback(error)
        /*if (error.response) {
            console.log('error: ' + error.response.data);
            console.log('error: ' + error.response.status);
            console.log('error: ' + error.response.headers);
        } else if (error.request) {
            console.log('error: ' + error.request);
        } else {
            console.log('error: ' + error.message);
        }
        console.log(error.config);*/
      })
    /*.finally(function () {
        console.log('done');
    });*/
  }

  static axiosPut = (url, params, headers, callback) => {
    axios
      .put(socketConfig.restServer + url, params, {
        headers: headers,
        validateStatus: function(status) {
          return status == 200
        }
      })
      .then(function(response) {
        callback(null, response.data)
        /*alert(JSON.stringify(response.data));
        console.log('response: ' + response.data);
        console.log('response: ' + response.status);
        console.log('response: ' + response.statusText);
        console.log('response: ' + response.headers);
        console.log('response: ' + response.config);
        console.log('response: ' + response.request);*/
      })
      .catch(function(error) {
        callback(error)
        /*if (error.response) {
            console.log('error: ' + error.response.data);
            console.log('error: ' + error.response.status);
            console.log('error: ' + error.response.headers);
        } else if (error.request) {
            console.log('error: ' + error.request);
        } else {
            console.log('error: ' + error.message);
        }
        console.log(error.config);*/
      })
    /*.finally(function () {
        console.log('done');
    });*/
  }
}
