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
    setFetch(res.data)
  }

  //makeContents
  const makeContents = () => {
    if (fetch === null) return
    return fetch.list.map((list, idx) => {
      const {bgImg, title} = list
      console.log(list)
      return (
        <a key={idx} href="">
          {title}
          <img src={`${bgImg}`} />
        </a>
      )
    })
  }
  /**
   *
   * @returns
   */
  useEffect(() => {
    //방송방 리스트
    fetchData({params: {page: 1, records: 10}})
    //fetchData({params: {roomType: 0, page: 1, records: 0}})
  }, [])
  //---------------------------------------------------------------------
  return (
    <Content>
      <div className="wrap">
        <h1>리스트123123123</h1>
        {makeContents()}
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
