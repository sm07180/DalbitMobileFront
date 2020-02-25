/**
 * @title
 */
import React, {useContext, useState} from 'react'
import styled from 'styled-components'
//context
import {Context} from 'context'

export default () => {
  //---------------------------------------------------------------------
  const context = useContext(Context)
  //---------------------------------------------------------------------
  return (
    <Content>
      <dl>
        <dt>
          <button
            onClick={() => {
              context.action.alert({
                //콜백처리
                callback: () => {
                  alert('alert callback 기본')
                },
                title: '로그인에러!',
                msg: `메시지내용입니다. \n2줄메시지내용입니다.`
              })
            }}>
            Alert(타이틀,메시지,콜백)
          </button>
        </dt>
      </dl>
      <dl>
        <dt>
          <button
            onClick={() => {
              const imgUrl = 'https://devimage.dalbitcast.com/images/api/ic_logo_normal.png'
              const element = `
              <div><img src=${imgUrl}></div>
              <ol><li>ol-li tab 타입1</li><li>타입1</li></ol>`
              context.action.alert({
                //콜백처리
                callback: () => {
                  alert('alert callback 확인하기')
                },
                title: '로그인에러!',
                msg: element
              })
            }}>
            Alert(타이틀,메시지(html타입),콜백)
          </button>
        </dt>
      </dl>
      <dl>
        <dt>
          <button
            onClick={() => {
              const imgUrl = 'https://devimage.dalbitcast.com/images/api/ic_logo_normal.png'
              const element = `
              <div><img src=${imgUrl}></div>
              <a href="https://devwww2.dalbitcast.com/" target="_blank">개발사이트로 이동</a>
              `
              context.action.confirm({
                //콜백처리
                callback: () => {
                  alert('Confirm callback 확인하기')
                },
                //캔슬콜백처리
                cancelCallback: () => {
                  alert('confirm callback 취소하기')
                },
                title: '회원가입 완료입니다.',
                msg: element
              })
            }}>
            Confirm
          </button>
        </dt>
        <dd></dd>
      </dl>
    </Content>
  )
}
//---------------------------------------------------------------------
const Content = styled.div`
  dl {
    display: block;
    margin-bottom: 30px;
    button {
      display: inline-block;
      padding: 10px 30px;
      background: #000;
      color: #fff;
    }
  }
`
