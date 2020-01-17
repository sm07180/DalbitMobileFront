/**
 * @file /app/index.js
 * @brief Native-App WEBVIEW
 */
import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {osName, browserName} from 'react-device-detect'
//layout
import Layout from 'Pages/common/layout'
//material-ui
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Select from '@material-ui/core/Select'
//
import Api from 'Context/api'
//
export default () => {
  //---------------------------------------------------------------------
  //useState
  const [changes, setChanges] = useState({streamId: 'steam1', token: '', clientMode: 'play'})

  //eventHander
  const handleChange = event => {
    setChanges({...changes, [event.target.name]: event.target.value})
  }
  //useEffect
  useEffect(() => {
    console.table(changes)
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
                    window.android.RoomJoin(changes)
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
                //IOS
                switch (osName) {
                  case 'Windows':
                    alert(changes.room_id)
                    break
                  case 'iOS':
                    webkit.messageHandlers.RoomMake.postMessage(changes.room_id)
                    break
                  case 'Android':
                    window.android.RoomMake(changes.room_id)
                    break
                  default:
                    alert('OS 예외처리')
                    break
                }

                // console.log(changes)
              }}>
              방만들기
            </Button>
          </dd>
        </dl>
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
