/**
 * @file /app/index.js
 * @brief Native-App WEBVIEW
 */
import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import axios from 'axios'
//components
import {GoogleLogin} from 'react-google-login'

import {osName, browserName} from 'react-device-detect'

//layout
import Layout from 'pages/common/layout'
//material-ui
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Select from '@material-ui/core/Select'
//
import Api from 'context/api'
import {Hybrid} from 'context/hybrid'
//
export default () => {
  //---------------------------------------------------------------------
  //useState
  const [info, setInfo] = useState()
  const [changes, setChanges] = useState({streamId: 'steam1', token: '', clientMode: 'play'})

  //eventHander
  const handleChange = event => {
    setChanges({...changes, [event.target.name]: event.target.value})
  }

  async function fetchData() {
    const res = await Api.member_login({
      data: {
        memType: 'p',
        memId: '010-1234-1234',
        memPwd: '1234',
        os: 1,
        deviceId: '2200DDD1-77A',
        deviceToken: '45E3156FDE20E7F11AF',
        appVer: '1.0.0.1',
        appAdId: 'asd123asdas1'
      }
    })
    console.log(JSON.stringify(res.data))
    if (res) {
      switch (osName) {
        case 'Windows':
          alert(JSON.stringify())
          break
        case 'iOS':
          console.log('PC -> IOS')
          webkit.messageHandlers.GetLoginToken.postMessage(res.data)
          break
        case 'Android':
          window.android.GetLoginToken(JSON.stringify(res.data))
          break
        default:
          alert('OS 예외처리')
          break
      }
    }
  }

  //useEffect
  useEffect(() => {
    //const value = document.getElementById('CUSTOMHEADER').value

    const client = new XMLHttpRequest()
    client.open('GET', 'live', true)
    client.send()
    client.onreadystatechange = function() {
      console.log('1')
      if (this.readyState == this.HEADERS_RECEIVED) {
        var contentType = client.getResponseHeader('customHeader')
        var contentType2 = client.getResponseHeader('authtoken')
        var contentType3 = client.getAllResponseHeaders()
        alert(contentType3)
        var contentType4 = client.getResponseHeader('Content-Type')

        console.log('customHeader = ' + contentType)
        console.log('authtoken = ' + contentType2)
        console.log('All-context = ' + contentType3)
        console.log('contentType = ' + contentType4)

        // if (contentType != my_expected_type) {
        //   client.abort();
        // }
        setInfo(contentType3)
      }
    }
  }, [changes])
  //---------------------------------------------------------------------
  return (
    <Layout>
      <Content>
        <section>{JSON.stringify(changes, null, 1)}</section>
        <section>
          <span>OS: {osName}</span>
          <span>browserName : {browserName}</span>
        </section>
        <h1>로그인_@</h1>
        <dl>
          <dt>
            <TextField name="streamId" label="streamId" placeholder="streamId 를 입력해주세요" onChange={handleChange} />
          </dt>
          <dt>
            <TextField name="token" label="token" placeholder="token 를 입력해주세요" onChange={handleChange} />
          </dt>
          <dt>
            <h2>clientMode</h2>
            <select name="clientMode" label="clientMode" onChange={handleChange}>
              <option value="play">play</option>
              <option value="join">join</option>
              <option value="publish">publish</option>
            </select>
          </dt>
          <dd>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                switch (osName) {
                  case 'Windows':
                    alert(JSON.stringify(changes))
                    break
                  case 'iOS':
                    webkit.messageHandlers.RoomJoin.postMessage(changes)
                    break
                  case 'Android':
                    window.android.RoomJoin(JSON.stringify(changes))
                    break
                  default:
                    alert('OS 예외처리')
                    break
                }
              }}>
              로그인(RoomJoin)
            </Button>
          </dd>
        </dl>
        <h1>방만들기</h1>
        <dl>
          <dt>
            <TextField name="room_id" label="ROOM_ID" placeholder="방번호를 입력하세요" onChange={handleChange} />
          </dt>
          <dd>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                Hybrid('RoomMake', changes)
                //IOS
                switch (osName) {
                  case 'Windows':
                    alert(changes.room_id)
                    break
                  case 'iOS':
                    webkit.messageHandlers.RoomMake.postMessage(changes.room_id)
                    break
                  case 'Android':
                    window.android.RoomMake(JSON.stringify(changes.room_id))
                    break
                  default:
                    alert('OS 예외처리')
                    break
                }
              }}>
              방만들기
            </Button>
          </dd>
        </dl>
        <h1>SNS 로그인</h1>
        <dl>
          <dd>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                fetchData()
              }}>
              로그인 (AuthToken)
            </Button>
          </dd>
        </dl>
        <h1>Hybrid 테스트2222</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            Hybrid('RoomMake', changes)
          }}>
          방만들기
        </Button>

        <section>{JSON.stringify(info)}</section>
      </Content>
    </Layout>
  )
}
//---------------------------------------------------------------------
const Content = styled.section`
  padding: 100px 20px;
  box-sizing: border-box;
  select {
    padding: 10px 20px;
    box-sizing: border-box;
    background: #e1e1e1;
    font-size: 16px;
  }
  section {
    padding: 10px;
    color: #111;
    background: #eee;
    text-align: center;
    box-sizing: border-box;
    span {
      margin-right: 10px;
      background: #ccc;
    }
  }
  dl {
    > * {
      min-width: 200px;
      padding: 20px;
      box-sizing: border-box;
    }
    dt {
      display: inline-block;
    }
  }
`
