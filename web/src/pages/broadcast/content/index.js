/**
 * @file chat.js
 * @brief 채팅
 */
import React, {useEffect, useContext, useState} from 'react'
import styled from 'styled-components'
//context
import {Context} from 'pages/live/store'
//hooks
import useChange from 'components/hooks/useChange'
//components
import Api from 'context/api'

//
export default props => {
  //---------------------------------------------------------------------
  //context
  const store = useContext(Context)
  //hooks
  const {changes, setChanges, onChange} = useChange(update, {
    onChange: -1,
    entryType: 0,
    os: 3,
    roomType: 1,
    welcomMsg: '하이',
    bgImg: '/temp/2020/02/03/10/20200203102802930921.jpg',
    title: '프론트엔드'
  })
  //useState
  const [fetch, setFetch] = useState(null)
  //---------------------------------------------------------------------
  //fetch
  async function fetchData(obj) {
    const res = await Api.broad_create({...obj})
    //Error발생시
    if (res.result === 'fail') {
      console.log(res.message)
      return
    }
    console.log(res)
    setFetch(res.data)
  }
  //update
  function update(mode) {
    switch (true) {
      case mode.onChange !== undefined:
        //console.log(JSON.stringify(changes))
        break
    }
  }
  /**
   *
   * @returns
   */
  useEffect(() => {
    //방송방 리스트
  }, [])
  //---------------------------------------------------------------------
  return (
    <Content>
      <div className="wrap">
        <h1>방송설정</h1>
        <button
          onClick={() => {
            fetchData({data: changes})
          }}>
          만들기
        </button>
        <section>
          {/*
           * @param string roomNo               //*방송방번호
           * @param int roomType                //*방송종류
           * @param string title                //*제목
           * @param string bgImg                //백그라운드 이미지 경로
           * @param string bgImgDel             //삭제할 백그라운드 이미지 경로
           * @param int bgImgRacy               //백그라운드 구글 선정성
           * @param string welcomMsg            //환영 메시지
           * @param string notice               //공지사항
           * @param int os                      //*OS 구분(1:Android,2:IOS,3:PC)
           * @param string deviceId             //디바이스 고유아이디
           * @param string deviceToken          //디바이스 토큰
           * @param string appVer               //앱 버전 */}
          <dl>
            <dt>*방송방번호</dt>
            <dd>
              <input name="roomNo" placeholder="방송방번호" onChange={onChange} />
            </dd>
          </dl>
          <dl>
            <dt>*방송종류</dt>
            <dd>
              <select name="roomType" onChange={onChange}>
                <option value="0">방송종류 0</option>
                <option value="1">방송종류 1</option>
              </select>
              {/* <input name="roomType" data-type="number" placeholder="방송종류" onChange={onChange} /> */}
            </dd>
          </dl>
          <dl>
            <dt>*제목</dt>
            <dd>
              <input name="title" placeholder="제목" onChange={onChange} />
            </dd>
          </dl>
          <dl>
            <dt>백그라운드 이미지 경로</dt>
            <dd>
              <input name="bgImg" placeholder="백그라운드 이미지 경로" onChange={onChange} />
            </dd>
          </dl>
          <dl>
            <dt>삭제할 백그라운드 이미지 경로</dt>
            <dd>
              <input name="bgImgDel" placeholder="삭제할 백그라운드 이미지 경로" onChange={onChange} />
            </dd>
          </dl>
          <dl>
            <dt>*os</dt>
            <dd>
              <select name="os" onChange={onChange}>
                <option value="1">Android</option>
                <option value="2">IOS</option>
                <option value="3">PC</option>
              </select>
              {/* <input name="os" placeholder="OS 구분(1:Android,2:IOS,3:PC)" onChange={onChange} /> */}
            </dd>
          </dl>
          <dl>
            <dt>환영 메시지</dt>
            <dd>
              <input name="bgImgDel" placeholder="환영 메시지" onChange={onChange} />
            </dd>
          </dl>
          <dl>
            <dt>환영 메시지</dt>
            <dd>
              <input name="bgImgDel" placeholder="환영 메시지" onChange={onChange} />
            </dd>
          </dl>
          <dl>
            <dt>deviceId</dt>
            <dd>
              <input name="deviceId" placeholder="디바이스 고유아이디" onChange={onChange} />
            </dd>
          </dl>
          <dl>
            <dt>deviceToken</dt>
            <dd>
              <input name="deviceToken" placeholder="디바이스 토큰" onChange={onChange} />
            </dd>
          </dl>
          <dl>
            <dt>appVer</dt>
            <dd>
              <input name="appVer" placeholder="앱 버전" onChange={onChange} />
            </dd>
          </dl>
        </section>
      </div>
      <section>{JSON.stringify(changes, null, 1)}</section>
    </Content>
  )
}
//---------------------------------------------------------------------
const Content = styled.div`
  max-width: 1920px;
  width: 100%;
  padding: 0 50px;
  box-sizing: border-box;
  button {
    display: block;
    background: orange;
    color: #000;
    width: 100%;
    font-size: 20px;
  }
  section {
    padding: 50px 0;
    box-sizing: border-box;

    dl {
      display: flex;
      width: 100%;
      margin-bottom: 10px;
      dt {
        flex: 1;
        font-size: 16px;
        padding-right: 20px;
        text-align: left;
        box-sizing: border-box;
      }
      dd {
        flex: 5;
        input,
        select {
          display: block;
          width: 100%;
          padding: 10px 20px;
          color: #fff;
          background: #111;
          box-sizing: border-box;
        }
      }
    }
  }
`
