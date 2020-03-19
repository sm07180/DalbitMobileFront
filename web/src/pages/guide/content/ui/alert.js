/**
 * @title
 */
import React, {useContext, useState} from 'react'
import styled from 'styled-components'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

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

                msg: `저작권자의 허락을 받지 않고
                저작재산권 또는 저작인격권을
                침해하는 방법으로 저작물을
                이용하는 행위를 할 경우,
                저작권법 136조 제1항 제1호
                위반으로 형사처벌 대상이 될 수
                있습니다.`
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
              const imgUrl = `${IMG_SERVER}/images/api/ic_logo_normal.png`
              const element = `
              <div><img src=${imgUrl}></div>
              <ol><li>ol-li tab 타입1</li><li>타입1</li></ol>`

              context.action.alert({
                //콜백처리
                callback: () => {
                  //alert('alert callback 확인하기')
                  setTimeout(() => {
                    context.action.alert({
                      //콜백처리
                      title: '창2!',
                      msg: element
                    })
                  }, 0)
                },
                title: '창1!',
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
              context.action.confirm({
                //콜백처리
                callback: () => {
                  alert('Confirm callback 확인하기')
                },
                //캔슬콜백처리
                cancelCallback: () => {
                  alert('confirm callback 취소하기')
                },
                msg: `보유한 달이 부족합니다.\n달 충전을 하시겠습니까?`
              })
            }}>
            Confirm1
          </button>
        </dt>
      </dl>
      <dl>
        <dt>
          <button
            onClick={() => {
              const imgUrl = `${IMG_SERVER}/images/api/ic_logo_normal.png`
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
            Confirm2
          </button>
        </dt>
      </dl>
      <dl>
        <dt>
          <button
            onClick={() => {
              const imgUrl = `${IMG_SERVER}/images/api/ic_logo_normal.png`
              const element = `
              <div><img src=${imgUrl}></div>
              <a href="https://devwww2.dalbitcast.com/" target="_blank">개발사이트로 이동</a>
              `
              context.action.confirm({
                //콜백처리
                callback: () => {
                  console.log('Confirm callback 확인하기')
                },
                //캔슬콜백처리
                cancelCallback: () => {
                  console.log('confirm callback 취소하기')
                },
                title: '회원가입 완료입니다.',
                msg: element,
                buttonText: {
                  left: '취소->이름변경',
                  right: '확인->이름변경'
                }
              })
            }}>
            buttonText변경처리
          </button>
        </dt>
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
