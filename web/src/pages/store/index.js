/**
 * @file /store/index.js
 * @brief 스토어
 */
import React, {useEffect, useState, useContext} from 'react'
import styled from 'styled-components'
//layout
import Layout from 'pages/common/layout'
//context
import {Context} from 'context'
//components
//
export default props => {
  const context = useContext(Context)
  //---------------------------------------------------------------------
  //useEffect
  useEffect(() => {}, [])
  //---------------------------------------------------------------------
  return (
    <Layout {...props}>
      <Content>
        <div>
          <button
            onClick={() => {
              context.action.alert({
                //콜백처리
                callback: () => {
                  console.log('----callback 예제')
                },
                title: '로그인에러!',
                msg: `메시지내용입니다메시지내용입니다메시지내용입니다메시지내용입니다메시지내용입니다. \n2줄메시지내용입니다.`
              })
            }}>
            Alert
          </button>
        </div>
        <div>
          <button
            onClick={() => {
              context.action.alert({
                //콜백처리
                callback: () => {
                  console.log('callback처리')
                },
                title: '로그인에러!',
                msg: '<ol><li>타입1</li><li>타입1</li></ol>'
              })
            }}>
            Alert
          </button>
        </div>
        <div>
          <button
            onClick={() => {
              context.action.confirm({
                //콜백처리
                callback: () => {
                  console.log('confirm처리')
                },
                cancelCallback: () => {
                  console.log('cancel콜백')
                },
                msg: 'confirm'
              })
            }}>
            Confirm
          </button>
        </div>
      </Content>
    </Layout>
  )
}

//---------------------------------------------------------------------

const Content = styled.section`
  min-height: 300px;
  background: #e1e1e1;
  button {
    display: inline-block;
    margin: 10px;
    padding: 10px;
    background: #ff0000;
    color: #fff;
  }
`
