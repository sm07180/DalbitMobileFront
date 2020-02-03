/**
 * @file chat.js
 * @brief 채팅
 */
import React, {useEffect, useContext, useState} from 'react'
import styled from 'styled-components'
//context
import {Context} from 'pages/live/store'
//components
import Api from 'context/api'
//
export default props => {
  //---------------------------------------------------------------------
  //context
  const store = useContext(Context)
  //useState
  const [fetch, setFetch] = useState(null)
  //---------------------------------------------------------------------
  //fetch
  async function fetchData(obj) {
    const res = await Api.broad_list({...obj})
    //Error발생시
    if (res.result === 'fail') {
      console.log(res.message)
    }
    setFetch(res)
    console.log(res)
  }
  //update
  var client = new XMLHttpRequest()
  client.open('GET', 'live', true)
  client.send()

  client.onreadystatechange = function() {
    console.log('1')
    if (this.readyState == this.HEADERS_RECEIVED) {
      console.log('2')
      var contentType = client.getResponseHeader('customHeader')
      var contentType2 = client.getResponseHeader('authToken')
      var contentType3 = client.getAllResponseHeaders()
      var contentType4 = client.getResponseHeader('Content-Type')

      console.log('contentType = ' + contentType)
      console.log('contentType2 = ' + contentType2)
      console.log('contentType3 = ' + contentType3)
      console.log('contentType4 = ' + contentType4)
      // if (contentType != my_expected_type) {
      //   client.abort();
      // }
    }
  }

  function update(mode) {
    switch (true) {
      default:
        break
    }
  }
  /**
   *
   * @returns
   */
  useEffect(() => {
    //방송방 리스트
    fetchData({params: {roomType: 0, page: 1, records: 0}})
  }, [])
  //---------------------------------------------------------------------
  return (
    <Content>
      <div className="wrap">
        <h1>리스트123123123</h1>
      </div>
    </Content>
  )
}
//---------------------------------------------------------------------
const Content = styled.div`
  max-width: 1920px;
  width: 100%;
  padding: 0 50px;
  box-sizing: border-box;
  .wrap {
    min-height: 200px;
    background: #e1e1e1;
  }
`
